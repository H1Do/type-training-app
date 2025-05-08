import { Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import {
    TrainingFinishRequest,
    TrainingPrepareRequest,
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

class TrainingController {
    async prepare(
        req: TrainingPrepareRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { mode, layout, items, length, isWords } = req.query;

            if (!mode) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.mode_required') ?? 'Mode is required',
                    ),
                );
            }

            if (!layout) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.layout_required') ??
                            'Layout is required',
                    ),
                );
            }

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
                const sequence = generateCustomSequence(
                    itemsArray,
                    length,
                    isWords,
                );
                return res.status(200).json(sequence);
            }

            const sequence = generateSequence(mode, layout, length);
            return res.status(200).json(sequence);
        } catch (e) {
            next(e);
        }
    }

    async startSession(
        req: TrainingStartRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { mode, sequence, layout } = req.body;
            const userId = req.user?.id;

            if (!layout) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.layout_required') ??
                            'Layout is required',
                    ),
                );
            }

            if (!mode || !Array.isArray(sequence)) {
                return next(
                    ApiError.badRequest(
                        req.t?.('errors.invalid_session_data') ??
                            'Mode and sequence are required',
                    ),
                );
            }

            if (!userId)
                return next(
                    ApiError.unauthorized(
                        req.t?.('errors.unauthorized') ?? 'Unauthorized',
                    ),
                );

            const session = await TrainingSession.create({
                userId,
                mode,
                layout,
                sequence,
                input: [],
                events: [],
                startedAt: Date.now(),
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
            const { input, events, finishedAt, startedAt } = req.body;
            const userId = req.user?.id;

            if (!userId)
                return next(
                    ApiError.unauthorized(
                        req.t?.('errors.unauthorized') ?? 'Unauthorized',
                    ),
                );

            const session = await TrainingSession.findOne({ _id: id, userId });
            if (!session)
                return next(
                    ApiError.notFound(
                        req.t?.('errors.session_not_found') ??
                            'Session not found',
                    ),
                );

            session.input = input;
            session.events = events;
            session.startedAt = startedAt;
            session.finishedAt = finishedAt;
            await session.save();

            const stats = calculateDetailedStats(events, startedAt, finishedAt);

            const { layout, mode } = session;
            const isRated =
                mode !== TrainingMode.Custom &&
                stats.accuracy >= 80 &&
                stats.corrections <= 10;
            const isLeaderboardEligible = isRated && stats.accuracy >= 90;

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

            return res.status(200).json({
                message:
                    req.t?.('messages.session_finished') ?? 'Session finished',
                stats: statsDoc,
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
