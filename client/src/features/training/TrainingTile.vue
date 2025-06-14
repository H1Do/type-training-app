<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { AppButton, AppIcon, AppText, HFlex, VFlex } from '@/shared/ui';
import { useTrainingStore } from './model/training';
import { useI18n } from 'vue-i18n';
import { TrainingMode } from '@/shared/types/training';
import { useModal, useModalService } from '@/shared/utils';
import CustomSettingsModal, {
    type ConfigurationResult,
} from './ui/CustomConfigurationModal.vue';
import { useSettingsStore } from '../settings';
import {
    CharDisplay,
    CurrentStats,
    KeyboardPlate,
    ModeSelector,
    useKeyboardStore,
} from '@/widgets';
import { KEYBOARD_LAYOUTS } from '@/shared/config/keyboardLayouts';

const { t } = useI18n();

const trainingStore = useTrainingStore();
const settingsStore = useSettingsStore();
const keyboardStore = useKeyboardStore();
const modalService = useModalService();

const startTraining = async () => {
    await trainingStore.start();
};

const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        startTraining();
    }
};

const onOpenSettings = async () => {
    const result = await useModal<ConfigurationResult | boolean>(
        modalService,
        CustomSettingsModal,
    );

    if (!result) return;

    const { isWords, layout, length, text } = result as ConfigurationResult;

    settingsStore.setLayout(layout);
    trainingStore.setCustomIsWords(isWords);
    trainingStore.setCustomLength(length);
    trainingStore.setCustomText(text);
    startTraining();
};

onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
    startTraining();
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
});

watch(
    () => trainingStore.mode,
    () => {
        startTraining();
        keyboardStore.reset();
    },
);
</script>

<template>
    <VFlex gap="1rem" align="center">
        <HFlex justify="between" class="settings">
            <ModeSelector
                :modelValue="trainingStore.mode"
                @update:modelValue="trainingStore.setMode"
                :withCustom="true"
            />
            <AppButton
                v-if="trainingStore.mode === TrainingMode.Custom"
                @click="onOpenSettings"
                class="settings-button"
            >
                <AppIcon name="Settings" size="1.25rem" />
                {{ t('training.configuration') }}
            </AppButton>
        </HFlex>
        <CharDisplay
            :sequence="trainingStore.sequence"
            :input="trainingStore.input"
            :currentIndex="trainingStore.currentIndex"
        />
        <CurrentStats
            :startedAt="trainingStore.session?.startedAt ?? null"
            :finishedAt="trainingStore.session?.finishedAt ?? null"
            :input="trainingStore.input"
            :undoCount="trainingStore.undoCount"
            :events="trainingStore.events"
            :isCustomMode="trainingStore.isCustomMode"
            :isCustomSettingsSet="trainingStore.isCustomSettingsSet"
        />
        <KeyboardPlate
            :layout="KEYBOARD_LAYOUTS[settingsStore.layout]"
            :currentSymbol="trainingStore.currentSymbol"
            :difficulty="settingsStore.difficulty"
            :onBackspace="trainingStore.backspace"
            :onProcessKey="trainingStore.processKey"
        />
        <AppText class="restart-message">
            {{ t('training.press') }}
            <AppButton
                @click="startTraining"
                buttonStyle="clear"
                class="clear-button"
            >
                ESC
            </AppButton>
            {{ t('training.toRestart') }}
        </AppText>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.settings {
    width: 100%;
    padding-inline: $training-tile-settings-padding-inline;
}

.settings-button {
    display: flex;
    align-items: center;
    gap: $gap-xs-sm;
}

.clear-button {
    font-weight: 500;
    text-decoration: underline;
    color: var(--secondary-color);
}

.restart-message {
    color: var(--secondary-color);
    display: flex;
    align-items: center;
    gap: 0.25rem;
}
</style>
