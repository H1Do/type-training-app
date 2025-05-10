<script setup lang="ts">
import { defineProps, type Component } from 'vue';
import * as Icons from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        name?: string;
        size?: string;
        color?: string;
        strokeWidth?: string;
    }>(),
    {
        size: '1.5rem',
        color: '#000',
        strokeWidth: '2px',
    },
);

type IconComponents = {
    [key: string]: Component;
};

const iconComponents = Icons as unknown as IconComponents;
</script>

<template>
    <component
        v-if="props.name"
        :is="iconComponents[props.name]"
        :size="props.size"
        :color="props.color"
        :stroke-width="props.strokeWidth"
    />
    <slot v-else />
</template>
