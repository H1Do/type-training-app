<script setup lang="ts">
import { useThemeStore } from './store/theme';

const theme = useThemeStore();
</script>

<template>
    <div :class="['app', theme.theme]">
        <RouterView />
    </div>
</template>

<style lang="scss"></style>
