import { ApiError } from '@/errors/ApiError';
import { AuthRequest } from '@/types/requestTypes';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    const token = req.cookies.token;

    if (!token) {
        next(ApiError.unauthorized('Not authorized'));
    }

    if (!process.env.JWT_SECRET) {
        throw new Error(
            'JWT_SECRET is not defined in the environment variables',
        );
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err: jwt.VerifyErrors | null, user: any) => {
            if (err) {
                next(ApiError.unauthorized('Not authorized'));
            }
            req.user = user;
            next();
        },
    );
}
