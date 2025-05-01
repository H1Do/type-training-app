<script setup lang="ts">
import { AppText, HFlex, ToggleThemeButton, VFlex } from '@/shared/ui';
import KeyboardLayoutButton from './ui/KeyboardLayoutButton.vue';
import LocalizationButton from './ui/LocalizationButton.vue';
import { Difficulty, Layout } from '@/shared/types';
import DifficultyButton from './ui/DifficultyButton.vue';
</script>

<template>
    <VFlex align="center" gap="8px">
        <HFlex gap="8px" align="stretch">
            <VFlex gap="8px" align="center" justify="between">
                <AppText :weight="600">Theme</AppText>
                <ToggleThemeButton />
            </VFlex>
            <VFlex gap="8px" align="center" justify="between">
                <AppText :weight="600">Localization</AppText>
                <LocalizationButton />
            </VFlex>
        </HFlex>
        <AppText :weight="600">Layout</AppText>
        <HFlex gap="8px" align="center">
            <KeyboardLayoutButton :layout="Layout.QWERTY" />
            <KeyboardLayoutButton :layout="Layout.YCUKEN" />
        </HFlex>

        <AppText :weight="600">Difficulty</AppText>
        <HFlex gap="8px" align="center">
            <DifficultyButton :difficulty="Difficulty.ZONE_HINTS" />
            <DifficultyButton :difficulty="Difficulty.KEY_HINTS" />
            <DifficultyButton :difficulty="Difficulty.FULL_KEYBOARD" />
            <DifficultyButton :difficulty="Difficulty.BLIND" />
        </HFlex>
    </VFlex>
</template>

<style scoped lang="scss"></style>
