import { Response, NextFunction } from 'express';
import { Lesson, UserLessonProgress } from '@/models/Lesson';
import { ApiError } from '@/errors/ApiError';
import {
    LessonCompleteRequest,
    LessonGetAllRequest,
    LessonGetByIdRequest,
} from '@/types/requestTypes';
import { calculateDetailedStats } from '@/utils/training/calculateStats';
import {
    MAX_CORRECTIONS_FOR_LESSON,
    MAX_ERRORS_FOR_LESSON,
} from '@/constants/stats';
import { User } from '@/models/User';
import { addExpToUser, calculateExp } from '@/utils/levelSystem';

class LessonsController {
    async getAll(req: LessonGetAllRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            const lessons = await Lesson.find().sort({ order: 1 }).lean();
            const progresses = userId
                ? await UserLessonProgress.find({ userId }).lean()
                : [];

            const progressMap = new Map(
                progresses.map((p) => [p.lessonId.toString(), p.stars]),
            );

            const result = lessons.map((lesson) => ({
                ...lesson,
                id: lesson._id.toString(),
                stars: progressMap.get(lesson._id.toString()) ?? 0,
            }));

            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async getById(
        req: LessonGetByIdRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            if (typeof id !== 'string' || id.length !== 24) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_id') ?? 'Invalid lesson ID',
                    ),
                );
            }

            const lesson = await Lesson.findById(id).lean();

            if (!lesson) {
                return next(
                    ApiError.notFound(
                        req.t?.('errors.session_not_found') ??
                            'Lesson not found',
                    ),
                );
            }

            const sequence = generateLessonSequence(
                lesson.allowedChars,
                lesson.length,
            );

            res.status(200).json({
                id: lesson._id,
                title: lesson.title,
                layout: lesson.layout,
                sequence,
                prevLessonId: lesson.prevLessonId,
                nextLessonId: lesson.nextLessonId,
            });
        } catch (e) {
            next(e);
        }
    }

    async complete(
        req: LessonCompleteRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            if (typeof id !== 'string' || id.length !== 24) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_id') ?? 'Invalid lesson ID',
                    ),
                );
            }

            const { input, events, finishedAt, startedAt, sequence } = req.body;

            if (
                !Array.isArray(input) ||
                !Array.isArray(events) ||
                typeof startedAt !== 'number' ||
                typeof finishedAt !== 'number' ||
                !Array.isArray(sequence) ||
                sequence.some(
                    (char) => typeof char !== 'string' || char.length !== 1,
                )
            ) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_fields') ??
                            'Invalid lesson completion data',
                    ),
                );
            }

            const userId = req.user?.id;
            if (!userId)
                return next(
                    ApiError.unauthorized(
                        req.t?.('errors.unauthorized') ?? 'Unauthorized',
                    ),
                );

            const lesson = await Lesson.findById(id).lean();
            if (!lesson)
                return next(
                    ApiError.notFound(
                        req.t?.('errors.session_not_found') ??
                            'Lesson not found',
                    ),
                );

            if (sequence.some((char) => !lesson.allowedChars.includes(char))) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_sequence') ??
                            'Invalid sequence',
                    ),
                );
            }

            const stats = calculateDetailedStats(
                events,
                startedAt,
                finishedAt,
                input,
                sequence,
            );

            if (stats.accuracy < lesson.minAccuracy) {
                return res.status(200).json({
                    stars: 0,
                    stats: {
                        ...stats,
                        layout: lesson.layout,
                        lesson,
                    },
                    message: req.t?.('messages.low_accuracy')
                        ? `${req.t?.('messages.low_accuracy')} (< ${
                              lesson.minAccuracy
                          }%)`
                        : `Minimum accuracy not reached (< ${lesson.minAccuracy}%)`,
                });
            }

            if (stats.corrections > MAX_CORRECTIONS_FOR_LESSON) {
                return res.status(200).json({
                    stars: 0,
                    stats: {
                        ...stats,
                        layout: lesson.layout,
                        lesson,
                    },
                    message: req.t?.('messages.too_many_corrections')
                        ? ` ${req.t?.(
                              'messages.too_many_corrections',
                          )} (> ${MAX_CORRECTIONS_FOR_LESSON}) `
                        : `Too many corrections (> ${MAX_CORRECTIONS_FOR_LESSON})`,
                });
            }

            if (stats.textErrorsCount > MAX_ERRORS_FOR_LESSON) {
                return res.status(200).json({
                    stars: 0,
                    stats: {
                        ...stats,
                        layout: lesson.layout,
                        lesson,
                    },
                    message: req.t?.('messages.too_many_errors')
                        ? ` ${req.t?.(
                              'messages.too_many_errors',
                          )} (> ${MAX_ERRORS_FOR_LESSON}) `
                        : `Too many errors (${MAX_ERRORS_FOR_LESSON})`,
                });
            }

            let stars = 0;
            if (stats.cpm >= lesson.cpmFor1) stars = 1;
            if (stats.cpm >= lesson.cpmFor2) stars = 2;
            if (stats.cpm >= lesson.cpmFor3) stars = 3;

            if (stars === 0) {
                return res.status(200).json({
                    stars: 0,
                    stats: {
                        ...stats,
                        layout: lesson.layout,
                        lesson,
                    },
                    message: req.t?.('messages.low_speed') ?? 'WPM too low',
                });
            }

            const user = await User.findById(userId);
            let exp = null;

            if (user) {
                const earnedExp = calculateExp({
                    cpm: stats.cpm,
                    accuracy: stats.accuracy,
                    charCount: sequence.length,
                });

                const levelUpResult = addExpToUser(user, earnedExp);
                await user.save();

                exp = {
                    earned: earnedExp,
                    level: levelUpResult.newLevel,
                    current: levelUpResult.currentExp,
                    required: levelUpResult.requiredExp,
                };
            }

            const progress = await UserLessonProgress.findOneAndUpdate(
                { userId, lessonId: lesson._id },
                { $max: { stars } },
                { upsert: true, new: true },
            );

            return res.status(200).json({
                message:
                    req.t?.('messages.lesson_completed') ?? 'Lesson completed',
                stats: {
                    ...stats,
                    layout: lesson.layout,
                    lesson,
                },
                stars,
                exp,
            });
        } catch (e) {
            next(e);
        }
    }
}

function generateLessonSequence(
    allowedChars: string,
    length: number,
): string[] {
    const result: string[] = [];
    for (let i = 0; i < length; i++) {
        const char =
            allowedChars[Math.floor(Math.random() * allowedChars.length)];
        result.push(char);
    }
    return result;
}

export const lessonsController = new LessonsController();
