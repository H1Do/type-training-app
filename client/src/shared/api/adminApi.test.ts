import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdminApi } from './adminApi';
import type { HttpClient } from './httpClient';
import { adminLessonMock } from '../tests/mocks';

const mockHttpClient = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
} as unknown as HttpClient;

let api: AdminApi;

beforeEach(() => {
    vi.clearAllMocks();
    api = new AdminApi(mockHttpClient);
});

describe('AdminApi', () => {
    it('getUsers sends correct request', async () => {
        const response = { data: [] };
        mockHttpClient.get = vi.fn().mockResolvedValue(response);

        const result = await api.getUsers({ q: 'john', limit: 10 });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/admin/users', {
            params: { q: 'john', limit: 10 },
        });
        expect(result).toEqual(response.data);
    });

    it('blockUser sends patch request', async () => {
        mockHttpClient.patch = vi.fn().mockResolvedValue({});
        await api.blockUser('user-id');
        expect(mockHttpClient.patch).toHaveBeenCalledWith(
            '/api/admin/users/user-id/block',
        );
    });

    it('unblockUser sends patch request', async () => {
        mockHttpClient.patch = vi.fn().mockResolvedValue({});
        await api.unblockUser('user-id');
        expect(mockHttpClient.patch).toHaveBeenCalledWith(
            '/api/admin/users/user-id/unblock',
        );
    });

    it('getUserStats sends get request with params', async () => {
        const response = { data: {} };
        mockHttpClient.get = vi.fn().mockResolvedValue(response);
        const result = await api.getUserStats('user-id', { since: 'month' });
        expect(mockHttpClient.get).toHaveBeenCalledWith(
            '/api/admin/users/user-id/stats',
            {
                params: { since: 'month' },
            },
        );
        expect(result).toEqual(response.data);
    });

    it('getLessons sends get request', async () => {
        const response = { data: [] };
        mockHttpClient.get = vi.fn().mockResolvedValue(response);
        const result = await api.getLessons();
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/admin/lessons');
        expect(result).toEqual(response.data);
    });

    it('createLesson sends post request with data', async () => {
        const lesson = adminLessonMock;
        const response = { data: { ...lesson, id: '1' } };
        mockHttpClient.post = vi.fn().mockResolvedValue(response);
        const result = await api.createLesson(lesson);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/api/admin/lessons',
            lesson,
        );
        expect(result).toEqual(response.data);
    });

    it('updateLesson sends put request', async () => {
        const response = {
            data: { id: '1', title: 'Updated', text: 'xyz', order: 1 },
        };
        mockHttpClient.put = vi.fn().mockResolvedValue(response);
        const result = await api.updateLesson('1', { title: 'Updated' });
        expect(mockHttpClient.put).toHaveBeenCalledWith(
            '/api/admin/lessons/1',
            { title: 'Updated' },
        );
        expect(result).toEqual(response.data);
    });

    it('deleteLesson sends delete request', async () => {
        mockHttpClient.delete = vi.fn().mockResolvedValue({});
        await api.deleteLesson('1');
        expect(mockHttpClient.delete).toHaveBeenCalledWith(
            '/api/admin/lessons/1',
        );
    });

    it('getAdminStats sends get request', async () => {
        const response = { data: { usersCount: 10 } };
        mockHttpClient.get = vi.fn().mockResolvedValue(response);
        const result = await api.getAdminStats();
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/admin/stats');
        expect(result).toEqual(response.data);
    });
});
