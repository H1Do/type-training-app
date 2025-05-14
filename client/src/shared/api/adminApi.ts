import type { HttpClient } from './httpClient';
import type {
    AdminGetUsersResponse,
    AdminGetLessonsResponse,
    AdminStatsResponse,
    AdminLesson,
} from '@/shared/types/admin';
import type { StatsPeriod, StatsResponse } from '@/shared/types/stats';
import type { Layout, TrainingMode } from '../types';

export class AdminApi {
    constructor(private httpClient: HttpClient) {}

    async getUsers(params?: {
        q?: string;
        limit?: number;
        offset?: number;
    }): Promise<AdminGetUsersResponse> {
        const res = await this.httpClient.get<AdminGetUsersResponse>(
            '/api/admin/users',
            {
                params,
            },
        );
        return res.data;
    }

    async blockUser(userId: string): Promise<void> {
        await this.httpClient.patch(`/api/admin/users/${userId}/block`);
    }

    async unblockUser(userId: string): Promise<void> {
        await this.httpClient.patch(`/api/admin/users/${userId}/unblock`);
    }

    async getUserStats(
        userId: string,
        params?: {
            since?: StatsPeriod;
            mode?: TrainingMode;
            layout?: Layout;
        },
    ): Promise<StatsResponse> {
        const res = await this.httpClient.get<StatsResponse>(
            `/api/admin/users/${userId}/stats`,
            { params },
        );
        return res.data;
    }

    async getLessons(): Promise<AdminGetLessonsResponse> {
        const res = await this.httpClient.get<AdminGetLessonsResponse>(
            '/api/admin/lessons',
        );
        return res.data;
    }

    async createLesson(lesson: Omit<AdminLesson, 'id'>): Promise<AdminLesson> {
        const res = await this.httpClient.post<AdminLesson>(
            '/api/admin/lessons',
            lesson,
        );
        return res.data;
    }

    async updateLesson(
        id: string,
        data: Partial<Omit<AdminLesson, 'id'>>,
    ): Promise<AdminLesson> {
        const res = await this.httpClient.put<AdminLesson>(
            `/api/admin/lessons/${id}`,
            data,
        );
        return res.data;
    }

    async deleteLesson(id: string): Promise<void> {
        await this.httpClient.delete(`/api/admin/lessons/${id}`);
    }

    async getAdminStats(): Promise<AdminStatsResponse> {
        const res = await this.httpClient.get<AdminStatsResponse>(
            '/api/admin/stats',
        );
        return res.data;
    }
}
