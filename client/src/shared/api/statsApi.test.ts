import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StatsApi } from './statsApi';
import type { HttpClient } from './httpClient';
import {
    type StatsResponse,
    type TopUsersByLevelResponse,
    type TrainingMode,
    Layout,
} from '../types';
import {
    leaderboardLevelMock,
    leaderboardMock,
    sessionsMock,
    statsMock,
} from '../tests/mocks';

const mockHttpClient = {
    get: vi.fn(),
} as unknown as HttpClient;

let api: StatsApi;

beforeEach(() => {
    vi.clearAllMocks();
    api = new StatsApi(mockHttpClient);
});

describe('StatsApi', () => {
    it('getStats calls correct endpoint with params and returns data', async () => {
        const data: StatsResponse = {
            ...statsMock,
            leaderboard: leaderboardMock,
            totalSessions: 100,
            sessions: sessionsMock,
            position: 1,
        };
        mockHttpClient.get = vi.fn().mockResolvedValue({ data });

        const result = await api.getStats(
            'month',
            'normal' as TrainingMode,
            'qwerty' as Layout,
        );

        expect(result).toEqual(data);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/stats/me', {
            params: {
                since: 'month',
                mode: 'normal',
                layout: 'qwerty',
            },
        });
    });

    it('getStats uses default params if none provided', async () => {
        const data: StatsResponse = {
            ...statsMock,
            leaderboard: leaderboardMock,
            totalSessions: 100,
            sessions: sessionsMock,
            position: 1,
        };
        mockHttpClient.get = vi.fn().mockResolvedValue({ data });

        const result = await api.getStats();

        expect(result).toEqual(data);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/stats/me', {
            params: {
                since: 'all',
                mode: undefined,
                layout: undefined,
            },
        });
    });

    it('getTopUsers returns leaderboard data', async () => {
        const data: TopUsersByLevelResponse = {
            topUsers: leaderboardLevelMock,
            userPosition: 1,
        };
        mockHttpClient.get = vi.fn().mockResolvedValue({ data });

        const result = await api.getTopUsers();

        expect(result).toEqual(data);
        expect(mockHttpClient.get).toHaveBeenCalledWith(
            '/api/stats/top-users',
            {},
        );
    });
});
