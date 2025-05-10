import { ApiError } from '@/errors/ApiError';
import { AuthRequest } from '@/types/requestTypes';
import { NextFunction, Response } from 'express';
import jwt, { TokenExpiredError, VerifyErrors } from 'jsonwebtoken';

export function createAuthMiddleware(strict = false) {
    return function authMiddleware(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) {
        const token = req.cookies.token;

        if (!token) {
            if (strict) {
                return next(
                    ApiError.unauthorized(
                        req.t?.('errors.unauthorized') ?? 'Unauthorized',
                    ),
                );
            } else {
                req.user = undefined;
                return next();
            }
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
                    return strict
                        ? next(ApiError.unauthorized('Token expired'))
                        : next();
                }
                if (err) {
                    return strict
                        ? next(
                              ApiError.unauthorized(
                                  req.t?.('errors.unauthorized') ??
                                      'Unauthorized',
                              ),
                          )
                        : next();
                }

                req.user = user;
                return next();
            },
        );
    };
}
