import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorMiddleware } from './errorMiddleware';
import { ApiError } from '../errors/ApiError';

describe('errorMiddleware', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();
        req = {};
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next = vi.fn();
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('returns ApiError status and message when err is ApiError', () => {
        const apiErr = new ApiError(404, 'Not found');
        errorMiddleware(apiErr, req as any, res as any, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Not found',
        });
    });

    it('returns 500 for generic errors', () => {
        const genericErr = new Error('Something went wrong');
        errorMiddleware(genericErr, req as any, res as any, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Internal Server Error',
        });
    });
});
