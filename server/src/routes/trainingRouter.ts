import { Request, Router } from 'express';
import { trainingController } from '../controllers/trainingController';
import { authMiddleware } from '@/middleware/authMiddleware';
import type {
    TrainingStartRequest,
    TrainingFinishRequest,
    TrainingQuery,
} from '@/types/requestTypes';

export const trainingRouter = Router();

trainingRouter.get(
    '/prepare',
    async (req: Request<{}, any, any, TrainingQuery>, res, next) => {
        try {
            await trainingController.prepare(req, res, next);
        } catch (e) {
            next(e);
        }
    },
);

trainingRouter.post('/session', authMiddleware, async (req, res, next) => {
    try {
        await trainingController.startSession(
            req as TrainingStartRequest,
            res,
            next,
        );
    } catch (e) {
        next(e);
    }
});

trainingRouter.post(
    '/session/:id/finish',
    authMiddleware,
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
