<script setup lang="ts">
import type { PerItemStatMetric } from '@/shared/types/training';
import { AppSelector, type Option } from '@/shared/ui';
import { iconLabel } from '@/shared/utils/input';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
    modelValue: PerItemStatMetric;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: PerItemStatMetric): void;
}>();

const onMetricChange = (metric: string) => {
    emit('update:modelValue', metric as PerItemStatMetric);
};

const metricOptions: Option<PerItemStatMetric>[] = [
    {
        label: 'Reaction',
        value: 'averageReaction',
        content: {
            render: () => iconLabel('Timer', t('stats.metrics.reaction')),
        },
    },
    {
        label: 'Errors',
        value: 'errorsCount',
        content: {
            render: () =>
                iconLabel('SpellCheck2', t('stats.metrics.errorsCount')),
        },
    },
    {
        label: 'Accuracy',
        value: 'accuracy',
        content: {
            render: () => iconLabel('SpellCheck', t('stats.metrics.accuracy')),
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
