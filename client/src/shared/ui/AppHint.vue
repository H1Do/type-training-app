<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';

const props = withDefaults(
    defineProps<{
        hint?: string;
        position?:
            | 'top-left'
            | 'top-right'
            | 'bottom-left'
            | 'bottom-right'
            | 'bottom-mid-right'
            | 'bottom-mid-left'
            | 'top-mid-right'
            | 'top-mid-left';
        delay?: number;
    }>(),
    {
        hint: '',
        position: 'bottom-mid-right',
        delay: 300,
    },
);

const show = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

const onMouseEnter = () => {
    timeout = setTimeout(() => {
        show.value = true;
    }, props.delay);
};

const onMouseLeave = () => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    show.value = false;
};

onBeforeUnmount(() => {
    if (timeout) clearTimeout(timeout);
});
</script>

<template>
    <div
        class="hover-hint-wrapper"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <slot />
        <span
            v-if="show && hint"
            class="hover-hint-text"
            :class="`hover-hint--${props.position}`"
        >
            <p
                v-for="(line, index) in hint.split('\n')"
                :key="index"
                class="hint-line"
            >
                {{ line }}
            </p>
        </span>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.hover-hint-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    .hover-hint-text {
        position: absolute;
        background-color: var(--hint-background-color);
        color: var(--hint-color);
        border: $border-width solid var(--hint-border-color);
        border-radius: $border-radius;
        font-size: $hint-font-size;
        padding: $hint-padding;
        white-space: nowrap;
        pointer-events: none;
        z-index: $hint-z-index;
        opacity: 0;
        transition: opacity $transition-duration ease;
    }

    &:hover .hover-hint-text {
        opacity: 1;
    }

    .hover-hint--bottom-right {
        top: 100%;
        left: 100%;
        transform: translate($hint-offset, $hint-offset);
    }

    .hover-hint--bottom-left {
        top: 100%;
        right: 100%;
        transform: translate(-$hint-offset, $hint-offset);
    }

    .hover-hint--top-right {
        bottom: 100%;
        left: 100%;
        transform: translate($hint-offset, -$hint-offset);
    }

    .hover-hint--top-left {
        bottom: 100%;
        right: 100%;
        transform: translate(-$hint-offset, -$hint-offset);
    }

    .hover-hint--bottom-mid-right {
        top: 100%;
        left: 75%;
        transform: translate(-25%, $hint-offset);
    }

    .hover-hint--bottom-mid-left {
        top: 100%;
        left: 25%;
        transform: translate(-50%, $hint-offset);
    }

    .hover-hint--top-mid-right {
        bottom: 100%;
        left: 75%;
        transform: translate(-25%, -$hint-offset);
    }

    .hover-hint--top-mid-left {
        bottom: 100%;
        left: 25%;
        transform: translate(-50%, -$hint-offset);
    }
}
</style>
