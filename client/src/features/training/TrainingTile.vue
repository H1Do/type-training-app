<script setup lang="ts">
import { onMounted } from 'vue';
import KeyboardPlate from './ui/KeyboardPlate.vue';
import TrainingDisplay from './ui/TrainingDisplay.vue';
import { AppButton, VFlex } from '@/shared/ui';
import TrainingStats from './ui/TrainingStats.vue';
import { useTrainingStore } from './model/trainingStore';
import { TrainingMode } from '@/shared/types/training';

const trainingStore = useTrainingStore();

const prepareTraining = async (mode: TrainingMode) => {
    await trainingStore.prepare(mode);
};

onMounted(() => {
    prepareTraining(TrainingMode.Letters);
});
</script>

<template>
    <div class="training-tile">
        <VFlex gap="16px" align="center">
            <TrainingDisplay />
            <TrainingStats />
            <KeyboardPlate />
            <AppButton @click="prepareTraining(TrainingMode.Letters)">
                Restart
            </AppButton>
        </VFlex>
    </div>
</template>

<style scoped lang="scss">
.training-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
</style>
