import { Router } from 'express';
import { userController } from '../controllers/userController';
import { AuthRequest, ResetPasswordRequest } from '@/types/requestTypes';
import { createAuthMiddleware } from '@/middleware/authMiddleware';
import {
    strictRateLimiter,
    moderateRateLimiter,
} from '@/middleware/rateLimiter';

export const userRouter = Router();

userRouter.post('/registration', strictRateLimiter, async (req, res, next) => {
    try {
        await userController.registration(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});

userRouter.post('/login', strictRateLimiter, async (req, res, next) => {
    try {
        await userController.login(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});

userRouter.post('/logout', moderateRateLimiter, async (req, res, next) => {
    try {
        await userController.logout(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});

userRouter.post(
    '/change-password',
    strictRateLimiter,
    createAuthMiddleware(true),
    async (req, res, next) => {
        try {
            await userController.changePassword(req as AuthRequest, res, next);
        } catch (error) {
            next(error);
        }
    },
);

userRouter.get('/', createAuthMiddleware(true), async (req, res, next) => {
    try {
        await userController.getUser(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});

userRouter.get('/verify-email', async (req, res, next) => {
    try {
        await userController.verifyEmail(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});

userRouter.post(
    '/forgot-password',
    strictRateLimiter,
    async (req, res, next) => {
        try {
            await userController.requestPasswordReset(
                req as AuthRequest,
                res,
                next,
            );
        } catch (error) {
            next(error);
        }
    },
);

userRouter.post(
    '/reset-password',
    strictRateLimiter,
    async (req, res, next) => {
        try {
            await userController.resetPassword(
                req as ResetPasswordRequest,
                res,
                next,
            );
        } catch (error) {
            next(error);
        }
    },
);

userRouter.post(
    '/resend-verification',
    createAuthMiddleware(true),
    async (req, res, next) => {
        try {
            await userController.resendVerificationEmail(
                req as AuthRequest,
                res,
                next,
            );
        } catch (error) {
            next(error);
        }
    },
);
