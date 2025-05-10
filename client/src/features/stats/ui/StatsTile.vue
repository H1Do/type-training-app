<script setup lang="ts">
import { useSettingsStore } from '@/features/settings';
import { useTrainingStore } from '@/features/training';
import { HFlex, NoDataWrapper, VFlex } from '@/shared/ui';
import { LayoutSelector, ModeSelector, PeriodSelector } from '@/widgets';
import { computed, onMounted, ref, watch } from 'vue';
import { useStatsStore } from '../model/statsStore';
import { TrainingMode, type PerItemStatMetric } from '@/shared/types';
import KeyboardStats from './KeyboardStats.vue';
import FingerStats from './FingerStats.vue';
import { getColorByMetric } from '@/shared/utils';
import PerItemMetricSelector from '@/widgets/PerItemMetricSelector.vue';
import { KEYBOARD_LAYOUTS } from '@/shared/config/keyboardLayouts';
import LeaderboardStats from './LeaderboardStats.vue';
import SessionChart from './SessionChart.vue';

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
                    <NoDataWrapper :noData="noData">
                        <HFlex gap="1rem">
                            <LeaderboardStats />
                            <VFlex gap="1rem">
                                <PerItemMetricSelector v-model="metric" />
                                <KeyboardStats
                                    :perCharStats="
                                        statsStore.stats?.perCharStats ?? []
                                    "
                                    :averageStat="averageStat"
                                    :layout="layout"
                                    :metric="metric"
                                    :getColorByMetric="getColorByMetric"
                                />
                                <FingerStats
                                    :fingerStats="
                                        statsStore.stats?.fingerStats ?? []
                                    "
                                    :averageStat="averageStat"
                                    :metric="metric"
                                    :getColorByMetric="getColorByMetric"
                                />
                            </VFlex>
                            <SessionChart />
                        </HFlex>
                    </NoDataWrapper>
                </VFlex>
            </VFlex>
        </HFlex>
    </VFlex>
</template>

<style scoped lang="scss"></style>
