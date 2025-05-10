<script setup lang="ts">
import type { StatMetric } from '@/shared/types';
import { AppSelector, type Option } from '@/shared/ui';
import { iconLabel } from '@/shared/utils/input';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
    modelValue: StatMetric;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: StatMetric): void;
}>();

const onMetricChange = (metric: string) => {
    emit('update:modelValue', metric as StatMetric);
};

const metricOptions: Option<StatMetric>[] = [
    {
        label: 'Reaction',
        value: 'averageReaction',
        content: {
            render: () => iconLabel('Timer', t('stats.metrics.reaction')),
        },
    },
    {
        label: 'Accuracy',
        value: 'accuracy',
        content: {
            render: () => iconLabel('SpellCheck', t('stats.metrics.accuracy')),
        },
    },
    {
        label: 'CPM',
        value: 'cpm',
        content: {
            render: () => iconLabel('Flame', t('stats.metrics.cpm')),
        },
    },
    {
        label: '',
        value: 'errorsRate',
        content: {
            render: () =>
                iconLabel('SpellCheck2', t('stats.metrics.errorsRate')),
        },
    },
];
</script>

<template>
    <AppSelector
        :options="metricOptions"
        :modelValue="modelValue"
        @update:modelValue="onMetricChange"
    />
</template>

<style scoped lang="scss"></style>
