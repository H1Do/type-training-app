import { Router } from 'express';
import { userController } from '../controllers/userController';
import { AuthRequest } from '@/types/requestTypes';
import { authMiddleware } from '@/middleware/authMiddleware';

export const userRouter = Router();

userRouter.post('/registration', async (req, res, next) => {
    try {
        await userController.registration(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});
userRouter.post('/login', async (req, res, next) => {
    try {
        await userController.login(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});
userRouter.post('/logout', async (req, res, next) => {
    try {
        await userController.logout(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});
userRouter.post('/change-password', async (req, res, next) => {
    try {
        await userController.changePassword(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});
userRouter.get('/', authMiddleware, async (req, res, next) => {
    try {
        await userController.getUser(req as AuthRequest, res, next);
    } catch (error) {
        next(error);
    }
});
