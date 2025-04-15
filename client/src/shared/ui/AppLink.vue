<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
    to: {
        type: String,
        required: false,
        default: '',
    },
    params: {
        type: Object,
        default: () => ({}),
    },
    replace: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String as PropType<'normal' | 'external' | 'button'>,
        default: 'normal',
    },
});
</script>

<template>
    <template v-if="type === 'external'">
        <a
            :href="to"
            target="_blank"
            rel="noopener noreferrer"
            class="app-link external"
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

    &:active {
        color: var(--primary-color);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        pointer-events: none;
    }

    &.button {
        background: none;
        border: none;
        padding: 0;
        font-size: 16px;
        text-align: left;
        cursor: pointer;
        transition: color $transition-duration;

        &:hover {
            color: var(--secondary-color);
        }

        &:active {
            color: var(--primary-color);
        }

        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    }
}
</style>
