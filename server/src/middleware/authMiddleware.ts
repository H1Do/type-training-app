import { ApiError } from '@/errors/ApiError';
import { AuthRequest } from '@/types/requestTypes';
import { NextFunction, Response } from 'express';
import jwt, { TokenExpiredError, VerifyErrors } from 'jsonwebtoken';
import { User } from '@/models/User';

const TEN_MINUTES = 10 * 60 * 1000;

export function createAuthMiddleware(strict = false) {
    return async function authMiddleware(
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
            async (err: VerifyErrors | null, decoded: any) => {
                if (err instanceof TokenExpiredError) {
                    return strict
                        ? next(ApiError.unauthorized('Token expired'))
                        : next();
                }

                if (err || !decoded?.id) {
                    return strict
                        ? next(
                              ApiError.unauthorized(
                                  req.t?.('errors.unauthorized') ??
                                      'Unauthorized',
                              ),
                          )
                        : next();
                }

                const user = await User.findById(decoded.id);

                if (!user) {
                    return next(
                        ApiError.unauthorized(
                            req.t?.('errors.unauthorized') ?? 'Unauthorized',
                        ),
                    );
                }

                if (user.isBlocked) {
                    return next(
                        ApiError.forbidden(
                            req.t?.('errors.blocked') ?? 'User is blocked',
                        ),
                    );
                }

                if (
                    !user.lastSeen ||
                    Date.now() - user.lastSeen.getTime() > TEN_MINUTES
                ) {
                    user.lastSeen = new Date();
                    await user.save();
                }

                req.user = { id: user.id };
                next();
            },
        );
    };
}
