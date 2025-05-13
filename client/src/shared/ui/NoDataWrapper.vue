<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppLoader from './AppLoader.vue';

defineProps<{
    noData: boolean;
    isLoading?: boolean;
    message?: string;
}>();

const { t } = useI18n();
</script>

<template>
    <div class="no-data-wrapper">
        <div :class="['content', { blurred: noData }]">
            <slot />
        </div>

        <div v-if="isLoading && noData" class="overlay">
            <AppLoader />
        </div>

        <div v-else-if="noData" class="overlay">
            {{ message || t('ui.noData') }}
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.no-data-wrapper {
    position: relative;
}

.content.blurred {
    filter: blur(1px);
    pointer-events: none;
    user-select: none;
    opacity: 0.6;
}

.overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    color: var(--background-color);
    font-weight: 600;
    font-size: 1rem;
    background: var(--primary-color);
    padding: 0.5rem 1rem;
    border-radius: $border-radius;
    z-index: 1;
}
</style>
