import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    strictRateLimiter,
    moderateRateLimiter,
    looseRateLimiter,
    createHandler,
} from './rateLimiter';

describe('createHandler', () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = {
            t: (k: string) =>
                k === 'errors.too_many_requests' ? 'Overloaded' : undefined,
        };
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    });

    it('uses the translation if available', () => {
        const handler = createHandler('Default message');
        handler(req, res);
        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({ message: 'Overloaded' });
    });

    it('returns the default message if no translation exists', () => {
        const handler = createHandler(
            'Too many requests, please try again later.',
        );
        const reqNoT: any = {};
        handler(reqNoT, res);
        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Too many requests, please try again later.',
        });
    });
});

describe('rate limiters are functions', () => {
    it('strictRateLimiter is a function', () => {
        expect(typeof strictRateLimiter).toBe('function');
    });
    it('moderateRateLimiter is a function', () => {
        expect(typeof moderateRateLimiter).toBe('function');
    });
    it('looseRateLimiter is a function', () => {
        expect(typeof looseRateLimiter).toBe('function');
    });
});
