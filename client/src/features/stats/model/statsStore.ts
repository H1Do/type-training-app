import { defineStore } from 'pinia';
import { TrainingMode } from '@/shared/types/training';
import {
    Layout,
    type StatsPeriod,
    type StatsResponse,
    type TopUsersByLevelResponse,
} from '@/shared/types';
import { AxiosError } from 'axios';

const LOCAL_STORAGE_KEYS = {
    period: 'stats.period',
    layout: 'stats.layout',
    mode: 'stats.mode',
};

export const useStatsStore = defineStore('stats', {
    state: () => ({
        stats: null as StatsResponse | null,
        isLoading: false,
        error: null as string | null,

        topUsers: null as TopUsersByLevelResponse | null,

        period:
            (localStorage.getItem(LOCAL_STORAGE_KEYS.period) as StatsPeriod) ||
            'day',
        layout:
            (localStorage.getItem(LOCAL_STORAGE_KEYS.layout) as Layout) ||
            Layout.QWERTY,
        mode:
            (localStorage.getItem(LOCAL_STORAGE_KEYS.mode) as TrainingMode) ||
            TrainingMode['100PopularWords'],
    }),

    actions: {
        async fetchStats() {
            this.isLoading = true;
            this.error = null;
            try {
                this.stats = await this.statsApi.getStats(
                    this.period,
                    this.mode ?? undefined,
                    this.layout ?? undefined,
                );
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    this.error =
                        error?.response?.data?.message ||
                        this.t('stats.fetchStatsFailed');
                    this.messageService.error(this.error);
                }
            } finally {
                this.isLoading = false;
            }
        },

        async fetchTopUsers() {
            this.isLoading = true;
            this.error = null;
            try {
                this.topUsers = await this.statsApi.getTopUsers();
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    this.error =
                        error?.response?.data?.message ||
                        this.t('stats.fetchTopUsersFailed');
                    this.messageService.error(this.error);
                }
            } finally {
                this.isLoading = false;
            }
        },

        setPeriod(period: StatsPeriod) {
            this.period = period;
            localStorage.setItem(LOCAL_STORAGE_KEYS.period, period);
        },

        setLayout(layout: Layout) {
            this.layout = layout;
            localStorage.setItem(LOCAL_STORAGE_KEYS.layout, layout);
        },

        setMode(mode: TrainingMode) {
            this.mode = mode;
            localStorage.setItem(LOCAL_STORAGE_KEYS.mode, mode);
        },
    },
});
