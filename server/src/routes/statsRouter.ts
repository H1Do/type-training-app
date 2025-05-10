import { Router } from 'express';
import {
    statsController,
    StatsQueryRequest,
} from '../controllers/statsController';
import { createAuthMiddleware } from '@/middleware/authMiddleware';
import { moderateRateLimiter } from '@/middleware/rateLimiter';

export const statsRouter = Router();

statsRouter.get(
    '/me',
    moderateRateLimiter,
    createAuthMiddleware(true),
    async (req, res, next) => {
        try {
            await statsController.getUserStats(
                req as unknown as StatsQueryRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);
