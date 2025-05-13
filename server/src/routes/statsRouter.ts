import { Router } from 'express';
import { StatsController } from '../controllers/statsController';
import { createAuthMiddleware } from '@/middleware/authMiddleware';
import { moderateRateLimiter } from '@/middleware/rateLimiter';
import {
    StatsQueryRequest,
    TopUsersByLevelRequest,
} from '@/types/requestTypes';

export const statsRouter = Router();

statsRouter.get(
    '/me',
    moderateRateLimiter,
    createAuthMiddleware(true),
    async (req, res, next) => {
        try {
            await StatsController.getUserStats(
                req as unknown as StatsQueryRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

statsRouter.get(
    '/top-users',
    moderateRateLimiter,
    createAuthMiddleware(true),
    async (req, res, next) => {
        try {
            await StatsController.getTopUsersByLevel(
                req as unknown as TopUsersByLevelRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);
