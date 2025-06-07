import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Response, NextFunction } from 'express';
import {
    StatsController,
    mergePerCharStat,
    mergeFingerStats,
} from './statsController';
import { TrainingStats } from '@/models/TrainingStats';
import { ApiError } from '@/errors/ApiError';

vi.mock('@/models/TrainingStats', () => {
    const find = vi.fn();
    const countDocuments = vi.fn();
    const findOne = vi.fn();
    const aggregate = vi.fn();
    const db = {
        collection: vi.fn().mockReturnValue({
            aggregate: vi.fn().mockReturnValue({ toArray: vi.fn() }),
            findOne: vi.fn(),
            countDocuments: vi.fn(),
        }),
    };
    return {
        TrainingStats: { find, countDocuments, findOne, aggregate, db },
    };
});

describe('StatsController.getUserStats', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
    });

    it('returns 401 when no user', async () => {
        const req: any = { user: null, query: {}, t: (k: string) => k };
        await StatsController.getUserStats(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        const err = (next as Mock).mock.calls[0][0] as ApiError;
        expect(err.status).toBe(401);
    });

    it('returns 400 on invalid since', async () => {
        const req: any = {
            user: { id: 'u1' },
            query: { since: 'year' },
            t: (k: string) => k,
        };
        await StatsController.getUserStats(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        const err = (next as Mock).mock.calls[0][0] as ApiError;
        expect(err.status).toBe(400);
    });

    it('returns default when no sessions', async () => {
        (TrainingStats.find as Mock).mockReturnValue({
            lean: vi.fn().mockResolvedValue([]),
        });
        (TrainingStats.aggregate as Mock).mockReturnValue({
            lookup: () => ({
                unwind: () => [],
            }),
        });
        const req: any = { user: { id: 'u2' }, query: {}, t: (k: string) => k };
        await StatsController.getUserStats(req, res as Response, next);
        expect(TrainingStats.find).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            totalSessions: 0,
            accuracy: 100,
            cpm: 0,
            averageReaction: 0,
            perChar: [],
            fingerStats: [],
            leaderboard: [],
            position: null,
        });
    });

    it('computes stats when sessions exist', async () => {
        const sessions = [
            {
                perCharStats: [
                    { char: 'a', count: 2, errorsCount: 1, totalTime: 200 },
                ],
                fingerStats: [],
                accuracy: 50,
                cpm: 60,
                averageReaction: 100,
                count: 2,
                errorsCount: 1,
                textErrorsCount: 1,
                totalTime: 200,
                createdAt: new Date(),
            },
        ];
        (TrainingStats.find as Mock).mockReturnValue({
            lean: vi.fn().mockResolvedValue(sessions),
        });
        (TrainingStats.aggregate as Mock).mockReturnValue({
            lookup: () => ({
                unwind: () => [
                    {
                        _id: 'u2',
                        cpm: 60,
                        accuracy: 50,
                        user: { username: 'user2' },
                    },
                ],
            }),
        });
        (TrainingStats.findOne as Mock).mockReturnValue({
            sort: () => ({
                select: () => ({
                    lean: vi
                        .fn()
                        .mockResolvedValue({
                            _id: 's1',
                            cpm: 60,
                            accuracy: 50,
                        }),
                }),
            }),
        });
        (TrainingStats.countDocuments as Mock).mockResolvedValue(0);

        const req: any = { user: { id: 'u2' }, query: {}, t: (k: string) => k };
        await StatsController.getUserStats(req, res as Response, next);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                totalSessions: 1,
                accuracy: 50,
                cpm: 60,
                averageReaction: 100,
                count: 2,
                errorsCount: 1,
                totalTextErrorsCount: 1,
                totalTime: 200,
                perCharStats: [
                    {
                        char: 'a',
                        count: 2,
                        errorsCount: 1,
                        totalTime: 200,
                        averageReaction: 100,
                        accuracy: 50,
                    },
                ],
                fingerStats: [],
                sessions: [
                    {
                        accuracy: 50,
                        averageReaction: 100,
                        cpm: 60,
                        count: 2,
                        errorsCount: 1,
                        textErrorsCount: 1,
                        errorsRate: 0.5,
                        createdAt: sessions[0].createdAt,
                    },
                ],
                leaderboard: [
                    {
                        userId: 'u2',
                        username: 'user2',
                        cpm: 60,
                        accuracy: 50,
                        isCurrentUser: true,
                    },
                ],
                userBestResult: { _id: 's1', cpm: 60, accuracy: 50 },
                position: 1,
            }),
        );
    });
});

describe('StatsController.getTopUsersByLevel', () => {
    let res: Partial<Response>;
    let next: NextFunction;
    const usersCollection = TrainingStats.db.collection('users');

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
    });

    it('returns 401 when no user', async () => {
        const req: any = { user: null, t: (k: string) => k };
        await StatsController.getTopUsersByLevel(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        const err = (next as Mock).mock.calls[0][0] as ApiError;
        expect(err.status).toBe(401);
    });

    it('returns topUsers and null position', async () => {
        const raw = [
            { _id: 'u1', username: 'A', level: 5, exp: 100 },
            { _id: 'u2', username: 'B', level: 4, exp: 80 },
        ];
        (usersCollection.aggregate as Mock).mockReturnValue({
            toArray: vi.fn().mockResolvedValue(raw),
        });
        const req: any = { user: { id: 'u1' }, t: (k: string) => k };
        await StatsController.getTopUsersByLevel(req, res as Response, next);
        expect(res.json).toHaveBeenCalledWith({
            topUsers: [
                {
                    userId: 'u1',
                    username: 'A',
                    level: 5,
                    exp: 100,
                    isCurrentUser: true,
                },
                {
                    userId: 'u2',
                    username: 'B',
                    level: 4,
                    exp: 80,
                    isCurrentUser: false,
                },
            ],
            userPosition: null,
        });
    });
});

describe('mergePerCharStat', () => {
    it('aggregates per-character stats', () => {
        const sessions = [
            {
                perCharStats: [
                    { char: 'x', count: 2, errorsCount: 1, totalTime: 200 },
                ],
            },
            {
                perCharStats: [
                    { char: 'x', count: 3, errorsCount: 0, totalTime: 300 },
                ],
            },
        ];
        const result = mergePerCharStat(sessions as any);
        expect(result).toEqual([
            {
                char: 'x',
                count: 5,
                errorsCount: 1,
                totalTime: 500,
                averageReaction: 100,
                accuracy: 80,
            },
        ]);
    });
});

describe('mergeFingerStats', () => {
    it('aggregates finger statistics', () => {
        const sessions = [
            {
                fingerStats: [
                    {
                        finger: 'thumb',
                        chars: ['a'],
                        count: 2,
                        errorsCount: 1,
                        totalTime: 200,
                    },
                ],
            },
            {
                fingerStats: [
                    {
                        finger: 'thumb',
                        chars: ['b'],
                        count: 3,
                        errorsCount: 0,
                        totalTime: 300,
                    },
                ],
            },
        ];
        const result = mergeFingerStats(sessions as any);
        expect(result).toEqual([
            {
                finger: 'thumb',
                chars: expect.arrayContaining(['a', 'b']),
                count: 5,
                errorsCount: 1,
                totalTime: 500,
                averageReaction: 100,
                accuracy: 80,
            },
        ]);
    });
});
