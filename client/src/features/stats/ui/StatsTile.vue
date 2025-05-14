<script setup lang="ts">
import { getColorByMetric } from '@/shared/utils';
import StatsDashboard from '@/widgets/StatsDashboard.vue';
import { watch } from 'vue';
import { useStatsStore } from '../model/statsStore';
import { useUserStore } from '@/entities/user';
import { useSettingsStore } from '@/features/settings';

const statsStore = useStatsStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();

watch(
    () => [statsStore.layout, statsStore.mode, statsStore.period],
    () => {
        statsStore.fetchStats();
    },
    { immediate: true },
);
</script>

<template>
    <StatsDashboard
        :stats="statsStore.stats"
        :username="userStore.username"
        :theme="settingsStore.theme"
        :mode="statsStore.mode"
        :layout="statsStore.layout"
        :period="statsStore.period"
        :setMode="statsStore.setMode"
        :setLayout="statsStore.setLayout"
        :setPeriod="statsStore.setPeriod"
        :isLoading="statsStore.isLoading"
        :getColorByMetric="getColorByMetric"
    />
</template>
