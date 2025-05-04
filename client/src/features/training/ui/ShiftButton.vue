<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useKeyboardStore } from '../model/keyboardStore';
import { Difficulty } from '@/shared/types';
import { useSettingsStore } from '../../settings/model/settings';

const keyboardStore = useKeyboardStore();
const settingsStore = useSettingsStore();

const isHinted = computed(() => keyboardStore.isShiftRequired);
const isActive = ref(false);

const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
        isActive.value = true;
    }
};

const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
        isActive.value = false;
    }
};

onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
});

const zoneHintsMode = computed(
    () => settingsStore.difficulty === Difficulty.ZONE_HINTS,
);
const keyHintsMode = computed(
    () => settingsStore.difficulty === Difficulty.KEY_HINTS,
);
const blindMode = computed(() => settingsStore.difficulty === Difficulty.BLIND);
</script>

<template>
    <div
        class="shift-button"
        :class="{
            'shift-button--active': isActive && !blindMode,
            'shift-button--hinted': isHinted && (zoneHintsMode || keyHintsMode),
            'shift-button--zone': zoneHintsMode,
        }"
    >
        <span class="keyboard-button__symbol"> Shift </span>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.shift-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fira Code', monospace;
    height: $keyboard-button-size;
    width: $keyboard-backspace-size;
    border: $border-width solid var(--keyboard-button-border-color);
    border-radius: $border-radius;
    transition: background-color $transition-duration ease,
        transform $transition-duration-fast ease, color $transition-duration;

    &--zone {
        background-color: var(--finger-left-pinky);
    }

    &--hinted {
        background-color: $hinted-button;
    }

    &--active {
        transform: scale($pressed-button-scale);
    }
}
</style>
