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
import { computed } from 'vue';
import { Theme } from '@/shared/types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
);

const props = defineProps<{
    registrationsByDay: { _id: string; count: number }[];
    theme: Theme;
}>();

const chartData = computed(() => {
    const labels = props.registrationsByDay.map((r) => r._id);
    const datasets: import('chart.js').ChartDataset<'line'>[] = [
        {
            label: t('admin.charts.registrations'),
            data: props.registrationsByDay.map((r) => r.count),
            backgroundColor:
                props.theme === Theme.LIGHT ? '#1a1a1a' : '#f9f9f9',
            borderColor: props.theme === Theme.LIGHT ? '#1a1a1a' : '#f9f9f9',
            tension: 0.3,
        },
    ];
    return { labels, datasets };
});

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            ticks: {
                color: props.theme === Theme.LIGHT ? '#1a1a1a' : '#f9f9f9',
            },
            grid: { display: false },
            border: { display: false },
        },
        y: {
            ticks: {
                color: props.theme === Theme.LIGHT ? '#1a1a1a' : '#f9f9f9',
            },
            beginAtZero: true,
            grid: { display: false },
            border: { display: false },
        },
    },
    plugins: {
        legend: { display: false },
        title: { display: false },
    },
}));
</script>

<template>
    <div class="registrations-chart">
        <div class="registrations-chart__canvas">
            <Line :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.registrations-chart {
    display: flex;
    flex-direction: column;
    gap: $gap;

    &__canvas {
        width: 100%;
        height: $chart-height;
        border: $border-width-big solid var(--primary-color);
        padding: 0.25rem;
        border-radius: $border-radius;
    }
}
</style>
