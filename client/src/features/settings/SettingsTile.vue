<script setup lang="ts">
import { AppText, HFlex, ToggleThemeButton, VFlex } from '@/shared/ui';
import KeyboardLayoutButton from './ui/KeyboardLayoutButton.vue';
import LocalizationButton from './ui/LocalizationButton.vue';
import { Difficulty, Layout } from '@/shared/types';
import DifficultyButton from './ui/DifficultyButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <VFlex align="center" gap="8px">
        <HFlex gap="8px" align="stretch">
            <VFlex gap="8px" align="center" justify="between">
                <AppText :weight="600">{{ t('settings.theme') }}</AppText>
                <ToggleThemeButton />
            </VFlex>
            <VFlex gap="8px" align="center" justify="between">
                <AppText :weight="600">{{
                    t('settings.localization')
                }}</AppText>
                <LocalizationButton />
            </VFlex>
        </HFlex>
        <AppText :weight="600">{{ t('settings.layout') }}</AppText>
        <HFlex gap="8px" align="center">
            <KeyboardLayoutButton :layout="Layout.QWERTY" />
            <KeyboardLayoutButton :layout="Layout.YCUKEN" />
        </HFlex>

        <AppText :weight="600">{{ t('settings.difficulty') }}</AppText>
        <HFlex gap="8px" align="center">
            <DifficultyButton :difficulty="Difficulty.Easy" />
            <DifficultyButton :difficulty="Difficulty.Medium" />
            <DifficultyButton :difficulty="Difficulty.Hard" />
            <DifficultyButton :difficulty="Difficulty.Expert" />
        </HFlex>
    </VFlex>
</template>

<style scoped lang="scss"></style>
