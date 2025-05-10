<script setup lang="ts">
import {
    defineEmits,
    onMounted,
    onBeforeUnmount,
    defineProps,
    type Component,
} from 'vue';

export interface AppModalProps {
    component?: Component;
}

defineProps<AppModalProps>();

const emit = defineEmits(['close']);

function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') emit('close');
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
});

let mouseDownOnOverlay = false;

function handleMouseDown(e: MouseEvent) {
    if (e.target === e.currentTarget) {
        mouseDownOnOverlay = true;
    }
}

function handleMouseUp(e: MouseEvent) {
    if (mouseDownOnOverlay && e.target === e.currentTarget) {
        emit('close');
    }
    mouseDownOnOverlay = false;
}
</script>

<template>
    <div
        class="app-modal__wrapper"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
    >
        <div class="app-modal">
            <component :is="component" v-if="component" />
            <slot v-else />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.app-modal {
    background-color: var(--background-color);
    color: var(--primary-color);
    padding: 16px;
    border-radius: 12px;
    box-shadow: $box-shadow-modal;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;

    &__wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $container-background-color-modal;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: $z-index-modal;
    }
}
</style>
