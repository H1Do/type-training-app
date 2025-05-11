import { defineStore } from 'pinia';
import { TrainingMode } from '@/shared/types/training';
import { Layout, type StatsPeriod, type StatsResponse } from '@/shared/types';
import { AxiosError } from 'axios';

export const useStatsStore = defineStore('stats', {
    state: () => ({
        stats: null as StatsResponse | null,
        isLoading: false,
        error: null as string | null,

        period: 'day' as StatsPeriod,
        layout: Layout.QWERTY as Layout,
        mode: TrainingMode['100PopularWords'] as TrainingMode,
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

        setPeriod(period: StatsPeriod) {
            this.period = period;
        },

        setLayout(layout: Layout) {
            this.layout = layout;
        },

        setMode(mode: TrainingMode) {
            this.mode = mode;
        },
    },
});
