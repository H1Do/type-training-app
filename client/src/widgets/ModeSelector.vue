<script setup lang="ts">
import { TrainingMode } from '@/shared/types/training';
import { AppSelector, type Option } from '@/shared/ui';
import { useI18n } from 'vue-i18n';
import { iconLabel } from '@/shared/utils/input';

const { t } = useI18n();

const props = defineProps<{
    modelValue: TrainingMode;
    withCustom?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: TrainingMode): void;
}>();

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
        value: TrainingMode['100PopularWords'],
        label: 'Popular Words',
        content: {
            render: () =>
                iconLabel('Flame', t('training.modes.100PopularWords')),
        },
    },
    {
        value: TrainingMode['1000PopularWords'],
        label: 'Popular Words',
        content: {
            render: () =>
                iconLabel('Database', t('training.modes.1000PopularWords')),
        },
    },
    {
        value: TrainingMode.Programming,
        label: 'Programming',
        content: {
            render: () => iconLabel('CodeXml', t('training.modes.programming')),
        },
    },
];

if (props.withCustom) {
    options.push({
        value: TrainingMode.Custom,
        label: 'Custom',
        content: {
            render: () => iconLabel('Pen', t('training.modes.custom')),
        },
    });
}

const onChange = (value: string) => {
    emit('update:modelValue', value as TrainingMode);
};
</script>

<template>
    <AppSelector
        @update:modelValue="onChange"
        :modelValue="modelValue"
        :options="options"
    />
</template>
