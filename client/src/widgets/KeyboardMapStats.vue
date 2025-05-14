<script setup lang="ts">
import type {
    KeyboardKey,
    LayoutKeys,
    PerCharStat,
    PerItemStat,
    PerItemStatMetric,
    Theme,
} from '@/shared/types';

import { AppHint } from '@/shared/ui';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    layout: LayoutKeys;
    perCharStats: PerCharStat[];
    averageStat: PerItemStat;
    metric: PerItemStatMetric;
    theme: Theme;
    getColorByMetric: (
        stat: PerItemStat | undefined,
        averageStat: PerItemStat,
        metric: PerItemStatMetric,
        theme: Theme,
    ) => string | undefined;
}>();

const { t } = useI18n();

const keyStats = computed<Record<string, PerCharStat>>(() => {
    const result: Record<string, PerCharStat> = {};

    for (const row of props.layout) {
        for (const key of row) {
            const lowerStat = props.perCharStats?.find(
                (s) => s.char === key.lower,
            );
            const upperStat = props.perCharStats?.find(
                (s) => s.char === key.upper,
            );

            if (lowerStat) result[key.lower] = lowerStat;
            if (upperStat) result[key.upper] = upperStat;
        }
    }

    return result;
});

const getHint = (key: KeyboardKey, stats: Record<string, PerCharStat>) => {
    if (key.code === 'Backspace') return;

    if (!stats[key.lower] && !stats[key.upper])
        return `
		${t('stats.metrics.key')}: ${
            key.code === 'Space' ? t('stats.space') : key.lower
        }
	`;

    const lower = stats?.[key.lower];
    const upper = stats?.[key.upper];

    return `
		${
            lower
                ? `${t('stats.metrics.key')}: ${
                      key.code === 'Space' ? t('stats.space') : key.lower
                  }
		${t('stats.metrics.keyCount')}: ${lower.count}
		${t('stats.metrics.errorsCount')}: ${lower.errorsCount}
		${t('stats.metrics.reaction')}: ${lower.averageReaction}${t('training.ms')}
		${t('stats.metrics.accuracy')}: ${lower.accuracy}%`
                : ''
        }
		${lower && upper && key.code !== 'Space' ? `---------------------` : ''}
		${
            upper && key.code !== 'Space'
                ? `${t('stats.metrics.key')}: ${upper.char}
		${t('stats.metrics.keyCount')}: ${upper.count}
		${t('stats.metrics.errorsCount')}: ${upper.errorsCount}
		${t('stats.metrics.reaction')}: ${upper.averageReaction}${t('training.ms')}
		${t('stats.metrics.accuracy')}: ${upper.accuracy}%`
                : ''
        }
	`;
};

const getValue = (key: KeyboardKey, stats: Record<string, PerCharStat>) => {
    const lower = stats?.[key.lower];
    const upper = stats?.[key.upper];

    if (!lower && !upper) return '';

    return (lower || upper)[props.metric];
};
</script>

<template>
    <div class="keyboard-plate__wrapper">
        <div
            v-for="(row, rowIndex) in layout"
            :key="rowIndex"
            class="keyboard-row"
            :class="`keyboard-row--${rowIndex}`"
        >
            <AppHint
                position="top-mid-left"
                v-for="key in row"
                :key="key.code"
                class="keyboard-button"
                :style="{
                    backgroundColor: getColorByMetric(
                        keyStats[key.lower] || keyStats[key.upper],
                        averageStat,
                        metric,
                        theme,
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
    gap: $gap-sm;
}

.keyboard-row {
    display: flex;
    gap: $gap-xs;
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
    background-color: var(--keyboard-button-background-color);
    line-height: 1;
    font-size: 1rem;

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
        top: $symbol-top;
        left: $symbol-left;
        font-size: $symbol-font-size;
    }

    &__stat {
        position: absolute;
        bottom: $stat-bottom;
        right: $stat-right;
        font-size: $stat-font-size;
        opacity: 0.8;
        font-weight: 900;
    }
}
</style>
