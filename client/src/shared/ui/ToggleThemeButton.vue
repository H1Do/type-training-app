<script setup lang="ts">
import { Theme, useThemeStore } from '@/shared/model/theme';
import AppButton from './AppButton.vue';
import AppIcon from './AppIcon.vue';

const themeStore = useThemeStore();
</script>

<template>
    <AppButton
        @click="themeStore.toggleTheme"
        buttonStyle="clear"
        title="Toggle theme"
    >
        <AppIcon
            name="SunIcon"
            v-if="themeStore.theme === Theme.LIGHT"
            :size="32"
        />
        <AppIcon name="MoonIcon" v-else :size="32" />
    </AppButton>
</template>

<style scoped lang="scss"></style>
