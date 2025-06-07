import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAdminMiddleware } from './isAdminMiddleware';
import { User } from '@/models/User';
import { ApiError } from '@/errors/ApiError';

describe('isAdminMiddleware', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { user: null, t: (k: string) => k };
        res = {};
        next = vi.fn();
    });

    it('returns unauthorized if no user on request', async () => {
        await isAdminMiddleware(req, res as any, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(401);
    });

    it('returns not found if User.findById returns null', async () => {
        req.user = { id: 'u1' };
        vi.spyOn(User, 'findById').mockReturnValue({
            select: vi.fn().mockResolvedValue(null),
        } as any);
        await isAdminMiddleware(req, res as any, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(404);
    });

    it('returns forbidden if foundUser.role is not admin', async () => {
        req.user = { id: 'u2' };
        const fakeUser: any = { role: 'user' };
        vi.spyOn(User, 'findById').mockReturnValue({
            select: vi.fn().mockResolvedValue(fakeUser),
        } as any);
        await isAdminMiddleware(req, res as any, next);
        expect(next).toHaveBeenCalled();
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(403);
    });

    it('calls next without error when user is admin', async () => {
        req.user = { id: 'adminId' };
        const fakeAdmin: any = { role: 'admin' };
        vi.spyOn(User, 'findById').mockReturnValue({
            select: vi.fn().mockResolvedValue(fakeAdmin),
        } as any);
        await isAdminMiddleware(req, res as any, next);
        expect(next).toHaveBeenCalledWith();
    });
});
