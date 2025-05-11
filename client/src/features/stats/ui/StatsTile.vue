<script setup lang="ts">
import { useSettingsStore } from '@/features/settings';
import { useTrainingStore } from '@/features/training';
import { KEYBOARD_LAYOUTS } from '@/shared/config/keyboardLayouts';
import { TrainingMode, type PerItemStatMetric } from '@/shared/types';
import { onMounted, watch, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStatsStore } from '../model/statsStore';
import { getColorByMetric } from '@/shared/utils';
import { HFlex, NoDataWrapper, VFlex } from '@/shared/ui';
import {
    FingerMapStats,
    KeyboardMapStats,
    LayoutSelector,
    ModeSelector,
    PeriodSelector,
    PerItemMetricSelector,
} from '@/widgets';
import LeaderboardStats from './LeaderboardStats.vue';
import SessionChart from './SessionChart.vue';

const { t } = useI18n();

const statsStore = useStatsStore();
const trainingStore = useTrainingStore();
const settingsStore = useSettingsStore();

onMounted(() => {
    statsStore.setLayout(settingsStore.layout);
    statsStore.setMode(
        trainingStore.mode === TrainingMode.Custom
            ? TrainingMode['100PopularWords']
            : trainingStore.mode,
    );
});

watch(
    () => [statsStore.layout, statsStore.mode, statsStore.period],
    () => {
        statsStore.fetchStats();
    },
    { immediate: true },
);

const metric = ref<PerItemStatMetric>('averageReaction');

const averageStat = computed(() => ({
    averageReaction: statsStore.stats?.averageReaction ?? 0,
    errorsCount: statsStore.stats?.errorsCount ?? 0,
    accuracy: statsStore.stats?.accuracy ?? 0,
    count: statsStore.stats?.count ?? 0,
    totalTime: statsStore.stats?.totalTime ?? 0,
}));

const layout = computed(() => KEYBOARD_LAYOUTS[statsStore.layout]);

const noData = computed(() => {
    return (
        !statsStore.stats?.fingerStats?.length &&
        !statsStore.stats?.perCharStats?.length &&
        !statsStore.stats?.sessions?.length &&
        !statsStore.stats?.leaderboard?.length
    );
});
</script>

<template>
    <VFlex gap="1rem">
        <HFlex gap="1rem">
            <VFlex gap="1.5rem">
                <HFlex gap="1rem">
                    <ModeSelector
                        :modelValue="statsStore.mode"
                        @update:modelValue="statsStore.setMode"
                    />
                    <LayoutSelector
                        :modelValue="statsStore.layout"
                        @update:modelValue="statsStore.setLayout"
                    />
                    <PeriodSelector
                        :modelValue="statsStore.period"
                        @update:modelValue="statsStore.setPeriod"
                    />
                </HFlex>

                <VFlex gap="1rem">
                    <NoDataWrapper
                        :noData="noData"
                        :isLoading="statsStore.isLoading"
                    >
                        <HFlex gap="1rem">
                            <VFlex gap="1rem">
                                <h2 class="title">
                                    {{ t('stats.leaderboard.title') }}
                                </h2>
                                <LeaderboardStats />
                            </VFlex>
                            <VFlex gap="1rem">
                                <h2 class="title">
                                    {{ t('stats.sessions.title') }}
                                </h2>
                                <VFlex gap="1rem">
                                    <PerItemMetricSelector v-model="metric" />
                                    <KeyboardMapStats
                                        :perCharStats="
                                            statsStore.stats?.perCharStats ?? []
                                        "
                                        :averageStat="averageStat"
                                        :layout="layout"
                                        :metric="metric"
                                        :theme="settingsStore.theme"
                                        :getColorByMetric="getColorByMetric"
                                    />
                                    <FingerMapStats
                                        :fingerStats="
                                            statsStore.stats?.fingerStats ?? []
                                        "
                                        :averageStat="averageStat"
                                        :metric="metric"
                                        :theme="settingsStore.theme"
                                        :getColorByMetric="getColorByMetric"
                                    />
                                </VFlex>
                            </VFlex>
                            <VFlex gap="1rem">
                                <h2 class="title">
                                    {{ t('stats.chart.title') }}
                                </h2>
                                <SessionChart />
                            </VFlex>
                        </HFlex>
                    </NoDataWrapper>
                </VFlex>
            </VFlex>
        </HFlex>
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
