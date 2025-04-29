<script setup lang="ts">
import { useTrainingStore } from '../model/trainingStore';

const training = useTrainingStore();
</script>

<template>
    <div class="training-line">
        <span
            v-for="(char, index) in training.sequence"
            :key="index"
            :class="{
                correct: training.inputHistory[index]?.correct === true,
                incorrect: training.inputHistory[index]?.correct === false,
                current: index === training.currentIndex,
            }"
        >
            {{ char }}
        </span>
    </div>
</template>

<style scoped lang="scss">
.training-line {
    font-size: 2rem;
    font-family: monospace;
    display: flex;
    gap: 4px;

    .correct {
        color: green;
    }

    .incorrect {
        color: red;
    }

    .current {
        text-decoration: underline;
    }
}
</style>
