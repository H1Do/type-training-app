import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const createHandler = (defaultMessage: string) => {
    return (req: Request, res: Response) => {
        const message = req.t?.('errors.too_many_requests') ?? defaultMessage;

        res.status(429).json({ message });
    };
};

const commonOptions = {
    standardHeaders: true,
    legacyHeaders: false,
};

export const strictRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    handler: createHandler('Too many requests, please try again later.'),
    ...commonOptions,
});

export const moderateRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    handler: createHandler('Too many requests, please slow down.'),
    ...commonOptions,
});

export const looseRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    handler: createHandler('Too many requests.'),
    ...commonOptions,
});
