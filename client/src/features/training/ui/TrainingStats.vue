<script setup lang="ts">
import { computed } from 'vue';
import { useTrainingStore } from '../model/trainingStore';
import { useTrainingTimer } from '@/shared/utils';

const training = useTrainingStore();
const now = useTrainingTimer(200);

const showNotice = computed(() => {
    return training.session && training.session.startedAt === 0;
});

const isActive = computed(() => training.session && !training.isFinished);

const effectiveNow = computed(() =>
    isActive.value ? now.value : training.session?.finishedAt ?? Date.now(),
);

const duration = computed(() => {
    if (!training.session?.startedAt) return 0;
    const raw = (effectiveNow.value - training.session.startedAt) / 1000;
    return Math.max(0.1, raw);
});

const cpm = computed(() => {
    const charCount = training.input.length;
    return duration.value === 0
        ? 0
        : Math.round((charCount / duration.value) * 60);
});

const reaction = computed(() => {
    const times = training.events
        .filter((e) => e.type === 'input' && e.time)
        .map((e) => e.time);
    if (!times.length) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
});

const accuracy = computed(() => {
    const inputs = training.events.filter((e) => e.type === 'input');
    const correct = inputs.filter((e) => e.actual === e.expected).length;
    if (!inputs.length) return 100;
    return Math.round((correct / inputs.length) * 100);
});

const stats = computed(() => [
    { label: 'Time', value: `${duration.value.toFixed(1)}s` },
    { label: 'Accuracy', value: `${accuracy.value}%` },
    { label: 'CPM', value: cpm.value },
    { label: 'Avg Reaction', value: `${reaction.value}ms` },
    { label: 'Undo', value: training.undoCount },
]);
</script>

<template>
    <div class="training-stats">
        <div v-if="showNotice" class="training-stats__overlay">
            Начните печатать, чтобы начать тренировку
        </div>
        <div class="stat" v-for="stat in stats" :key="stat.label">
            <span class="stat__label">{{ stat.label }}</span>
            <span class="stat__value">{{ stat.value }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.training-stats {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 1rem;
    color: var(--secondary-color);
    width: 100%;
    overflow: hidden;
}

.training-stats__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(3px);
    color: ver(--secondary-color);
    font-size: 0.9rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 1;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 4rem;

    &__label {
        font-size: 0.75rem;
        color: $gray;
        margin-bottom: 0.25rem;
    }

    &__value {
        font-weight: bold;
        font-size: 1.1rem;
    }
}
</style>
