import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Response, NextFunction } from 'express';
import {
    generateCustomSequence,
    generateSequence,
    trainingController,
} from './trainingController';
import { TrainingSession } from '@/models/TrainingSession';
import { TrainingStats } from '@/models/TrainingStats';
import { User } from '@/models/User';
import { calculateDetailedStats } from '@/utils/training/calculateStats';
import { calculateExp, addExpToUser } from '@/utils/levelSystem';
import { TrainingMode } from '@/types/trainingTypes';
import { Lang, LayoutLangMap } from '@/types/keyboardTypes';
import { EN_POOLS, RU_POOLS } from '@/constants/pools';
import {
    MAX_CORRECTIONS_FOR_LEADERBOARD,
    MAX_ERRORS_FOR_STATS,
    MIN_ACCURACY_FOR_LEADERBOARD,
    MIN_ACCURACY_FOR_STATS,
} from '@/constants/stats';
import { ApiError } from '../errors/ApiError';

vi.mock('@/models/TrainingSession', () => ({
    TrainingSession: { create: vi.fn(), findOne: vi.fn() },
}));

vi.mock('@/models/TrainingStats', () => ({
    TrainingStats: { create: vi.fn() },
}));

vi.mock('@/models/User', () => ({
    User: { findById: vi.fn() },
}));

vi.mock('@/utils/training/calculateStats', () => ({
    calculateDetailedStats: vi.fn(),
}));

vi.mock('@/utils/levelSystem', () => ({
    calculateExp: vi.fn(),
    addExpToUser: vi.fn(),
}));

describe('TrainingController.startSession', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
    });

    it('errors when layout missing', async () => {
        const req: any = {
            body: { mode: TrainingMode.Letters },
            t: (k: string) => k,
        };
        await trainingController.startSession(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        const err = (next as Mock).mock.calls[0][0] as ApiError;
        expect(err.status).toBe(400);
    });

    it('errors when mode missing', async () => {
        const req: any = { body: { layout: 'us' }, t: (k: string) => k };
        await trainingController.startSession(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        const err = (next as Mock).mock.calls[0][0] as ApiError;
        expect(err.status).toBe(400);
    });

    it('errors on invalid types', async () => {
        const req: any = {
            body: { layout: 123, mode: true },
            t: (k: string) => k,
        };
        await trainingController.startSession(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors on unknown layout', async () => {
        const req: any = {
            body: { layout: 'unknown', mode: TrainingMode.Letters },
            t: (k: string) => k,
        };
        await trainingController.startSession(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors on unknown mode', async () => {
        const someLayout = Object.keys(LayoutLangMap)[0];
        const req: any = {
            body: { layout: someLayout, mode: 'INVALID' },
            t: (k: string) => k,
        };
        await trainingController.startSession(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('errors when custom without items', async () => {
        const someLayout = Object.keys(LayoutLangMap)[0];
        const req: any = {
            body: { layout: someLayout, mode: TrainingMode.Custom },
            t: (k: string) => k,
        };
        await trainingController.startSession(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('returns sequence with no user', async () => {
        const someLayout = Object.keys(LayoutLangMap)[0];
        const req: any = {
            body: { layout: someLayout, mode: TrainingMode.Letters },
            user: null,
            t: (k: string) => k,
        };
        await trainingController.startSession(req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        const payload = (res.json as Mock).mock.calls[0][0];
        expect(payload.id).toBeNull();
        expect(Array.isArray(payload.sequence)).toBe(true);
    });

    it('creates session when user present', async () => {
        const someLayout = Object.keys(LayoutLangMap)[0];
        const mockSession = { _id: 'sid', sequence: ['a', 'b'] };
        (TrainingSession.create as Mock).mockResolvedValue(mockSession);
        const req: any = {
            body: { layout: someLayout, mode: TrainingMode.Letters },
            user: { id: 'u1' },
            t: (k: string) => k,
        };
        await trainingController.startSession(req, res as Response, next);
        expect(TrainingSession.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: 'sid',
            sequence: ['a', 'b'],
        });
    });
});

describe('TrainingController.finishSession', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        next = vi.fn();
    });

    it('errors on invalid fields', async () => {
        const req: any = {
            params: { id: 'x' },
            body: { startedAt: 'no', finishedAt: 1, input: [], events: [] },
            user: { id: 'u1' },
            t: (k: string) => k,
        };
        await trainingController.finishSession(req, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('returns stats unratable when missing id or user', async () => {
        (calculateDetailedStats as Mock).mockReturnValue({
            accuracy: 90,
            corrections: 0,
            textErrorsCount: 0,
            cpm: 50,
            averageReaction: 100,
            count: 5,
        });
        const req: any = {
            params: { id: '' },
            body: {
                startedAt: 1,
                finishedAt: 2,
                input: ['a'],
                events: [],
                sequence: ['a'],
            },
            user: null,
            t: (k: string) => k,
        };
        await trainingController.finishSession(req, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        const payload = (res.json as Mock).mock.calls[0][0];
        expect(payload.stats.isRated).toBe(false);
        expect(payload.stats.isLeaderboardEligible).toBe(false);
    });

    it('errors when session not found', async () => {
        (TrainingSession.findOne as Mock).mockResolvedValue(null);
        const req: any = {
            params: { id: 'sid' },
            body: {
                startedAt: 1,
                finishedAt: 2,
                input: ['a'],
                events: [],
                sequence: ['a'],
            },
            user: { id: 'u1' },
            t: (k: string) => k,
        };
        await trainingController.finishSession(req, res as Response, next);
        expect(next).toHaveBeenCalled();
        const err = (next as Mock).mock.calls[0][0] as ApiError;
        expect(err.status).toBe(404);
    });

    it('processes and rates session successfully', async () => {
        const mockSession: any = {
            _id: 'sid',
            sequence: ['a'],
            layout: 'us',
            mode: TrainingMode.Letters,
            save: vi.fn(),
        };
        (TrainingSession.findOne as Mock).mockResolvedValue(mockSession);
        (calculateDetailedStats as Mock).mockReturnValue({
            accuracy: MIN_ACCURACY_FOR_STATS + 1,
            corrections: MAX_CORRECTIONS_FOR_LEADERBOARD - 1,
            textErrorsCount: MAX_ERRORS_FOR_STATS - 1,
            cpm: MIN_ACCURACY_FOR_LEADERBOARD + 1,
            averageReaction: 100,
            count: 5,
        });
        const mockStats = { _id: 'st1', accuracy: 95, cpm: 101 };
        (TrainingStats.create as Mock).mockResolvedValue(mockStats);
        (User.findById as Mock).mockResolvedValue({ save: vi.fn() });
        (calculateExp as Mock).mockReturnValue(10);
        (addExpToUser as Mock).mockReturnValue({
            newLevel: 2,
            currentExp: 10,
            requiredExp: 50,
        });

        const req: any = {
            params: { id: 'sid' },
            body: {
                startedAt: 1,
                finishedAt: 2,
                input: ['a'],
                events: [],
                sequence: ['a'],
            },
            user: { id: 'u1' },
            t: (k: string) => k,
        };
        await trainingController.finishSession(req, res as Response, next);
        expect(mockSession.save).toHaveBeenCalled();
        expect(TrainingStats.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        const payload = (res.json as Mock).mock.calls[0][0];
        expect(payload.stats).toBe(mockStats);
        expect(payload.exp).toEqual({
            earned: 10,
            level: 2,
            current: 10,
            required: 50,
        });
    });
});

describe('generateSequence and generateCustomSequence', () => {
    it('generateSequence returns correct length for pool array', () => {
        const layout = Object.keys(
            LayoutLangMap,
        )[0] as keyof typeof LayoutLangMap;
        const mode = TrainingMode.Letters;
        const seq = generateSequence(mode, layout, 5);
        const lang = LayoutLangMap[layout];
        const pool = lang === Lang.RU ? RU_POOLS[mode] : EN_POOLS[mode];
        expect(seq.length).toBe(5);
        seq.forEach((ch: string) => {
            expect((pool as string[]).includes(ch)).toBe(true);
        });
    });

    it('generateCustomSequence returns correct length for isWords false', () => {
        const items = ['x', 'y', 'z'];
        const seq = generateCustomSequence(items, 4, false);
        expect(seq.length).toBe(4);
        seq.forEach((ch: string) => expect(items).toContain(ch));
    });

    it('generateCustomSequence returns correct length for isWords true', () => {
        const items = ['hello', 'world'];
        const seq = generateCustomSequence(items, 3, true);
        expect(seq.length).toBeGreaterThan(0);
        seq.forEach((el: string) => {
            expect(typeof el).toBe('string');
        });
    });
});
