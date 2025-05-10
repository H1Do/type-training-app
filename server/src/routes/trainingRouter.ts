import { Router } from 'express';
import { trainingController } from '../controllers/trainingController';
import type {
    TrainingStartRequest,
    TrainingFinishRequest,
} from '@/types/requestTypes';
import { createAuthMiddleware } from '@/middleware/authMiddleware';
import { strictRateLimiter } from '@/middleware/rateLimiter';

export const trainingRouter = Router();

trainingRouter.post(
    '/session',
    createAuthMiddleware(),
    strictRateLimiter,
    async (req, res, next) => {
        try {
            await trainingController.startSession(
                req as TrainingStartRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

trainingRouter.post(
    '/session/:id/finish',
    strictRateLimiter,
    createAuthMiddleware(),
    async (req, res, next) => {
        try {
            await trainingController.finishSession(
                req as TrainingFinishRequest,
                res,
                next,
            );
        } catch (error) {
            next(error);
        }
    },
);
