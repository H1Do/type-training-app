<script setup lang="ts">
withDefaults(
    defineProps<{
        size?: string;
        align?: 'left' | 'center' | 'right';
        textStyle?: 'normal' | 'error' | 'warning';
    }>(),
    {
        size: '16px',
        textStyle: 'normal',
    },
);
</script>

<template>
    <span
        :class="[`text-${textStyle}`, `align-${align}`]"
        :style="{ fontSize: size }"
    >
        <slot />
    </span>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.text-normal {
    color: var(--primary-color);
}

.text-error {
    color: $error;
}

.text-warning {
    color: $warning;
}

.align-left {
    text-align: left;
}

.align-center {
    text-align: center;
}

.align-right {
    text-align: right;
}
</style>
