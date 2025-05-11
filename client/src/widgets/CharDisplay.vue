<script setup lang="ts">
import { computed } from 'vue';
import { CHARS_PER_LINE, SHOWED_LINES } from '@/shared/config/training';

const props = defineProps<{
    sequence: string[];
    input: string[];
    currentIndex: number;
}>();

const totalLines = computed(() =>
    Math.ceil(props.sequence.length / CHARS_PER_LINE),
);

const completedLines = computed(() =>
    Math.floor(props.input.length / CHARS_PER_LINE),
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
    for (let i = 0; i < props.sequence.length; i += CHARS_PER_LINE) {
        result.push(props.sequence.slice(i, i + CHARS_PER_LINE));
    }

    const startLine = offset.value / CHARS_PER_LINE;
    return result.slice(startLine, startLine + SHOWED_LINES);
});

const getCharClass = (globalIndex: number): Record<string, boolean> => {
    const expected = props.sequence[globalIndex];
    const actual = props.input[globalIndex];

    return {
        correct: actual === expected && actual !== undefined,
        incorrect: actual !== expected && actual !== undefined,
        untyped: actual === undefined,
    };
};
</script>

<template>
    <div class="char-display">
        <div
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="char-display__row"
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
                        props.currentIndex ===
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

.char-display {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: $char-display-width;
    height: $char-display-height;
    font-family: 'Fira Code', monospace;
    font-size: $char-display-font-size;
    border: $border-width-big solid $char-display-border-color;
    border-radius: $char-display-border-radius;
    user-select: none;
}

.char-display__row {
    display: flex;
    justify-content: start;
    white-space: nowrap;
    gap: $char-display-font-gap;
}

.char {
    position: relative;
}

.whitespace {
    display: inline-block;
    width: $char-display-whitespace-size;
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
    width: 100%;
    height: $caret-height;
    background-color: var(--caret-color);
    pointer-events: none;
}
</style>
