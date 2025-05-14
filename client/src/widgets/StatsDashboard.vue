<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { KEYBOARD_LAYOUTS } from '@/shared/config/keyboardLayouts';
import type {
    Layout,
    LayoutKeys,
    PerItemStat,
    PerItemStatMetric,
    StatsPeriod,
    StatsResponse,
    Theme,
    TrainingMode,
} from '@/shared/types';
import { HFlex, NoDataWrapper, VFlex } from '@/shared/ui';
import FingerMapStats from './FingerMapStats.vue';
import KeyboardMapStats from './KeyboardMapStats.vue';
import LayoutSelector from './LayoutSelector.vue';
import LeaderboardStats from './LeaderboardStats.vue';
import ModeSelector from './ModeSelector.vue';
import PeriodSelector from './PeriodSelector.vue';
import PerItemMetricSelector from './PerItemMetricSelector.vue';
import SessionChart from './SessionChart.vue';

const { t } = useI18n();

const props = defineProps<{
    stats: StatsResponse | null;
    username: string;
    theme: Theme;
    mode: TrainingMode;
    layout: Layout;
    period: StatsPeriod;
    setMode: (mode: TrainingMode) => void;
    setLayout: (layout: Layout) => void;
    setPeriod: (period: StatsPeriod) => void;
    isLoading: boolean;
    getColorByMetric: (
        stat: PerItemStat | undefined,
        averageStat: PerItemStat,
        metric: PerItemStatMetric,
        theme: Theme,
    ) => string | undefined;
}>();

const metric = ref<PerItemStatMetric>('averageReaction');

const layoutKeys = computed<LayoutKeys>(() => KEYBOARD_LAYOUTS[props.layout]);

const averageStat = computed(() => ({
    averageReaction: props.stats?.averageReaction ?? 0,
    errorsCount: props.stats?.errorsCount ?? 0,
    accuracy: props.stats?.accuracy ?? 0,
    count: props.stats?.count ?? 0,
    totalTime: props.stats?.totalTime ?? 0,
}));

const noData = computed(() => {
    return (
        !props.stats?.fingerStats?.length &&
        !props.stats?.perCharStats?.length &&
        !props.stats?.sessions?.length &&
        !props.stats?.leaderboard?.length
    );
});
</script>

<template>
    <VFlex gap="1.5rem">
        <HFlex gap="1rem">
            <ModeSelector :modelValue="mode" @update:modelValue="setMode" />
            <LayoutSelector
                :modelValue="layout"
                @update:modelValue="setLayout"
            />
            <PeriodSelector
                :modelValue="period"
                @update:modelValue="setPeriod"
            />
        </HFlex>

        <VFlex gap="1rem">
            <NoDataWrapper :noData="noData" :isLoading="isLoading">
                <HFlex gap="1rem">
                    <VFlex gap="1rem">
                        <h2 class="title">
                            {{ t('stats.leaderboard.title') }}
                        </h2>
                        <LeaderboardStats
                            :leaderboard="stats?.leaderboard ?? []"
                            :userBestResult="stats?.userBestResult ?? null"
                            :userPosition="stats?.position ?? null"
                            :currentUsername="username"
                        />
                    </VFlex>

                    <VFlex gap="1rem">
                        <h2 class="title">{{ t('stats.sessions.title') }}</h2>
                        <VFlex gap="1rem">
                            <PerItemMetricSelector v-model="metric" />
                            <KeyboardMapStats
                                :perCharStats="stats?.perCharStats ?? []"
                                :averageStat="averageStat"
                                :layout="layoutKeys"
                                :metric="metric"
                                :theme="theme"
                                :getColorByMetric="getColorByMetric"
                            />
                            <FingerMapStats
                                :fingerStats="stats?.fingerStats ?? []"
                                :averageStat="averageStat"
                                :metric="metric"
                                :theme="theme"
                                :getColorByMetric="getColorByMetric"
                            />
                        </VFlex>
                    </VFlex>

                    <VFlex gap="1rem">
                        <h2 class="title">{{ t('stats.chart.title') }}</h2>
                        <SessionChart
                            :sessions="stats?.sessions"
                            :theme="theme"
                        />
                    </VFlex>
                </HFlex>
            </NoDataWrapper>
        </VFlex>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables.scss' as *;

.title {
    font-size: $stats-title;
    font-weight: 700;
    margin: 0;
}
</style>
