<script setup lang="ts">
import { type StatsPeriod } from '@/shared/types';
import { AppSelector, type Option } from '@/shared/ui';
import { useI18n } from 'vue-i18n';

defineProps<{
    modelValue: StatsPeriod;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: StatsPeriod): void;
}>();

const { t } = useI18n();

const options: Option<StatsPeriod>[] = [
    { value: 'day', label: t('stats.period.day') },
    { value: 'week', label: t('stats.period.week') },
    { value: 'month', label: t('stats.period.month') },
    { value: 'all', label: t('stats.period.all') },
];

const onChange = (value: string) => {
    emit('update:modelValue', value as StatsPeriod);
};
</script>

<template>
    <AppSelector
        @update:modelValue="onChange"
        :modelValue="modelValue"
        :options="options"
    />
</template>
