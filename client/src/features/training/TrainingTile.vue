<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import KeyboardPlate from './ui/KeyboardPlate.vue';
import TrainingDisplay from './ui/TrainingDisplay.vue';
import { AppButton, AppText, VFlex } from '@/shared/ui';
import TrainingStats from './ui/TrainingStats.vue';
import { useTrainingStore } from './model/trainingStore';
import TrainingModeSelector from './ui/TrainingModeSelector.vue';

const trainingStore = useTrainingStore();

const prepareTraining = async () => {
    await trainingStore.prepare();
};

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        prepareTraining();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    prepareTraining();
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

watch(
    () => trainingStore.mode,
    () => {
        prepareTraining();
    },
);
</script>

<template>
    <VFlex gap="16px" align="center">
        <TrainingModeSelector class="mode-selector" />
        <TrainingDisplay />
        <TrainingStats />
        <KeyboardPlate />
        <AppText class="restart-message">
            Press
            <AppButton
                @click="prepareTraining"
                buttonStyle="clear"
                class="clear-button"
            >
                ESC
            </AppButton>
            to restart training
        </AppText>
    </VFlex>
</template>

<style scoped lang="scss">
.mode-selector {
    align-self: start;
    padding-inline: 16px;
}

.clear-button {
    font-weight: 500;
    text-decoration: underline;
    color: var(--secondary-color);
}

.restart-message {
    color: var(--secondary-color);
}
</style>
