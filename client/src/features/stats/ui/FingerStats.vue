<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type {
    FingerStat,
    PerItemStat,
    PerItemStatMetric,
} from '@/shared/types/training';
import { Theme, type Finger } from '@/shared/types';
import { AppHint, HFlex } from '@/shared/ui';
import { computed } from 'vue';
import { useSettingsStore } from '@/features/settings';

const { t } = useI18n();
const settingsStore = useSettingsStore();

const props = defineProps<{
    fingerStats: FingerStat[];
    averageStat: PerItemStat;
    metric: PerItemStatMetric;
    getColorByMetric: (
        stat: PerItemStat | undefined,
        averageStat: PerItemStat,
        metric: PerItemStatMetric,
        theme: Theme,
    ) => string | undefined;
}>();

const fingers: Finger[] = [
    'left-index',
    'left-middle',
    'left-ring',
    'left-pinky',
    'right-index',
    'right-middle',
    'right-ring',
    'right-pinky',
    'thumb',
];

const fingerToStats = computed(() => {
    const result: Record<Finger, FingerStat | undefined> = {} as Record<
        Finger,
        FingerStat | undefined
    >;

    for (const finger of fingers) {
        result[finger] = props.fingerStats.find((s) => s.finger === finger);
    }

    return result;
});

const getHint = (finger: Finger, stats: FingerStat | undefined) => {
    if (!stats) {
        return `
			${t('stats.finger')}: ${t('stats.fingers.' + finger)}
		`;
    }

    return `
		${t('stats.finger')}: ${t('stats.fingers.' + finger)}
		${t('stats.metrics.keyCount')}: ${stats.count}
		${t('stats.metrics.errorsCount')}: ${stats.errorsCount}
		${t('stats.metrics.reaction')}: ${stats.averageReaction}${t('training.ms')}
		${t('stats.metrics.accuracy')}: ${stats.accuracy}%
	`;
};
</script>

<template>
    <HFlex class="finger-stats" gap="16px">
        <AppHint
            v-for="finger in fingers"
            position="top-mid-left"
            :key="finger"
            class="finger-stats__item"
            :class="{
                [`finger-stats__item--finger-${finger}`]: true,
            }"
            :style="{
                backgroundColor: getColorByMetric(
                    fingerToStats[finger],
                    averageStat,
                    metric,
                    settingsStore.theme,
                ),
            }"
            :hint="getHint(finger, fingerToStats[finger])"
        >
            <span class="finger-stats__stat">
                {{ fingerToStats[finger]?.[metric] }}
            </span>
        </AppHint>
    </HFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.finger-stats {
    align-self: center;

    &__item {
        width: $finger-width;
        height: $finger-height;
        border: $border-width solid var(--keyboard-button-border-color);
        border-radius: $border-radius;

        &--finger-left-pinky {
            background-color: var(--finger-left-pinky);
            order: 1;
            margin-top: $left-pinky-offset;
        }

        &--finger-left-ring {
            background-color: var(--finger-left-ring);
            order: 2;
            margin-top: $left-ring-offset;
        }

        &--finger-left-middle {
            background-color: var(--finger-left-middle);
            order: 3;
            margin-top: $left-middle-offset;
        }

        &--finger-left-index {
            background-color: var(--finger-left-index);
            order: 4;
            margin-top: $left-index-offset;
        }

        &--finger-thumb {
            background-color: var(--finger-thumb);
            order: 5;
            margin-top: $thumb-offset;
        }

        &--finger-right-index {
            background-color: var(--finger-right-index);
            order: 6;
            margin-top: $right-index-offset;
        }

        &--finger-right-middle {
            background-color: var(--finger-right-middle);
            order: 7;
            margin-top: $right-middle-offset;
        }

        &--finger-right-ring {
            background-color: var(--finger-right-ring);
            order: 8;
            margin-top: $right-ring-offset;
        }

        &--finger-right-pinky {
            background-color: var(--finger-right-pinky);
            order: 9;
            margin-top: $right-pinky-offset;
        }
    }

    &__stat {
        font-size: 0.8rem;
        font-weight: 600;
        line-height: 1;
    }
}
</style>
