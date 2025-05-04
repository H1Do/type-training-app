<script setup lang="ts">
import { h } from 'vue';
import { TrainingMode } from '@/shared/types/training';
import { AppIcon, AppSelector, type Option } from '@/shared/ui';
import { useTrainingStore } from '../model/trainingStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const trainingStore = useTrainingStore();

const iconLabel = (icon: string, label: string) =>
    h('span', { style: 'display: flex; align-items: center; gap: 6px' }, [
        h(AppIcon, { name: icon, size: 18 }),
        h('span', label),
    ]);

const options: Option<TrainingMode>[] = [
    {
        value: TrainingMode.Letters,
        label: 'Letters',
        content: {
            render: () => iconLabel('Type', t('training.modes.letters')),
        },
    },
    {
        value: TrainingMode.Symbols,
        label: 'Symbols',
        content: {
            render: () => iconLabel('Braces', t('training.modes.symbols')),
        },
    },
    {
        value: TrainingMode.Numbers,
        label: 'Numbers',
        content: {
            render: () => iconLabel('Hash', t('training.modes.numbers')),
        },
    },
    {
        value: TrainingMode.PopularWords,
        label: 'Popular Words',
        content: {
            render: () => iconLabel('Flame', t('training.modes.popularWords')),
        },
    },
];

const onChange = (value: string) => {
    trainingStore.setMode(value as TrainingMode);
};
</script>

<template>
    <AppSelector
        @update:modelValue="onChange"
        :modelValue="trainingStore.mode"
        :options="options"
    />
</template>
