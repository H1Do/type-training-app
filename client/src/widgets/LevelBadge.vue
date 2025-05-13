<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
    level: number;
}>();
</script>

<template>
    <div
        class="level-badge"
        :style="{ backgroundColor: `var(--level-color-${level})` }"
        :title="`${t('level.level')} ${level}`"
    >
        {{ t('level.lvl') }} {{ level }}
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.level-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    font-weight: 700;
    border-radius: $border-radius-big;
    color: $black;
    background-color: var(--level-color-1);
    line-height: 1;
    user-select: none;
    white-space: nowrap;
}
</style>
