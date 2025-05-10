<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    noData: boolean;
    message?: string;
}>();

const { t } = useI18n();
</script>

<template>
    <div class="no-data-wrapper">
        <div :class="['content', { blurred: noData }]">
            <slot />
        </div>

        <div v-if="noData" class="overlay">
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
