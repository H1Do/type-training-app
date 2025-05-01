<script setup lang="ts">
import KeyboardPlate from './ui/KeyboardPlate.vue';
import TrainingLine from './ui/TrainingLine.vue';
import { useTrainingStore } from './model/trainingStore';

const training = useTrainingStore();
training.generateSequence(['а', 'о', 'л', 'д', ' ']);
</script>

<template>
    <div><TrainingLine /> <KeyboardPlate /></div>
</template>

<style scoped lang="scss"></style>
