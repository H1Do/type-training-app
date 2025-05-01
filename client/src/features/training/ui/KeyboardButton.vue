<script setup lang="ts">
import { computed } from 'vue';
import { useKeyboardStore } from '../model/keyboardStore';
import type { KeyboardKey } from '@/shared/types';
import { Difficulty } from '@/shared/types';
import { useSettingsStore } from '../../settings/model/settings';

const { keyData } = defineProps<{ keyData: KeyboardKey }>();

const keyboardStore = useKeyboardStore();
const settingsStore = useSettingsStore();

const isHinted = computed(() => keyData.code === keyboardStore.hintedKeyCode);
const isActive = computed(() => keyData.code === keyboardStore.pressedKeyCode);
const isError = computed(
    () =>
        keyData.code === keyboardStore.pressedKeyCode && keyboardStore.isError,
);

const showZone = computed(
    () => settingsStore.difficulty === Difficulty.ZONE_HINTS,
);
const showHint = computed(
    () => settingsStore.difficulty === Difficulty.KEY_HINTS || showZone,
);
const showKey = computed(() => settingsStore.difficulty !== Difficulty.BLIND);

const displayedSymbol = computed(() =>
    keyboardStore.isShiftPressed ? keyData.upper : keyData.lower,
);

console.log(keyData.finger);
</script>

<template>
    <div
        class="keyboard-button"
        :class="{
            'keyboard-button--active': isActive,
            'keyboard-button--hinted': showHint && isHinted,
            'keyboard-button--error': isError,
            'keyboard-button--space': keyData.code === 'Space',
            'keyboard-button--backspace': keyData.code === 'Backspace',
            [`keyboard-button--finger-${keyData.finger}`]: showZone,
        }"
    >
        <span v-if="showKey" class="keyboard-button__symbol">
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
        background-color: $light-blue;
    }

    &--error {
        background-color: $light-red;
    }

    &--active {
        transform: scale(0.95);
    }
}
</style>
