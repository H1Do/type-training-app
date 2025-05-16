<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

withDefaults(
    defineProps<{
        to?: RouteLocationRaw | string;
        params?: Record<string, unknown>;
        replace?: boolean;
        disabled?: boolean;
        type?: 'normal' | 'external' | 'button';
    }>(),
    {
        to: '',
        replace: false,
        disabled: false,
        type: 'normal',
    },
);
</script>

<template>
    <template v-if="type === 'external'">
        <a
            :href="to as string"
            target="_blank"
            rel="noopener noreferrer"
            class="app-link external"
            :class="{
                disabled,
            }"
            v-bind="$attrs"
        >
            <slot />
        </a>
    </template>

    <template v-else-if="type === 'normal'">
        <router-link
            :to="to"
            :params="params"
            :replace="replace"
            class="app-link"
            :class="{
                disabled,
            }"
            v-bind="$attrs"
        >
            <slot />
        </router-link>
    </template>

    <template v-else>
        <button :disabled="disabled" class="app-link button" v-bind="$attrs">
            <slot />
        </button>
    </template>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.app-link {
    color: var(--primary-color);
    text-decoration: underline;
    cursor: pointer;
    transition: color $transition-duration, border-color $transition-duration;

    &:hover {
        color: var(--secondary-color);
    }

    &.disabled {
        opacity: $app-link-disabled-opacity;
        cursor: not-allowed;
        pointer-events: none;
    }

    &.button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        transition: color $transition-duration;

        &:hover {
            color: var(--secondary-color);
        }

        &:active {
            color: var(--primary-color);
        }

        &:disabled {
            opacity: $app-link-disabled-opacity;
            cursor: not-allowed;
        }
    }
}
</style>
