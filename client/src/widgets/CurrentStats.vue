<script setup lang="ts">
import { computed } from 'vue';
import { useTrainingTimer } from '@/shared/utils';
import { useI18n } from 'vue-i18n';
import type { InputEventRecord } from '@/shared/types';

const { t } = useI18n();

const props = defineProps<{
    startedAt: number | null;
    finishedAt: number | null;
    input: string[];
    undoCount: number;
    events: InputEventRecord[];
    isCustomMode?: boolean;
    isCustomSettingsSet?: boolean;
}>();

const now = useTrainingTimer(100);

const showNotice = computed(() => !props.events.length);

const isActive = computed(() => props.startedAt && !props.finishedAt);

const effectiveNow = computed(() =>
    isActive.value ? now.value : props.finishedAt ?? Date.now(),
);

const duration = computed(() => {
    if (!props.startedAt) return 0;
    const raw = (effectiveNow.value - props.startedAt) / 1000;
    return Math.max(0, raw);
});

const cpm = computed(() => {
    const charCount = props.input.length;
    return duration.value === 0
        ? 0
        : Math.round((charCount / duration.value) * 60);
});

const reaction = computed(() => {
    const times = props.events
        .filter((e) => e.type === 'input' && e.time)
        .map((e) => e.time ?? 0);
    if (!times.length) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
});

const accuracy = computed(() => {
    const inputs = props.events.filter((e) => e.type === 'input');
    const correct = inputs.filter((e) => e.actual === e.expected).length;
    if (!inputs.length) return 100;
    return Math.round((correct / inputs.length) * 100);
});

const stats = computed(() => [
    {
        label: t('training.time'),
        value: `${duration.value.toFixed(1)}${t('training.s')}`,
    },
    { label: t('training.accuracy'), value: `${accuracy.value}%` },
    { label: t('training.cpm'), value: cpm.value },
    {
        label: t('training.reaction'),
        value: `${reaction.value}${t('training.ms')}`,
    },
    { label: t('training.undo'), value: props.undoCount },
]);
</script>

<template>
    <div class="current-stats">
        <div
            v-if="props.isCustomMode && !props.isCustomSettingsSet"
            class="current-stats__overlay"
        >
            {{ t('training.settingsNotice') }}
        </div>
        <div v-else-if="showNotice" class="current-stats__overlay">
            {{ t('training.startNotice') }}
        </div>

        <div class="stat" v-for="stat in stats" :key="stat.label">
            <span class="stat__label">{{ stat.label }}</span>
            <span class="stat__value">{{ stat.value }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.current-stats {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: $current-stats-padding;
    font-family: 'Fira Code', monospace;
    font-size: $current-stats-font-size;
    color: var(--secondary-color);
    width: 100%;
    overflow: hidden;
}

.current-stats__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(3px);
    color: var(--secondary-color);
    font-size: $current-stats-overlay-font-size;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: $current-stats-stat-min-width;

    &__label {
        font-size: $current-stats-stat-label-font-size;
        color: $gray;
        margin-bottom: $current-stats-stat-margin-bottom;
    }

    &__value {
        font-weight: 700;
        font-size: $current-stats-stat-value-font-size;
    }
}
</style>
