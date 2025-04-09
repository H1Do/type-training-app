<script setup lang="ts">
import { useThemeStore } from '@models';

const theme = useThemeStore();
</script>

<template>
    <div :class="['app', theme.theme]">
        <RouterView />
    </div>
</template>
