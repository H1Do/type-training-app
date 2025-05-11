<script setup lang="ts">
import { computed } from 'vue';
import { type KeyboardKey, Difficulty } from '@/shared/types';

const props = defineProps<{
    keyData: KeyboardKey;
    pressedKeyCode: string;
    hintedKeyCode: string;
    isError: boolean;
    isShiftPressed: boolean;
    difficulty: Difficulty;
}>();

const isHinted = computed(() => props.keyData.code === props.hintedKeyCode);
const isActive = computed(() => props.keyData.code === props.pressedKeyCode);
const isErrored = computed(() => isActive.value && props.isError);

const easyMode = computed(() => props.difficulty === Difficulty.Easy);
const mediumMode = computed(() => props.difficulty === Difficulty.Medium);
const expertMode = computed(() => props.difficulty === Difficulty.Expert);

const displayedSymbol = computed(() =>
    props.isShiftPressed ? props.keyData.upper : props.keyData.lower,
);
</script>

<template>
    <div
        class="keyboard-button"
        :class="{
            'keyboard-button--active': isActive && !expertMode,
            'keyboard-button--hinted': isHinted && (easyMode || mediumMode),
            'keyboard-button--error': isErrored && (easyMode || mediumMode),
            'keyboard-button--space': keyData.code === 'Space',
            'keyboard-button--backspace': keyData.code === 'Backspace',
            [`keyboard-button--finger-${keyData.finger}`]: easyMode,
        }"
    >
        <span class="keyboard-button__symbol">
            {{ displayedSymbol }}
        </span>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.keyboard-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fira Code', monospace;
    width: $keyboard-button-size;
    aspect-ratio: 1;
    border: $border-width solid var(--keyboard-button-border-color);
    border-radius: $border-radius;
    transition: background-color $transition-duration ease,
        transform $transition-duration-fast ease, color $transition-duration;

    &__symbol {
        transition: opacity $transition-duration;
    }

    &--space {
        height: $keyboard-button-size;
        width: $keyboard-space-size;
    }

    &--backspace {
        height: $keyboard-button-size;
        width: $keyboard-backspace-size;
    }

    &--finger-left-pinky {
        background-color: var(--finger-left-pinky);
    }

    &--finger-left-ring {
        background-color: var(--finger-left-ring);
    }

    &--finger-left-middle {
        background-color: var(--finger-left-middle);
    }

    &--finger-left-index {
        background-color: var(--finger-left-index);
    }

    &--finger-right-index {
        background-color: var(--finger-right-index);
    }

    &--finger-right-middle {
        background-color: var(--finger-right-middle);
    }

    &--finger-right-ring {
        background-color: var(--finger-right-ring);
    }

    &--finger-right-pinky {
        background-color: var(--finger-right-pinky);
    }

    &--finger-thumb {
        background-color: var(--finger-thumb);
    }

    &--hinted {
        background-color: $hinted-button;
    }

    &--error {
        background-color: $incorrect-button;
    }

    &--active {
        transform: scale($pressed-button-scale);
    }
}
</style>
