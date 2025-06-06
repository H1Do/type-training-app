import { defineStore } from 'pinia';
import type {
    AdminUserDto,
    AdminStatsResponse,
    AdminLesson,
} from '@/shared/types';
import type { StatsPeriod, StatsResponse } from '@/shared/types/stats';
import { AxiosError } from 'axios';
import type { Layout, TrainingMode } from '@/shared/types';
import type { LessonEditResult } from '../ui/LessonEditModal.vue';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        users: [] as AdminUserDto[],
        totalUsers: 0,
        lessons: [] as AdminLesson[],
        selectedUserStats: null as StatsResponse | null,
        stats: null as AdminStatsResponse | null,
        isLoading: false,
        limit: 20,
        offset: 0,
        searchQuery: '',
    }),

    actions: {
        async fetchUsers() {
            this.isLoading = true;
            try {
                const response = await this.adminApi.getUsers({
                    q: this.searchQuery,
                    limit: this.limit,
                    offset: this.offset,
                });
                this.users = response.users;
                this.totalUsers = response.total;
            } catch (error) {
                this.showError(error, 'admin.errors.failed_to_load_users');
            } finally {
                this.isLoading = false;
            }
        },

        async fetchLessons() {
            this.isLoading = true;
            try {
                this.lessons = await this.adminApi.getLessons();
            } catch (error) {
                this.showError(error, 'admin.errors.failed_to_load_lessons');
            } finally {
                this.isLoading = false;
            }
        },

        async fetchStats() {
            this.isLoading = true;
            try {
                this.stats = await this.adminApi.getAdminStats();
            } catch (error) {
                this.showError(error, 'admin.errors.failed_to_load_stats');
            } finally {
                this.isLoading = false;
            }
        },

        async viewUserStats(
            userId: string,
            mode: TrainingMode,
            layout: Layout,
            since: StatsPeriod,
        ) {
            try {
                this.selectedUserStats = await this.adminApi.getUserStats(
                    userId,
                    {
                        mode: mode,
                        layout: layout,
                        since: since,
                    },
                );
            } catch (error) {
                this.showError(error, 'admin.errors.failed_to_load_user_stats');
                this.selectedUserStats = null;
            }
        },

        async blockUser(id: string) {
            try {
                await this.adminApi.blockUser(id);
                await this.fetchUsers();
                this.messageService?.success?.(
                    this.t?.('admin.messages.user_blocked') ?? 'User blocked',
                );
            } catch (error) {
                this.showError(error, 'admin.errors.failed_to_block');
            }
        },

        async unblockUser(id: string) {
            try {
                await this.adminApi.unblockUser(id);
                await this.fetchUsers();
                this.messageService?.success?.(
                    this.t?.('admin.messages.user_unblocked') ??
                        'User unblocked',
                );
            } catch (error) {
                this.showError(error, 'admin.errors.failed_to_unblock');
            }
        },

        async createLesson(lesson: LessonEditResult) {
            try {
                await this.adminApi.createLesson(lesson);
                await this.fetchLessons();
                this.messageService?.success?.(
                    this.t?.('admin.messages.lesson_created') ??
                        'Lesson created',
                );
            } catch (error) {
                this.showError(error, 'admin.errors.failed_to_create_lesson');
            }
        },

        async updateLesson(id: string, data: Partial<Omit<AdminLesson, 'id'>>) {
            try {
                await this.adminApi.updateLesson(id, data);
                await this.fetchLessons();
                this.messageService?.success?.(
                    this.t?.('admin.messages.lesson_updated') ??
                        'Lesson updated',
                );
            } catch (error) {
                this.showError(error, 'admin.errors.failed_to_update_lesson');
            }
        },

        async deleteLesson(id: string) {
            try {
                await this.adminApi.deleteLesson(id);
                await this.fetchLessons();
                this.messageService?.success?.(
                    this.t?.('admin.messages.lesson_deleted') ??
                        'Lesson deleted',
                );
            } catch (error) {
                this.showError(error, 'admin.errors.failed_to_delete_lesson');
            }
        },

        setQuery(query: string) {
            this.searchQuery = query;
            this.offset = 0;
            this.fetchUsers();
        },

        setPage(page: number) {
            this.offset = page * this.limit;
            this.fetchUsers();
        },

        showError(error: unknown, fallbackKey: string) {
            if (!(error instanceof AxiosError)) return;

            const message =
                error?.response?.data?.message ??
                this.t?.(fallbackKey) ??
                'Unknown error';

            this.messageService?.warning(message);
        },
    },
});
