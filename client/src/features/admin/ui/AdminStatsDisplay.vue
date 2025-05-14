<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AdminStatsResponse } from '@/shared/types/admin';

const props = defineProps<{
    stats: AdminStatsResponse | null;
}>();

const { t } = useI18n();

const statsList = computed(() => {
    if (!props.stats) return [];

    return [
        {
            label: t('admin.stats.totalUsers'),
            value: props.stats.totalUsers,
        },
        {
            label: t('admin.stats.activeUsersToday'),
            value: props.stats.activeUsersToday,
        },
        {
            label: t('admin.stats.activeUsersWeek'),
            value: props.stats.activeUsersWeek,
        },
        {
            label: t('admin.stats.totalTrainings'),
            value: props.stats.totalTrainings,
        },
        {
            label: t('admin.stats.totalLessonsCompleted'),
            value: props.stats.totalLessonsCompleted,
        },
        props.stats.mostPopularMode && {
            label: t('admin.stats.mostPopularMode'),
            value:
                t(`training.modes.${props.stats.mostPopularMode.mode}`) +
                ` (${props.stats.mostPopularMode.count})`,
        },
        {
            label: t('admin.stats.avgAccuracy'),
            value:
                props.stats.avgAccuracy != null
                    ? `${props.stats.avgAccuracy.toFixed(1)}%`
                    : '–',
        },
        {
            label: t('admin.stats.avgCpm'),
            value:
                props.stats.avgCpm != null
                    ? `${Math.round(props.stats.avgCpm)}`
                    : '–',
        },
    ].filter(Boolean);
});
</script>

<template>
    <div class="admin-stats">
        <div class="stat" v-for="stat in statsList" :key="stat?.label">
            <span class="stat__label">{{ stat?.label }}</span>
            <span class="stat__value">{{ stat?.value }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.admin-stats {
    display: flex;
    flex-direction: column;
    border: var(--primary-color) solid $border-width-big;
    border-radius: $border-radius;
    padding: $gap;
    font-family: 'Fira Code', monospace;
    color: var(--secondary-color);
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &__label {
        font-size: 0.875rem;
        color: $gray;
        margin-bottom: 0.25rem;
    }

    &__value {
        font-weight: 700;
        font-size: 1rem;
    }
}
</style>
