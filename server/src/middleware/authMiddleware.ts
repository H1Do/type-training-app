import { ApiError } from '@/errors/ApiError';
import { AuthRequest } from '@/types/requestTypes';
import { NextFunction, Response } from 'express';
import jwt, { TokenExpiredError, VerifyErrors } from 'jsonwebtoken';

export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    const token = req.cookies.token;

    if (!token) {
        next(ApiError.unauthorized(req.t('errors.unauthorized')));
    }

    if (!process.env.JWT_SECRET) {
        throw new Error(
            'JWT_SECRET is not defined in the environment variables',
        );
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err: VerifyErrors | null, user: any) => {
            if (err instanceof TokenExpiredError) {
                return next(ApiError.unauthorized('Token expired'));
            }
            if (err) {
                return next(
                    ApiError.unauthorized(req.t('errors.unauthorized')),
                );
            }
            req.user = user;
            next();
        },
    );
}
