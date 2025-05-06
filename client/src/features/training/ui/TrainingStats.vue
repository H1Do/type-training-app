<script setup lang="ts">
import { computed } from 'vue';
import { useTrainingStore } from '../model/trainingStore';
import { useTrainingTimer } from '@/shared/utils';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const trainingStore = useTrainingStore();
const now = useTrainingTimer(200);

const showNotice = computed(() => !trainingStore.events.length);

const isActive = computed(
    () => trainingStore.session && !trainingStore.isFinished,
);

const effectiveNow = computed(() =>
    isActive.value
        ? now.value
        : trainingStore.session?.finishedAt ?? Date.now(),
);

const duration = computed(() => {
    if (!trainingStore.session?.startedAt) return 0;
    const raw = (effectiveNow.value - trainingStore.session.startedAt) / 1000;
    return Math.max(0.1, raw);
});

const cpm = computed(() => {
    if (!trainingStore.session?.startedAt) return 0;
    const charCount = trainingStore.input.length;
    return duration.value === 0
        ? 0
        : Math.round((charCount / duration.value) * 60);
});

const reaction = computed(() => {
    if (!trainingStore.session?.startedAt) return 0;
    const times = trainingStore.events
        .filter((e) => e.type === 'input' && e.time)
        .map((e) => e.time);
    if (!times.length) return 0;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
});

const accuracy = computed(() => {
    if (!trainingStore.session?.startedAt) return 100;
    const inputs = trainingStore.events.filter((e) => e.type === 'input');
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
    { label: t('training.undo'), value: trainingStore.undoCount },
]);
</script>

<template>
    <div class="training-stats">
        <div
            v-if="
                trainingStore.isCustomMode && !trainingStore.isCustomSettingsSet
            "
            class="training-stats__overlay"
        >
            {{ t('training.settingsNotice') }}
        </div>
        <div v-else-if="showNotice" class="training-stats__overlay">
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
