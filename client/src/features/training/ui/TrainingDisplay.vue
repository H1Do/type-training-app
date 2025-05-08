<script setup lang="ts">
import { computed } from 'vue';
import { useTrainingStore } from '../model/trainingStore';
import { CHARS_PER_LINE, SHOWED_LINES } from '@/shared/config/training';

const trainingStore = useTrainingStore();

const sequence = computed(() => trainingStore.sequence);

const totalLines = computed(() =>
    Math.ceil(sequence.value.length / CHARS_PER_LINE),
);

const completedLines = computed(() =>
    Math.floor(trainingStore.input.length / CHARS_PER_LINE),
);

const offset = computed(() => {
    const lastWindowStartLine = totalLines.value - SHOWED_LINES;

    if (totalLines.value <= SHOWED_LINES) return 0;

    if (completedLines.value < lastWindowStartLine + 1) {
        return Math.max(0, (completedLines.value - 1) * CHARS_PER_LINE);
    }

    return lastWindowStartLine * CHARS_PER_LINE;
});

const rows = computed(() => {
    const result: string[][] = [];
    for (let i = 0; i < sequence.value.length; i += CHARS_PER_LINE) {
        result.push(sequence.value.slice(i, i + CHARS_PER_LINE));
    }

    const startLine = offset.value / CHARS_PER_LINE;
    return result.slice(startLine, startLine + SHOWED_LINES);
});

const getCharClass = (globalIndex: number): Record<string, boolean> => {
    const expected = sequence.value[globalIndex];
    const actual = trainingStore.input[globalIndex];

    return {
        correct: actual === expected && actual !== undefined,
        incorrect: actual !== expected && actual !== undefined,
        untyped: actual === undefined,
    };
};
</script>

<template>
    <div class="training-display">
        <div
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="training-display__row"
        >
            <span
                v-for="(char, index) in row"
                :key="index"
                class="char"
                :class="
                    getCharClass(offset + rowIndex * CHARS_PER_LINE + index)
                "
            >
                <span v-if="char === ' '" class="whitespace"> </span>
                <span v-else>{{ char }}</span>
                <span
                    v-if="
                        trainingStore.currentIndex ===
                        offset + rowIndex * CHARS_PER_LINE + index
                    "
                    class="caret"
                />
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.training-display {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: $training-display-width;
    height: $training-display-height;
    font-family: 'Fira Code', monospace;
    font-size: $training-display-font-size;
    border: $border-width-big solid $training-display-border-color;
    border-radius: $training-display-border-radius;
    user-select: none;
}

.training-display__row {
    display: flex;
    justify-content: start;
    white-space: nowrap;
    gap: $training-display-font-gap;
}

.char {
    position: relative;
}

.whitespace {
    display: inline-block;
    width: $training-display-whitespace-size;
    text-align: center;
}

.correct {
    color: $correct-symbol-color;
}

.incorrect {
    color: $incorrect-symbol-color;
}

.untyped {
    color: $untyped-symbol-color;
}

.caret {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background-color: var(--caret-color);
    animation: blink 1s step-start infinite;
    pointer-events: none;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}
</style>
