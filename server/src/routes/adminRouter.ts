import { Router } from 'express';
import { adminController } from '@/controllers/adminController';
import { isAdminMiddleware } from '@/middleware/isAdminMiddleware';
import {
    AdminGetUsersRequest,
    AdminUserIdRequest,
    AdminCreateLessonRequest,
    AdminUpdateLessonRequest,
    AdminDeleteLessonRequest,
    AdminGetLessonsRequest,
    AdminUserStatsRequest,
} from '@/types/requestTypes';
import { createAuthMiddleware } from '@/middleware/authMiddleware';

export const adminRouter = Router();

adminRouter.get(
    '/users',
    createAuthMiddleware(true),
    isAdminMiddleware,
    async (req, res, next) => {
        try {
            await adminController.getAllUsers(
                req as unknown as AdminGetUsersRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

adminRouter.patch(
    '/users/:id/block',
    createAuthMiddleware(true),
    isAdminMiddleware,
    async (req, res, next) => {
        try {
            await adminController.blockUser(
                req as unknown as AdminUserIdRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

adminRouter.patch(
    '/users/:id/unblock',
    createAuthMiddleware(true),
    isAdminMiddleware,
    async (req, res, next) => {
        try {
            await adminController.unblockUser(
                req as unknown as AdminUserIdRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

adminRouter.get(
    '/users/:id/stats',
    createAuthMiddleware(true),
    isAdminMiddleware,
    async (req, res, next) => {
        try {
            await adminController.getUserStats(
                req as unknown as AdminUserStatsRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

adminRouter.get(
    '/lessons',
    createAuthMiddleware(true),
    isAdminMiddleware,
    async (req, res, next) => {
        try {
            await adminController.getAllLessons(
                req as unknown as AdminGetLessonsRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

adminRouter.post(
    '/lessons',
    createAuthMiddleware(true),
    isAdminMiddleware,
    async (req, res, next) => {
        try {
            await adminController.createLesson(
                req as AdminCreateLessonRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

adminRouter.put(
    '/lessons/:id',
    createAuthMiddleware(true),
    isAdminMiddleware,
    async (req, res, next) => {
        try {
            await adminController.updateLesson(
                req as AdminUpdateLessonRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

adminRouter.delete(
    '/lessons/:id',
    createAuthMiddleware(true),
    isAdminMiddleware,
    async (req, res, next) => {
        try {
            await adminController.deleteLesson(
                req as unknown as AdminDeleteLessonRequest,
                res,
                next,
            );
        } catch (e) {
            next(e);
        }
    },
);

adminRouter.get(
    '/stats',
    createAuthMiddleware(true),
    isAdminMiddleware,
    async (req, res, next) => {
        try {
            await adminController.getAdminStats(req, res, next);
        } catch (e) {
            next(e);
        }
    },
);
