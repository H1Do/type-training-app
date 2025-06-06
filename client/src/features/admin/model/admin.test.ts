import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdminStore } from './admin';
import type { AdminApi } from '@/shared/api/adminApi';
import type { MessageService } from '@/app/providers';
import { adminLessonMock } from '@/shared/tests/mocks';
import { AxiosError } from 'axios';
import { Layout, TrainingMode } from '@/shared/types';

const mockAdminApi = {
    getUsers: vi.fn(),
    getLessons: vi.fn(),
    getAdminStats: vi.fn(),
    getUserStats: vi.fn(),
    blockUser: vi.fn(),
    unblockUser: vi.fn(),
    createLesson: vi.fn(),
    updateLesson: vi.fn(),
    deleteLesson: vi.fn(),
};

const mockMessageService = {
    success: vi.fn(),
    warning: vi.fn(),
};

describe('useAdminStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('fetches users', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        mockAdminApi.getUsers.mockResolvedValue({
            users: [{ id: '1', username: 'Test' }],
            total: 1,
        });

        await store.fetchUsers();

        expect(store.users.length).toBe(1);
        expect(store.totalUsers).toBe(1);
    });

    it('blocks user and reloads list', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        mockAdminApi.blockUser.mockResolvedValue(undefined);
        mockAdminApi.getUsers.mockResolvedValue({ users: [], total: 0 });

        await store.blockUser('123');

        expect(mockAdminApi.blockUser).toHaveBeenCalledWith('123');
        expect(mockMessageService.success).toHaveBeenCalled();
    });

    it('creates lesson and reloads list', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        mockAdminApi.createLesson.mockResolvedValue(undefined);
        mockAdminApi.getLessons.mockResolvedValue([]);

        await store.createLesson(adminLessonMock);

        expect(mockAdminApi.createLesson).toHaveBeenCalled();
        expect(mockMessageService.success).toHaveBeenCalled();
    });

    it('handles API errors', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        mockAdminApi.getLessons.mockRejectedValue(
            new AxiosError(
                'fail',
                undefined,
                {
                    // @ts-expect-error mock
                    headers: {},
                },
                {},
                {
                    data: { message: 'fail' },
                    status: 400,
                    statusText: 'Bad Request',
                    headers: {},
                    config: {},
                },
            ),
        );

        await store.fetchLessons();

        expect(mockMessageService.warning).toHaveBeenCalledWith('fail');
    });

    it('fetches stats', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        const mockStats = { totalUsers: 100 };
        mockAdminApi.getAdminStats.mockResolvedValue(mockStats);

        await store.fetchStats();

        expect(store.stats).toStrictEqual(mockStats);
    });

    it('views user stats', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        const mockStats = { sessions: [] };
        mockAdminApi.getUserStats.mockResolvedValue(mockStats);

        await store.viewUserStats(
            'user1',
            TrainingMode['100PopularWords'],
            Layout.QWERTY,
            'all',
        );

        expect(store.selectedUserStats).toStrictEqual(mockStats);
    });

    it('unblocks user and reloads list', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        mockAdminApi.unblockUser.mockResolvedValue(undefined);
        mockAdminApi.getUsers.mockResolvedValue({ users: [], total: 0 });

        await store.unblockUser('123');

        expect(mockAdminApi.unblockUser).toHaveBeenCalledWith('123');
        expect(mockMessageService.success).toHaveBeenCalled();
    });

    it('updates lesson and reloads list', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        mockAdminApi.updateLesson.mockResolvedValue(undefined);
        mockAdminApi.getLessons.mockResolvedValue([]);

        await store.updateLesson('lesson-id', { title: 'Updated' });

        expect(mockAdminApi.updateLesson).toHaveBeenCalledWith('lesson-id', {
            title: 'Updated',
        });
        expect(mockMessageService.success).toHaveBeenCalled();
    });

    it('deletes lesson and reloads list', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        mockAdminApi.deleteLesson.mockResolvedValue(undefined);
        mockAdminApi.getLessons.mockResolvedValue([]);

        await store.deleteLesson('lesson-id');

        expect(mockAdminApi.deleteLesson).toHaveBeenCalledWith('lesson-id');
        expect(mockMessageService.success).toHaveBeenCalled();
    });

    it('sets query and resets offset', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        mockAdminApi.getUsers.mockResolvedValue({ users: [], total: 0 });

        store.setQuery('newQuery');

        expect(store.searchQuery).toBe('newQuery');
        expect(store.offset).toBe(0);
        expect(mockAdminApi.getUsers).toHaveBeenCalled();
    });

    it('sets page and fetches users', async () => {
        const store = useAdminStore();
        store.adminApi = mockAdminApi as unknown as AdminApi;
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn();

        mockAdminApi.getUsers.mockResolvedValue({ users: [], total: 0 });

        store.setPage(2);

        expect(store.offset).toBe(40);
        expect(mockAdminApi.getUsers).toHaveBeenCalled();
    });

    it('showError fallback if no response message', () => {
        const store = useAdminStore();
        store.messageService = mockMessageService as unknown as MessageService;
        store.t = vi.fn().mockReturnValue('Fallback msg');

        const error = new AxiosError(
            'fail',
            undefined,
            {
                // @ts-expect-error mock
                headers: {},
            },
            {},
            {
                data: {},
                status: 400,
                statusText: 'Bad Request',
                headers: {},
                config: {},
            },
        );

        store.showError(error, 'admin.errors.default');

        expect(mockMessageService.warning).toHaveBeenCalledWith('Fallback msg');
    });
});
