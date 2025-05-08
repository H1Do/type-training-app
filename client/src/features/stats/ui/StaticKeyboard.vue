<script setup lang="ts">
import type { KeyboardKey, LayoutKeys } from '@/shared/types';
import type { PerCharStat } from '@/shared/types/training'; // путь уточни сам
import { AppHint, AppSelector, type Option } from '@/shared/ui';
import { iconLabel } from '@/shared/utils/input';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export type StatMetric = 'averageTime' | 'errorsCount' | 'accuracy';

const props = defineProps<{
    layout: LayoutKeys;
    perChar: PerCharStat[];
}>();

const { t } = useI18n();

const metricOptions: Option<StatMetric>[] = [
    {
        label: 'Reaction',
        value: 'averageTime',
        content: {
            render: () => iconLabel('Timer', t('stats.metrics.reaction')),
        },
    },
    {
        label: 'Errors',
        value: 'errorsCount',
        content: {
            render: () =>
                iconLabel('SpellCheck2', t('stats.metrics.errorsCount')),
        },
    },
    {
        label: 'Accuracy',
        value: 'accuracy',
        content: {
            render: () => iconLabel('SpellCheck', t('stats.metrics.accuracy')),
        },
    },
];

const metric = ref<StatMetric>('averageTime');

const keyStats = computed<Record<string, PerCharStat>>(() => {
    const result: Record<string, PerCharStat> = {};

    for (const row of props.layout) {
        for (const key of row) {
            const lowerStat = props.perChar.find((s) => s.char === key.lower);
            const upperStat = props.perChar.find((s) => s.char === key.upper);

            if (lowerStat) result[key.lower] = lowerStat;
            if (upperStat) result[key.upper] = upperStat;
        }
    }

    return result;
});

const getHint = (key: KeyboardKey, stats: Record<string, PerCharStat>) => {
    if (!stats[key.lower] && !stats[key.upper])
        return `
		Key: ${key.lower}
	`;

    const lower = stats?.[key.lower];
    const upper = stats?.[key.upper];

    return `
		${
            lower
                ? `${t('stats.metrics.key')}: ${lower.char}
		${t('stats.metrics.keyCount')}: ${lower.count}
		${t('stats.metrics.errorsCount')}: ${lower.errorsCount}
		${t('stats.metrics.reaction')}: ${lower.averageTime}${t('stats.training.ms')}
		${t('stats.metrics.accuracy')}: ${lower.accuracy}%`
                : ''
        }
		${lower && upper && key.code !== 'Space' ? `---------------------` : ''}
		${
            upper && key.code !== 'Space'
                ? `${t('stats.metrics.key')}: ${upper.char}
		${t('stats.metrics.keyCount')}: ${upper.count}
		${t('stats.metrics.errorsCount')}: ${upper.errorsCount}
		${t('stats.metrics.reaction')}: ${upper.averageTime}${t('stats.training.ms')}
		${t('stats.metrics.accuracy')}: ${upper.accuracy}%`
                : ''
        }
	`;
};

const getValue = (key: KeyboardKey, stats: Record<string, PerCharStat>) => {
    const lower = stats?.[key.lower];
    const upper = stats?.[key.upper];

    if (!lower && !upper) return '';

    return (lower || upper)[metric.value];
};

const getColorByMetric = (stat: PerCharStat | undefined): string => {
    if (!stat || stat.count === 0) return '#eee';

    switch (metric.value) {
        case 'averageTime': {
            const time = stat.averageTime;
            if (time <= 150) return '#4caf50';
            if (time <= 250) return '#8bc34a';
            if (time <= 400) return '#ffeb3b';
            return '#f44336';
        }
        case 'errorsCount': {
            const errorRate = stat.errorsCount / stat.count;
            if (errorRate === 0) return '#4caf50';
            if (errorRate < 0.2) return '#ffeb3b';
            return '#f44336';
        }
        case 'accuracy': {
            const accuracy = (stat.count - stat.errorsCount) / stat.count;
            if (accuracy >= 0.98) return '#4caf50';
            if (accuracy >= 0.9) return '#ffeb3b';
            return '#f44336';
        }
        default:
            return '#ccc';
    }
};
</script>

<template>
    <div class="keyboard-plate__wrapper">
        <AppSelector :options="metricOptions" v-model="metric" />
        <div
            v-for="(row, rowIndex) in layout"
            :key="rowIndex"
            class="keyboard-row"
            :class="`keyboard-row--${rowIndex}`"
        >
            <AppHint
                position="top-right"
                v-for="key in row"
                :key="key.code"
                class="keyboard-button"
                :style="{
                    backgroundColor: getColorByMetric(
                        keyStats[key.lower] || keyStats[key.upper],
                    ),
                }"
                :class="{
                    'keyboard-button--space': key.code === 'Space',
                    'keyboard-button--backspace': key.code === 'Backspace',
                }"
                :hint="getHint(key, keyStats)"
            >
                <span class="keyboard-button__symbol">
                    {{ key.lower }}
                </span>
                <span
                    class="keyboard-button__stat"
                    v-if="keyStats[key.lower] || keyStats[key.upper]"
                >
                    {{ getValue(key, keyStats) }}
                </span>
            </AppHint>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.keyboard-plate__wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.keyboard-row {
    display: flex;
    gap: 4px;
    justify-content: center;

    &--0 {
        margin-left: $static-keyboard-row-offset-0;
    }

    &--1 {
        margin-left: $static-keyboard-row-offset-1;
    }

    &--2 {
        margin-left: $static-keyboard-row-offset-2;
    }

    &--3 {
        margin-left: $static-keyboard-row-offset-3;
    }

    &--4 {
        margin-left: $static-keyboard-row-offset-4;
    }
}

.keyboard-button {
    position: relative;
    font-family: 'Fira Code', monospace;
    width: $keyboard-button-size;
    aspect-ratio: 1;
    border: $border-width solid var(--keyboard-button-border-color);
    border-radius: $border-radius;
    transition: background-color $transition-duration ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    line-height: 1;
    font-size: 12px;

    &--space {
        height: $keyboard-button-size;
        width: $keyboard-space-size;
    }

    &--backspace {
        height: $keyboard-button-size;
        width: $keyboard-backspace-size;
    }

    &__symbol {
        position: absolute;
        top: 2px;
        left: 3px;
    }

    &__stat {
        position: absolute;
        bottom: 2px;
        right: 3px;
        font-size: 8px;
        opacity: 0.8;
    }
}
</style>
