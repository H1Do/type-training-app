import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAuthMiddleware } from './authMiddleware';
import { ApiError } from '@/errors/ApiError';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { User } from '@/models/User';

describe('createAuthMiddleware', () => {
    let req: any;
    let res: any;
    let next: any;
    const originalEnv = process.env;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { cookies: {}, t: (k: string) => k };
        res = {};
        next = vi.fn();
        process.env = { ...originalEnv, JWT_SECRET: 'secret' };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('calls next and leaves req.user undefined when no token and strict=false', async () => {
        const middleware = createAuthMiddleware(false);
        await middleware(req, res, next);
        expect(req.user).toBeUndefined();
        expect(next).toHaveBeenCalledWith();
    });

    it('returns unauthorized error when no token and strict=true', async () => {
        const middleware = createAuthMiddleware(true);
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(401);
    });

    it('throws if JWT_SECRET is missing', async () => {
        delete process.env.JWT_SECRET;
        const middleware = createAuthMiddleware();
        req.cookies.token = 'tok';
        await expect(middleware(req, res, next)).rejects.toThrow(
            'JWT_SECRET is not defined',
        );
    });

    it('on TokenExpiredError, strict=true returns unauthorized', async () => {
        req.cookies.token = 'tok';
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, cb) => {
            // @ts-ignore
            cb(new TokenExpiredError('expired', new Date()), null);
        });
        const middleware = createAuthMiddleware(true);
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).message).toBe('Token expired');
    });

    it('on TokenExpiredError, strict=false calls next without error', async () => {
        req.cookies.token = 'tok';
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, cb) => {
            // @ts-ignore
            cb(new TokenExpiredError('expired', new Date()), null);
        });
        const middleware = createAuthMiddleware(false);
        await middleware(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('on invalid token (err or missing id), strict=true returns unauthorized', async () => {
        req.cookies.token = 'tok';
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, cb) => {
            // @ts-ignore
            cb(new Error('bad'), {});
        });
        const middleware = createAuthMiddleware(true);
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(401);
    });

    it('on invalid token, strict=false calls next without error', async () => {
        req.cookies.token = 'tok';
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, cb) => {
            // @ts-ignore
            cb(new Error('bad'), {});
        });
        const middleware = createAuthMiddleware(false);
        await middleware(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('when decoded lacks id, strict=true returns unauthorized', async () => {
        req.cookies.token = 'tok';
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, cb) => {
            // @ts-ignore
            cb(null, { notId: 'x' });
        });
        const middleware = createAuthMiddleware(true);
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(401);
    });

    it('when user not found, returns unauthorized', async () => {
        req.cookies.token = 'tok';
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, cb) => {
            // @ts-ignore
            cb(null, { id: 'u1' });
        });
        vi.spyOn(User, 'findById').mockResolvedValue(null);
        const middleware = createAuthMiddleware(true);
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(401);
    });

    it('when user is blocked, returns forbidden', async () => {
        req.cookies.token = 'tok';
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, cb) => {
            // @ts-ignore
            cb(null, { id: 'u1' });
        });
        const blockedUser = {
            isBlocked: true,
            lastSeen: new Date(),
            save: vi.fn(),
        };
        vi.spyOn(User, 'findById').mockResolvedValue(blockedUser as any);
        const middleware = createAuthMiddleware(true);
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(403);
    });

    it('updates lastSeen when stale and sets req.user', async () => {
        req.cookies.token = 'tok';
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, cb) => {
            // @ts-ignore
            cb(null, { id: 'u1' });
        });
        const oldDate = new Date(Date.now() - 20 * 60 * 1000);
        const userObj: any = {
            isBlocked: false,
            lastSeen: oldDate,
            save: vi.fn(),
            id: 'u1',
        };
        vi.spyOn(User, 'findById').mockResolvedValue(userObj as any);
        const middleware = createAuthMiddleware(true);

        let resolveDone: () => void;
        const donePromise = new Promise<void>((resolve) => {
            resolveDone = resolve;
        });
        next = () => {
            resolveDone();
        };

        await middleware(req, res, next);
        await donePromise;

        expect(userObj.save).toHaveBeenCalled();
        expect(req.user).toEqual({ id: 'u1' });
    });

    it('does not update lastSeen when recent and sets req.user', async () => {
        req.cookies.token = 'tok';
        vi.spyOn(jwt, 'verify').mockImplementation((token, secret, cb) => {
            // @ts-ignore
            cb(null, { id: 'u1' });
        });
        const recentDate = new Date();
        const userObj: any = {
            isBlocked: false,
            lastSeen: recentDate,
            save: vi.fn(),
            id: 'u1',
        };
        vi.spyOn(User, 'findById').mockResolvedValue(userObj as any);
        const middleware = createAuthMiddleware(true);

        let resolveDone: () => void;
        const donePromise = new Promise<void>((resolve) => {
            resolveDone = resolve;
        });
        next = () => {
            resolveDone();
        };

        await middleware(req, res, next);
        await donePromise;

        expect(userObj.save).not.toHaveBeenCalled();
        expect(req.user).toEqual({ id: 'u1' });
    });
});
