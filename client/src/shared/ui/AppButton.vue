<script setup lang="ts">
withDefaults(
    defineProps<{
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        error?: boolean;
    }>(),
    {
        type: 'button',
        disabled: false,
    },
);
</script>

<template>
    <button :disabled="disabled" :type="type" class="button" :class="{ error }">
        <slot />
    </button>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.button {
    background-color: var(--background-color);
    color: var(--primary-color);
    border: $border-width solid var(--primary-color);
    border-radius: $border-radius;
    padding: 6px 12px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color $transition-duration,
        color $transition-duration;

    &.error {
        color: $error;
        border-color: $error;

        &:hover {
            background-color: $error;
            color: $white;
            border-color: $error;
        }

        &:active {
            background-color: $error;
            color: $white;
        }
    }

    &:hover {
        background-color: var(--primary-color);
        color: var(--background-color);
        border-color: var(--primary-color);
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
            border-color: var(--primary-color);
        }
    }
}
</style>
