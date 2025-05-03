<script setup lang="ts">
import { type TrainingStats } from '@/shared/types/training';
import { AppButton, AppModal } from '@/shared/ui';
import { useTrainingStore } from '../model/trainingStore';

const trainingStore = useTrainingStore();

defineProps<{ stats: TrainingStats }>();

const emit = defineEmits<{
    (e: 'resolve', value: boolean): void;
}>();

const onCancel = () => {
    emit('resolve', false);
    trainingStore.prepare();
};
</script>

<template>
    <AppModal @close="onCancel" class="modal">
        <h2 class="modal__title">Your Stats</h2>
        <ul>
            <li>Accuracy: {{ stats.accuracy }}%</li>
            <li>CPM: {{ stats.cpm }}</li>
            <li>Reaction Time: {{ stats.averageReaction }}ms</li>
            <li>Duration: {{ (stats.duration / 1000).toFixed(1) }}s</li>
        </ul>
        <AppButton @click="onCancel">Restart</AppButton>
    </AppModal>
</template>

<style scoped>
.modal {
    padding: 1rem;

    &__title {
        font-size: 1.5rem;
        margin: 0;
    }
}
</style>
