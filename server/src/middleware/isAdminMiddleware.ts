import { ApiError } from '@/errors/ApiError';
import { User } from '@/models/User';
import { AuthRequest } from '@/types/requestTypes';
import { NextFunction, Response } from 'express';

export const isAdminMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const user = req.user;

    if (!user) {
        return next(
            ApiError.unauthorized(
                req.t?.('errors.unauthorized') ?? 'Unauthorized',
            ),
        );
    }

    const { id } = user;

    const foundUser = await User.findById(id).select('role');

    if (!foundUser) {
        return next(
            ApiError.notFound(req.t?.('errors.notFound') ?? 'User not found'),
        );
    }

    if (foundUser.role !== 'admin') {
        return next(
            ApiError.forbidden(
                req.t?.('errors.forbidden') ?? 'Access denied: admin only',
            ),
        );
    }

    next();
};
