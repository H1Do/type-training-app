<script setup lang="ts">
import { useSettingsStore } from '@/features/settings/model/settings';
import AppButton from './AppButton.vue';
import AppIcon from './AppIcon.vue';
import { Theme } from '../types';
import AppHint from './AppHint.vue';
import { useI18n } from 'vue-i18n';

const settingsStore = useSettingsStore();
const { t } = useI18n();
</script>

<template>
    <AppHint :hint="t('settings.toggleTheme')">
        <AppButton @click="settingsStore.toggleTheme" buttonStyle="clear">
            <AppIcon
                name="SunIcon"
                v-if="settingsStore.theme === Theme.LIGHT"
                size="2rem"
            />
            <AppIcon name="MoonIcon" v-else size="2rem" />
        </AppButton>
    </AppHint>
</template>

<style scoped lang="scss"></style>
