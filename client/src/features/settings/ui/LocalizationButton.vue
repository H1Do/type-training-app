<script setup lang="ts">
import AppButton from '@/shared/ui/AppButton.vue';
import { localizationNameMap, useSettingsStore } from '../model/settings';
import { AppText } from '@/shared/ui';

const settingsStore = useSettingsStore();
</script>

<template>
    <AppButton @click="settingsStore.toggleLocalization()">
        <AppText :weight="500">{{
            localizationNameMap[settingsStore.localization]
        }}</AppText>
    </AppButton>
</template>

<style scoped lang="scss"></style>
