<script setup lang="ts">
import { useSettingsStore } from '@/features/settings/model/settings';
import AppButton from './AppButton.vue';
import AppIcon from './AppIcon.vue';
import { Theme } from '../types';

const settingsStore = useSettingsStore();
</script>

<template>
    <AppButton
        @click="settingsStore.toggleTheme"
        buttonStyle="clear"
        title="Toggle theme"
    >
        <AppIcon
            name="SunIcon"
            v-if="settingsStore.theme === Theme.LIGHT"
            :size="32"
        />
        <AppIcon name="MoonIcon" v-else :size="32" />
    </AppButton>
</template>

<style scoped lang="scss"></style>
