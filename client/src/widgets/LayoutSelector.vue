<script setup lang="ts">
import { layoutNameMap } from '@/features/settings/model/settings';
import { Layout } from '@/shared/types';
import { AppSelector, type Option } from '@/shared/ui';

defineProps<{
    modelValue: Layout;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: Layout): void;
}>();

const options: Option<Layout>[] = [
    { value: Layout.QWERTY, label: layoutNameMap[Layout.QWERTY] },
    { value: Layout.YCUKEN, label: layoutNameMap[Layout.YCUKEN] },
];

const onChange = (value: string) => {
    emit('update:modelValue', value as Layout);
};
</script>

<template>
    <AppSelector
        @update:modelValue="onChange"
        :modelValue="modelValue"
        :options="options"
    />
</template>
