import { Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import {
    TrainingFinishRequest,
    TrainingPrepareRequest,
    TrainingStartRequest,
} from '@/types/requestTypes';
import { TrainingSession } from '@/models/TrainingSession';
import { TrainingMode } from '@/types/trainingSessionTypes';
import { Lang, Layout, LayoutLangMap } from '@/types/keyboardTypes';
import { EN_POOLS, RU_POOLS } from '@/constants/keyboard';

class TrainingController {
    async prepare(
        req: TrainingPrepareRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { mode, layout } = req.query;

            if (!mode) {
                return next(ApiError.badRequest('Mode is required'));
            }

            const sequence = generateSequence(mode, layout, 100);
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
            const { mode, sequence } = req.body;
            const userId = req.user?.id;

            if (!mode || !Array.isArray(sequence)) {
                return next(
                    ApiError.badRequest('Mode and sequence are required'),
                );
            }

            if (!userId) return next(ApiError.unauthorized('Unauthorized'));

            const session = await TrainingSession.create({
                userId,
                mode,
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

            if (!userId) return next(ApiError.unauthorized('Unauthorized'));

            const session = await TrainingSession.findOne({ _id: id, userId });
            if (!session) return next(ApiError.notFound('Session not found'));

            session.input = input;
            session.events = events;
            session.startedAt = startedAt;
            session.finishedAt = finishedAt;
            await session.save();

            const inputs = events.filter((e) => e.type === 'input');
            const correct = inputs.filter(
                (e) => e.actual === e.expected,
            ).length;
            const total = inputs.length;
            const duration = finishedAt - startedAt;

            const stats = {
                accuracy: total ? Math.round((correct / total) * 100) : 100,
                averageReaction: total
                    ? Math.round(inputs.reduce((a, b) => a + b.time, 0) / total)
                    : 0,
                cpm: duration ? Math.round(total / (duration / 1000 / 60)) : 0,
                duration,
            };

            return res.status(200).json({ message: 'Session finished', stats });
        } catch (e) {
            next(e);
        }
    }
}

function generateSequence(
    mode: TrainingMode,
    layout: Layout,
    length: number,
): string[] {
    const lang = LayoutLangMap[layout];

    const pool = lang === Lang.RU ? RU_POOLS[mode] : EN_POOLS[mode];

    const sequence: string[] = [];

    if (Array.isArray(pool)) {
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            sequence.push(...pool[randomIndex], ' ');
        }
        return sequence.slice(0, -1);
    }

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        sequence.push(pool[randomIndex]);
    }

    return sequence;
}

export const trainingController = new TrainingController();
