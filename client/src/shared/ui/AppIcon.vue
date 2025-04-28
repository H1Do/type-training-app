<script setup lang="ts">
import { defineProps, type Component } from 'vue';
import * as Icons from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        name: string;
        size?: number;
        color?: string;
        strokeWidth?: number;
    }>(),
    {
        size: 24,
        color: '#000',
        strokeWidth: 2,
    },
);

type IconComponents = {
    [key: string]: Component;
};

const iconComponents = Icons as unknown as IconComponents;
</script>

<template>
    <component
        :is="iconComponents[props.name]"
        :size="props.size"
        :color="props.color"
        :stroke-width="props.strokeWidth"
    />
</template>
