<script setup lang="ts">
import { useThemeStore } from '@models';
import CButton from './CButton.vue';

const themeStore = useThemeStore();
</script>

<template>
    <CButton @click="themeStore.toggleTheme">Switch theme</CButton>
</template>

<style scoped lang="scss"></style>
