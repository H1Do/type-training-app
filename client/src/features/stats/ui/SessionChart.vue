<script setup lang="ts">
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from 'chart.js';
import { computed, ref } from 'vue';
import { useStatsStore } from '../model/statsStore';
import { Theme, type StatMetric } from '@/shared/types';
import { MetricSelector } from '@/widgets';
import { useSettingsStore } from '@/features/settings';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
);

const statsStore = useStatsStore();
const settingsStore = useSettingsStore();

const metric = ref<StatMetric>('accuracy');

const chartData = computed(() => {
    const sessions = statsStore.stats?.sessions ?? [];
    const labels = sessions.map((s) =>
        new Date(s.createdAt).toLocaleDateString(),
    );

    const datasets: import('chart.js').ChartDataset<'line'>[] = [
        {
            label: '',
            data: sessions.map((s) => Number(s[metric.value] || 0)),
            backgroundColor:
                settingsStore.theme === Theme.LIGHT ? '#1a1a1a' : '#f9f9f9',
            borderColor:
                settingsStore.theme === Theme.LIGHT ? '#1a1a1a' : '#f9f9f9',
            tension: 0.3,
        },
    ];

    return { labels, datasets };
});

const chartOptions: import('chart.js').ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            ticks: {
                display: false,
            },
            grid: {
                display: false,
            },
            border: {
                display: false,
            },
        },
        y: {
            ticks: {
                color:
                    settingsStore.theme === Theme.LIGHT ? '#1a1a1a' : '#f9f9f9',
            },
            beginAtZero: true,
            grid: {
                display: false,
            },
            border: {
                display: false,
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
};
</script>

<template>
    <div class="session-chart">
        <MetricSelector v-model="metric" />
        <div class="session-chart__canvas">
            <Line :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.session-chart {
    display: flex;
    flex-direction: column;
    gap: $gap;

    &__canvas {
        width: 100%;
        height: $chart-height;
        border: $border-width solid var(--primary-color);
        padding: 0.25rem;
        border-radius: $border-radius;
    }
}
</style>
