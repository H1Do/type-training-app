<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
    size: {
        type: String,
        default: '16px',
    },
    textStyle: {
        type: String as PropType<'normal' | 'error' | 'warning'>,
        default: 'normal',
    },
});
</script>

<template>
    <span :class="`text-${textStyle}`" :style="{ fontSize: size }">
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
</style>
