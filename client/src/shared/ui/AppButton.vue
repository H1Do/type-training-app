<script setup lang="ts">
import AppLoader from './AppLoader.vue';

withDefaults(
    defineProps<{
        type?: 'button' | 'submit' | 'reset';
        buttonStyle?: 'primary' | 'highlighted' | 'error' | 'clear';
        disabled?: boolean;
        title?: string;
        isLoading?: boolean;
    }>(),
    {
        type: 'button',
        buttonStyle: 'primary',
        disabled: false,
        title: '',
    },
);
</script>

<template>
    <button
        :disabled="disabled || isLoading"
        :type="type"
        :title="title"
        class="button"
        :class="`button--${buttonStyle}`"
    >
        <slot v-if="!isLoading" />
        <AppLoader size="1.5rem" v-else />
    </button>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.button {
    background-color: var(--background-color);
    color: var(--primary-color);
    border: $border-width solid var(--primary-color);
    border-radius: $border-radius;
    padding: $button-padding;
    cursor: pointer;
    transition: background-color $transition-duration,
        color $transition-duration;
    display: flex;
    align-items: center;
    justify-content: center;

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
        opacity: $button-disabled-opacity;
        cursor: not-allowed;

        &:hover {
            background-color: var(--background-color);
            color: var(--primary-color);
            border-color: var(--primary-color);
        }
    }

    &--highlighted {
        border: $border-width-big solid var(--primary-color);
        text-decoration: underline;
    }

    &--error {
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

    &--clear {
        color: var(--primary-color);
        background: transparent;
        border: transparent;
        line-height: 1;
        padding: 0;
        transition: color $transition-duration;

        &:hover {
            background: transparent;
            border: transparent;
            color: var(--secondary-color);
        }

        &:active {
            background: transparent;
            border: transparent;
            color: var(--secondary-color);
        }
    }
}
</style>
