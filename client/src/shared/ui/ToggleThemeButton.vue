<script setup lang="ts">
import { useThemeStore } from '@/shared/model/theme';
import AppButton from './AppButton.vue';

const themeStore = useThemeStore();
</script>

<template>
    <AppButton @click="themeStore.toggleTheme">Switch theme</AppButton>
</template>

<style scoped lang="scss"></style>
