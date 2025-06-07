import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Response, NextFunction } from 'express';
import { Lesson, UserLessonProgress } from '@/models/Lesson';
import { User } from '@/models/User';
import { ApiError } from '@/errors/ApiError';
import { lessonsController } from './lessonsController';
import { calculateDetailedStats } from '@/utils/training/calculateStats';
import { addExpToUser, calculateExp } from '@/utils/levelSystem';
import {
    MAX_CORRECTIONS_FOR_LESSON,
    MAX_ERRORS_FOR_LESSON,
} from '@/constants/stats';

vi.mock('@/models/Lesson', () => {
    const find = vi.fn();
    const findById = vi.fn();
    const findOneAndUpdate = vi.fn();
    return {
        Lesson: { find, findById },
        UserLessonProgress: { find: vi.fn(), findOneAndUpdate },
    };
});

vi.mock('@/models/User', () => {
    const findById = vi.fn();
    return { User: { findById } };
});

vi.mock('@/utils/training/calculateStats', () => ({
    calculateDetailedStats: vi.fn(),
}));

vi.mock('@/utils/levelSystem', () => ({
    calculateExp: vi.fn(),
    addExpToUser: vi.fn(),
}));

describe('LessonsController', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
    });

    describe('getAll', () => {
        it('returns lessons with stars when no user', async () => {
            const lessonsData = [
                {
                    _id: 'id1',
                    order: 1,
                    title: 'T',
                    titleRu: 'TR',
                    layout: 'q',
                    allowedChars: 'abc',
                    length: 3,
                    prevLessonId: null,
                    nextLessonId: null,
                },
            ];
            (Lesson.find as Mock).mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue(lessonsData),
            });
            const req: any = { user: null };
            await lessonsController.getAll(req, res as Response, next);
            expect(Lesson.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { ...lessonsData[0], id: 'id1', stars: 0 },
            ]);
        });

        it('includes stars when user present', async () => {
            const lessonsData = [
                {
                    _id: 'id2',
                    order: 2,
                    title: 'T2',
                    titleRu: 'TR2',
                    layout: 'q2',
                    allowedChars: 'xyz',
                    length: 2,
                    prevLessonId: null,
                    nextLessonId: null,
                },
            ];
            (Lesson.find as Mock).mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue(lessonsData),
            });
            (UserLessonProgress.find as Mock).mockReturnValue({
                lean: vi
                    .fn()
                    .mockResolvedValue([{ lessonId: 'id2', stars: 2 }]),
            });
            const req: any = { user: { id: 'user1' } };
            await lessonsController.getAll(req, res as Response, next);
            expect(UserLessonProgress.find).toHaveBeenCalledWith({
                userId: 'user1',
            });
            expect(res.json).toHaveBeenCalledWith([
                { ...lessonsData[0], id: 'id2', stars: 2 },
            ]);
        });
    });

    describe('getById', () => {
        it('validates id length', async () => {
            const req: any = { params: { id: 'short' }, t: (k: string) => k };
            await lessonsController.getById(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(400);
        });

        it('fetches lesson and returns sequence', async () => {
            const lessonDoc = {
                _id: 'a'.repeat(24),
                title: 'L',
                titleRu: 'Л',
                layout: 'q',
                allowedChars: 'ab',
                length: 5,
                prevLessonId: null,
                nextLessonId: null,
            };
            (Lesson.findById as Mock).mockReturnValue({
                lean: vi.fn().mockResolvedValue(lessonDoc),
            });
            const req: any = { params: { id: 'a'.repeat(24) } };
            await lessonsController.getById(req, res as Response, next);
            expect(Lesson.findById).toHaveBeenCalledWith('a'.repeat(24));
            expect(res.status).toHaveBeenCalledWith(200);
            const payload = (res.json as Mock).mock.calls[0][0];
            expect(payload.id).toBe(lessonDoc._id);
            expect(payload.title).toBe('L');
            expect(Array.isArray(payload.sequence)).toBe(true);
            expect(payload.sequence).toHaveLength(5);
        });
    });

    describe('complete', () => {
        const validId = 'b'.repeat(24);
        const baseLesson = {
            _id: validId,
            allowedChars: 'abc',
            length: 3,
            minAccuracy: 80,
            cpmFor1: 10,
            cpmFor2: 20,
            cpmFor3: 30,
            layout: 'q',
        };

        it('rejects invalid id', async () => {
            const req: any = {
                params: { id: 'short' },
                body: {},
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(400);
        });

        it('rejects invalid body fields', async () => {
            const req: any = {
                params: { id: validId },
                body: { input: 'notArray' },
                user: { id: 'u1' },
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(400);
        });

        it('rejects missing user', async () => {
            const req: any = {
                params: { id: validId },
                body: {
                    input: [],
                    events: [],
                    startedAt: 1,
                    finishedAt: 2,
                    sequence: ['a', 'b', 'c'],
                },
                user: null,
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(401);
        });

        it('handles lesson not found', async () => {
            (Lesson.findById as Mock).mockReturnValue({
                lean: vi.fn().mockResolvedValue(null),
            });
            const req: any = {
                params: { id: validId },
                body: {
                    input: [],
                    events: [],
                    startedAt: 1,
                    finishedAt: 2,
                    sequence: ['a', 'b', 'c'],
                },
                user: { id: 'u1' },
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(404);
        });

        it('rejects sequence with invalid chars', async () => {
            (Lesson.findById as Mock).mockReturnValue({
                lean: vi.fn().mockResolvedValue(baseLesson),
            });
            const req: any = {
                params: { id: validId },
                body: {
                    input: [],
                    events: [],
                    startedAt: 1,
                    finishedAt: 2,
                    sequence: ['x', 'y', 'z'],
                },
                user: { id: 'u1' },
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(400);
        });

        it('returns zero stars on low accuracy', async () => {
            (Lesson.findById as Mock).mockReturnValue({
                lean: vi.fn().mockResolvedValue(baseLesson),
            });
            (calculateDetailedStats as Mock).mockReturnValue({
                accuracy: 50,
                corrections: 0,
                textErrorsCount: 0,
                cpm: 5,
                averageReaction: 0,
                count: 3,
            });
            const req: any = {
                params: { id: validId },
                body: {
                    input: ['a', 'b', 'c'],
                    events: [],
                    startedAt: 1,
                    finishedAt: 2,
                    sequence: ['a', 'b', 'c'],
                },
                user: { id: 'u1' },
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(res.status).toHaveBeenCalledWith(200);
            const payload = (res.json as Mock).mock.calls[0][0];
            expect(payload.stars).toBe(0);
            expect(payload.message).toMatch(/messages\.low_accuracy/);
        });

        it('returns zero stars on too many corrections', async () => {
            (Lesson.findById as Mock).mockReturnValue({
                lean: vi.fn().mockResolvedValue(baseLesson),
            });
            (calculateDetailedStats as Mock).mockReturnValue({
                accuracy: 100,
                corrections: MAX_CORRECTIONS_FOR_LESSON + 1,
                textErrorsCount: 0,
                cpm: 50,
                averageReaction: 0,
                count: 3,
            });
            const req: any = {
                params: { id: validId },
                body: {
                    input: ['a', 'b', 'c'],
                    events: [],
                    startedAt: 1,
                    finishedAt: 2,
                    sequence: ['a', 'b', 'c'],
                },
                user: { id: 'u1' },
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(res.json).toHaveBeenCalled();
            const payload = (res.json as Mock).mock.calls[0][0];
            expect(payload.stars).toBe(0);
            expect(payload.message).toMatch(/messages\.too_many_corrections/);
        });

        it('returns zero stars on too many errors', async () => {
            (Lesson.findById as Mock).mockReturnValue({
                lean: vi.fn().mockResolvedValue(baseLesson),
            });
            (calculateDetailedStats as Mock).mockReturnValue({
                accuracy: 100,
                corrections: 0,
                textErrorsCount: MAX_ERRORS_FOR_LESSON + 1,
                cpm: 50,
                averageReaction: 0,
                count: 3,
            });
            const req: any = {
                params: { id: validId },
                body: {
                    input: ['a', 'b', 'c'],
                    events: [],
                    startedAt: 1,
                    finishedAt: 2,
                    sequence: ['a', 'b', 'c'],
                },
                user: { id: 'u1' },
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(res.json).toHaveBeenCalled();
            const payload = (res.json as Mock).mock.calls[0][0];
            expect(payload.stars).toBe(0);
            expect(payload.message).toMatch(/messages\.too_many_errors/);
        });

        it('returns zero stars on low speed', async () => {
            (Lesson.findById as Mock).mockReturnValue({
                lean: vi.fn().mockResolvedValue(baseLesson),
            });
            (calculateDetailedStats as Mock).mockReturnValue({
                accuracy: 100,
                corrections: 0,
                textErrorsCount: 0,
                cpm: baseLesson.cpmFor1 - 1,
                averageReaction: 0,
                count: 3,
            });
            const req: any = {
                params: { id: validId },
                body: {
                    input: ['a', 'b', 'c'],
                    events: [],
                    startedAt: 1,
                    finishedAt: 2,
                    sequence: ['a', 'b', 'c'],
                },
                user: { id: 'u1' },
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(res.json).toHaveBeenCalled();
            const payload = (res.json as Mock).mock.calls[0][0];
            expect(payload.stars).toBe(0);
            expect(payload.message).toMatch(/messages\.low_speed/);
        });

        it('completes successfully with stars and exp', async () => {
            (Lesson.findById as Mock).mockReturnValue({
                lean: vi.fn().mockResolvedValue(baseLesson),
            });
            (calculateDetailedStats as Mock).mockReturnValue({
                accuracy: 90,
                corrections: 0,
                textErrorsCount: 0,
                cpm: baseLesson.cpmFor2 + 5,
                averageReaction: 0,
                count: 3,
            });
            (User.findById as Mock).mockResolvedValue({ save: vi.fn() });
            (calculateExp as Mock).mockReturnValue(42);
            (addExpToUser as Mock).mockReturnValue({
                newLevel: 2,
                currentExp: 10,
                requiredExp: 50,
            });
            (UserLessonProgress.findOneAndUpdate as Mock).mockResolvedValue({});
            const req: any = {
                params: { id: validId },
                body: {
                    input: ['a', 'b', 'c'],
                    events: [],
                    startedAt: 1,
                    finishedAt: 2,
                    sequence: ['a', 'b', 'c'],
                },
                user: { id: 'u2' },
                t: (k: string) => k,
            };
            await lessonsController.complete(req, res as Response, next);
            expect(res.status).toHaveBeenCalledWith(200);
            const payload = (res.json as Mock).mock.calls[0][0];
            expect(payload.stars).toBe(2);
            expect(payload.exp).toEqual({
                earned: 42,
                level: 2,
                current: 10,
                required: 50,
            });
            expect(payload.message).toMatch(/messages\.lesson_completed/);
        });
    });
});
