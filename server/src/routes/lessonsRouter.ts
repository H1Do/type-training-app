import { Router } from 'express';
import { lessonsController } from '../controllers/lessonsController';
import type {
    LessonGetAllRequest,
    LessonGetByIdRequest,
    LessonCompleteRequest,
} from '@/types/requestTypes';
import { createAuthMiddleware } from '@/middleware/authMiddleware';
import { strictRateLimiter } from '@/middleware/rateLimiter';

export const lessonsRouter = Router();

lessonsRouter.get('/', createAuthMiddleware(true), async (req, res, next) => {
    try {
        await lessonsController.getAll(req as LessonGetAllRequest, res, next);
    } catch (e) {
        next(e);
    }
});

lessonsRouter.get(
    '/:id',
    createAuthMiddleware(true),
    async (req, res, next) => {
        try {
            await lessonsController.getById(
                req as unknown as LessonGetByIdRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

lessonsRouter.post(
    '/:id/complete',
    createAuthMiddleware(true),
    strictRateLimiter,
    async (req, res, next) => {
        try {
            await lessonsController.complete(
                req as LessonCompleteRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);
