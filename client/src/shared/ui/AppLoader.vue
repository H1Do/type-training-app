<script setup lang="ts">
import AppIcon from './AppIcon.vue';

withDefaults(
    defineProps<{
        size?: string;
    }>(),
    {
        size: '2rem',
    },
);
</script>

<template>
    <AppIcon name="Loader" :size="size" class="loader" />
</template>

<style scoped lang="scss">
.loader {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
