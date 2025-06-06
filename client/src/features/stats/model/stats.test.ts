/* eslint-disable @typescript-eslint/no-explicit-any */
import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStatsStore } from './stats';
import { Layout, TrainingMode } from '@/shared/types';
import type { TopUsersByLevelResponse } from '@/shared/types';
import { leaderboardLevelMock, statsMock } from '@/shared/tests/mocks';
import { AxiosError } from 'axios';

const mockStatsApi = {
    getStats: vi.fn(),
    getTopUsers: vi.fn(),
};

const mockMessageService = {
    error: vi.fn(),
};

const mockT = vi.fn((key) => key);

beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
});

describe('useStatsStore', () => {
    it('fetchStats success', async () => {
        const store = useStatsStore();
        store.statsApi = mockStatsApi as any;
        store.messageService = mockMessageService as any;
        store.t = mockT;

        const mockData = statsMock;
        mockStatsApi.getStats.mockResolvedValue(mockData);

        await store.fetchStats();

        expect(store.stats).toEqual(mockData);
        expect(store.error).toBeNull();
        expect(mockMessageService.error).not.toHaveBeenCalled();
    });

    it('fetchStats error', async () => {
        const store = useStatsStore();
        store.statsApi = mockStatsApi as any;
        store.messageService = mockMessageService as any;
        store.t = mockT;

        const axiosError = new AxiosError('fail');
        axiosError.response = {
            data: { message: 'fail' },
            status: 400,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: {},
        };

        mockStatsApi.getStats.mockRejectedValue(axiosError);

        await store.fetchStats();

        expect(store.stats).toBeNull();
        expect(store.error).toBe('fail');
        expect(mockMessageService.error).toHaveBeenCalledWith('fail');
    });

    it('fetchTopUsers success', async () => {
        const store = useStatsStore();
        store.statsApi = mockStatsApi as any;
        store.messageService = mockMessageService as any;
        store.t = mockT;

        const mockUsers: TopUsersByLevelResponse = {
            topUsers: leaderboardLevelMock,
            userPosition: 1,
        };
        mockStatsApi.getTopUsers.mockResolvedValue(mockUsers);

        await store.fetchTopUsers();

        expect(store.topUsers).toEqual(mockUsers);
        expect(store.error).toBeNull();
    });

    it('setPeriod saves to localStorage', () => {
        const store = useStatsStore();
        store.setPeriod('week');
        expect(store.period).toBe('week');
        expect(localStorage.getItem('stats.period')).toBe('week');
    });

    it('setLayout saves to localStorage', () => {
        const store = useStatsStore();
        store.setLayout(Layout.YCUKEN);
        expect(store.layout).toBe(Layout.YCUKEN);
        expect(localStorage.getItem('stats.layout')).toBe(Layout.YCUKEN);
    });

    it('setMode saves to localStorage', () => {
        const store = useStatsStore();
        store.setMode(TrainingMode['100PopularWords']);
        expect(store.mode).toBe(TrainingMode['100PopularWords']);
        expect(localStorage.getItem('stats.mode')).toBe(
            TrainingMode['100PopularWords'],
        );
    });
});
