import { Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import {
    TrainingFinishRequest,
    TrainingStartRequest,
} from '@/types/requestTypes';
import { TrainingSession } from '@/models/TrainingSession';
import { TrainingMode } from '@/types/trainingTypes';
import { Lang, Layout, LayoutLangMap } from '@/types/keyboardTypes';
import { EN_POOLS, RU_POOLS } from '@/constants/pools';
import {
    SYMBOLS_TRAINING_LENGTH,
    WORDS_TRAINING_LENGTH,
} from '@/constants/training';
import { TrainingStats } from '@/models/TrainingStats';
import { calculateDetailedStats } from '@/utils/training/calculateStats';
import {
    MAX_CORRECTIONS_FOR_LEADERBOARD,
    MAX_ERRORS_FOR_STATS,
    MIN_ACCURACY_FOR_LEADERBOARD,
    MIN_ACCURACY_FOR_STATS,
} from '@/constants/stats';
import { User } from '@/models/User';
import { addExpToUser, calculateExp } from '@/utils/levelSystem';

class TrainingController {
    async startSession(
        req: TrainingStartRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { mode, layout, items, length, isWords } = req.body;
            const userId = req.user?.id;

            if (!layout) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.layout_required') ??
                            'Layout is required',
                    ),
                );
            }

            if (!mode) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.mode_required') ?? 'Mode is required',
                    ),
                );
            }

            if (
                typeof layout !== 'string' ||
                typeof mode !== 'string' ||
                (items && typeof items !== 'string') ||
                (length && typeof length !== 'number') ||
                (isWords != null && typeof isWords !== 'boolean')
            ) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_fields') ??
                            'Invalid training start data',
                    ),
                );
            }

            if (!(layout in LayoutLangMap)) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_layout') ?? 'Unknown layout',
                    ),
                );
            }

            if (!Object.values(TrainingMode).includes(mode)) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_mode') ??
                            'Unknown training mode',
                    ),
                );
            }

            let sequence: string[];

            if (mode === TrainingMode.Custom) {
                if (!items) {
                    return next(
                        ApiError.badRequest(
                            req.t?.('errors.items_required') ??
                                'Items are required for custom mode',
                        ),
                    );
                }

                const itemsArray = items.split(' ');
                sequence = generateCustomSequence(itemsArray, length, isWords);
            } else {
                sequence = generateSequence(mode, layout, length);
            }

            if (!userId) {
                return res.status(200).json({
                    id: null,
                    sequence,
                });
            }

            const session = await TrainingSession.create({
                userId,
                mode,
                layout,
                sequence,
                input: [],
                events: [],
            });

            return res.status(201).json({
                id: session._id,
                sequence: session.sequence,
            });
        } catch (e) {
            next(e);
        }
    }

    async finishSession(
        req: TrainingFinishRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            const {
                input,
                events,
                finishedAt,
                startedAt,
                layout: reqLayout,
                mode: reqMode,
                sequence: reqSequence,
            } = req.body;
            const userId = req.user?.id;

            if (
                typeof id !== 'string' ||
                typeof startedAt !== 'number' ||
                typeof finishedAt !== 'number' ||
                !Array.isArray(input) ||
                !Array.isArray(events)
            ) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_fields') ??
                            'Invalid session finish data',
                    ),
                );
            }

            if (reqLayout && typeof reqLayout !== 'string') {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_layout') ?? 'Invalid layout',
                    ),
                );
            }

            if (reqMode && typeof reqMode !== 'string') {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_mode') ?? 'Invalid mode',
                    ),
                );
            }

            if (reqSequence && !Array.isArray(reqSequence)) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_sequence') ??
                            'Invalid sequence',
                    ),
                );
            }

            if (!id || !userId) {
                const stats = calculateDetailedStats(
                    events,
                    startedAt,
                    finishedAt,
                    input,
                    reqSequence ?? [],
                );

                return res.status(200).json({
                    message:
                        req.t?.('messages.session_finished') ??
                        'Session finished',
                    stats: {
                        ...stats,
                        layout: reqLayout,
                        mode: reqMode,
                        isRated: false,
                        isLeaderboardEligible: false,
                    },
                });
            }

            const session = await TrainingSession.findOne({ _id: id, userId });
            if (!session) {
                return next(
                    ApiError.notFound(
                        req.t?.('errors.session_not_found') ??
                            'Session not found',
                    ),
                );
            }

            const stats = calculateDetailedStats(
                events,
                startedAt,
                finishedAt,
                input,
                session.sequence,
            );

            session.input = input;
            session.events = events;
            session.startedAt = startedAt;
            session.finishedAt = finishedAt;
            await session.save();

            const { layout, mode } = session;
            const isRated =
                mode !== TrainingMode.Custom &&
                stats.accuracy >= MIN_ACCURACY_FOR_STATS &&
                stats.textErrorsCount <= MAX_ERRORS_FOR_STATS;
            const isLeaderboardEligible =
                isRated &&
                stats.accuracy >= MIN_ACCURACY_FOR_LEADERBOARD &&
                stats.corrections <= MAX_CORRECTIONS_FOR_LEADERBOARD;

            const statsDoc = await TrainingStats.create({
                sessionId: session._id,
                userId,
                layout,
                mode,
                ...stats,
                isRated,
                isLeaderboardEligible,
            });

            session.statsId = statsDoc._id;
            await session.save();

            let exp = null;

            if (isRated) {
                const user = await User.findById(userId);
                if (!user) {
                    return next(ApiError.notFound('User not found'));
                }

                const earnedExp = calculateExp({
                    cpm: stats.cpm,
                    accuracy: stats.accuracy,
                    charCount: session.sequence.length,
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

            return res.status(200).json({
                message:
                    req.t?.('messages.session_finished') ?? 'Session finished',
                stats: statsDoc,
                exp,
            });
        } catch (e) {
            next(e);
        }
    }
}

function generateSequence(
    mode: TrainingMode,
    layout: Layout,
    length?: number,
): string[] {
    const lang = LayoutLangMap[layout];
    const pool = lang === Lang.RU ? RU_POOLS[mode] : EN_POOLS[mode];
    const sequence: string[] = [];

    if (Array.isArray(pool)) {
        for (let i = 0; i < (length ?? WORDS_TRAINING_LENGTH); i++) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            sequence.push(...pool[randomIndex], ' ');
        }
        return sequence.slice(0, -1);
    }

    for (let i = 0; i < (length ?? SYMBOLS_TRAINING_LENGTH); i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        sequence.push(pool[randomIndex]);
    }

    return sequence;
}

function generateCustomSequence(
    items: string[],
    length?: number,
    isWords?: boolean,
): string[] {
    const sequence: string[] = [];

    if (isWords) {
        for (let i = 0; i < (length ?? WORDS_TRAINING_LENGTH); i++) {
            const randomIndex = Math.floor(Math.random() * items.length);
            sequence.push(...items[randomIndex], ' ');
        }
        return sequence.slice(0, -1);
    }

    for (let i = 0; i < (length ?? SYMBOLS_TRAINING_LENGTH); i++) {
        const randomIndex = Math.floor(Math.random() * items.length);
        sequence.push(items[randomIndex]);
    }

    return sequence;
}

export const trainingController = new TrainingController();
