<script setup lang="ts">
import { computed } from 'vue';
import { useKeyboardStore } from '../model/keyboardStore';
import type { KeyboardKey } from '@/shared/config/keyboardLayouts';

const { keyData } = defineProps<{ keyData: KeyboardKey }>();
const keyboardStore = useKeyboardStore();

const isHinted = computed(() => keyData.code === keyboardStore.hintedKeyCode);
const isActive = computed(() => keyData.code === keyboardStore.pressedKeyCode);
const isError = computed(
    () =>
        keyData.code === keyboardStore.pressedKeyCode && keyboardStore.isError,
);

const displayedSymbol = computed(() =>
    keyboardStore.isShiftPressed ? keyData.upper : keyData.lower,
);
</script>

<template>
    <div
        class="keyboard-button"
        :class="{
            'keyboard-button--active': isActive,
            'keyboard-button--hinted': isHinted,
            'keyboard-button--error': isError,
            'keyboard-button--wide': keyData.isWide,
        }"
    >
        {{ displayedSymbol }}
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
    border: $border-width solid var(--primary-color);
    border-radius: $border-radius;
    transition: background-color $transition-duration ease,
        transform $transition-duration-fast ease;

    &--wide {
        height: $keyboard-button-size;
        width: $keyboard-space-size;
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
