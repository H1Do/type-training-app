<script setup lang="ts">
import { AppText, HFlex, ToggleThemeButton, VFlex } from '@/shared/ui';
import KeyboardLayoutButton from './ui/KeyboardLayoutButton.vue';
import { Layout } from './model/settings';
import LocalizationButton from './ui/LocalizationButton.vue';
</script>

<template>
    <VFlex align="center" gap="8px">
        <AppText :weight="600">Theme</AppText>
        <ToggleThemeButton />
        <AppText :weight="600">Layout</AppText>
        <HFlex gap="8px" align="center">
            <KeyboardLayoutButton :layout="Layout.QWERTY" />
            <KeyboardLayoutButton :layout="Layout.YCUKEN" />
        </HFlex>
        <AppText :weight="600">Localization</AppText>
        <LocalizationButton />
    </VFlex>
</template>

<style scoped lang="scss"></style>
