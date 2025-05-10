<script setup lang="ts">
withDefaults(
    defineProps<{
        size?: string;
        weight?: number;
        align?: 'left' | 'center' | 'right';
        textStyle?: 'normal' | 'error' | 'warning';
        decoration?: 'underline' | 'line-through';
    }>(),
    {
        size: '1rem',
        weight: 400,
        textStyle: 'normal',
    },
);
</script>

<template>
    <span
        :class="[`text-${textStyle}`, `align-${align}`]"
        :style="{
            fontSize: size,
            fontWeight: weight,
            textDecoration: decoration,
        }"
    >
        <slot />
    </span>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

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
