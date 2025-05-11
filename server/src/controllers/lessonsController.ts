import { Response, NextFunction } from 'express';
import { Lesson, UserLessonProgress } from '@/models/Lesson';
import { ApiError } from '@/errors/ApiError';
import {
    LessonCompleteRequest,
    LessonGetAllRequest,
    LessonGetByIdRequest,
} from '@/types/requestTypes';

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
            const { cpm, accuracy } = req.body;

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

            if (accuracy < lesson.minAccuracy) {
                return res.status(200).json({
                    stars: 0,
                    message:
                        req.t?.('messages.low_accuracy') ??
                        'Minimum accuracy not reached',
                });
            }

            let stars = 0;
            if (cpm >= lesson.cpmFor1) stars = 1;
            if (cpm >= lesson.cpmFor2) stars = 2;
            if (cpm >= lesson.cpmFor3) stars = 3;

            if (stars === 0) {
                return res.status(200).json({
                    stars: 0,
                    message: req.t?.('messages.low_speed') ?? 'WPM too low',
                });
            }

            const progress = await UserLessonProgress.findOneAndUpdate(
                { userId, lessonId: lesson._id },
                { $max: { stars } },
                { upsert: true, new: true },
            );

            return res.status(200).json({
                message:
                    req.t?.('messages.lesson_completed') ?? 'Lesson completed',
                stars: progress.stars,
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
