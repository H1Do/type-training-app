<script setup lang="ts">
withDefaults(
    defineProps<{
        type: 'button' | 'submit' | 'reset';
        disabled?: boolean;
    }>(),
    {
        type: 'button',
        disabled: false,
    },
);
</script>

<template>
    <button :disabled="disabled" :type="type" class="button">
        <slot />
    </button>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.button {
    background-color: var(--background-color);
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color $transition-duration,
        color $transition-duration;

    &:hover {
        background-color: var(--primary-color);
        color: var(--background-color);
        border: 1px solid var(--primary-color);
    }

    &:active {
        background-color: var(--secondary-color);
        color: var(--background-color);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;

        &:hover {
            background-color: var(--background-color);
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
        }
    }
}
</style>
