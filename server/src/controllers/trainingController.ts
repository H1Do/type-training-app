import { Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import {
    TrainingFinishRequest,
    TrainingPrepareRequest,
    TrainingStartRequest,
} from '@/types/requestTypes';
import { TrainingSession } from '@/models/TrainingSession';
import { TrainingMode } from '@/types/trainingSessionTypes';

class TrainingController {
    async prepare(
        req: TrainingPrepareRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const mode = req.query.mode;
            if (!mode) {
                return next(ApiError.badRequest('Mode is required'));
            }

            const sequence = generateSequenceByMode(mode, 5);
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

const SYMBOL_POOLS: Record<TrainingMode, string | string[]> = {
    letters: 'asdfjkl;',
    symbols: '!@#$%^&*()_+{}[]',
    'popular-words': 'the be to of and a in that have I'.split(''),
    custom: '',
    numbers: '0123456789',
};

function generateSequenceByMode(mode: TrainingMode, length: number): string[] {
    const pool = SYMBOL_POOLS[mode];

    const flatPool = Array.isArray(pool) ? pool : pool.split('');

    return Array.from(
        { length },
        () => flatPool[Math.floor(Math.random() * flatPool.length)],
    );
}

export const trainingController = new TrainingController();
