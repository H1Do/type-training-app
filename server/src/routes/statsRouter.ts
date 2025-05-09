import { Router } from 'express';
import {
    statsController,
    StatsQueryRequest,
} from '../controllers/statsController';
import { authMiddleware } from '@/middleware/authMiddleware';

export const statsRouter = Router();

statsRouter.get('/me', authMiddleware, async (req, res, next) => {
    try {
        await statsController.getUserStats(
            req as unknown as StatsQueryRequest,
            res,
            next,
        );
    } catch (e) {
        next(e);
    }
});
