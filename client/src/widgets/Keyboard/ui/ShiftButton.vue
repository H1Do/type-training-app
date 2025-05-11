<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Difficulty } from '@/shared/types';

const props = defineProps<{
    isShiftRequired: boolean;
    difficulty: Difficulty;
}>();

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

const easyMode = computed(() => props.difficulty === Difficulty.Easy);
const mediumMode = computed(() => props.difficulty === Difficulty.Medium);
const expertMode = computed(() => props.difficulty === Difficulty.Expert);

const isHinted = computed(
    () => props.isShiftRequired && (easyMode.value || mediumMode.value),
);
</script>

<template>
    <div
        class="shift-button"
        :class="{
            'shift-button--active': isActive && !expertMode,
            'shift-button--hinted': isHinted,
            'shift-button--zone': easyMode,
        }"
    >
        <span class="keyboard-button__symbol">Shift</span>
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
