<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import KeyboardPlate from './ui/KeyboardPlate.vue';
import TrainingDisplay from './ui/TrainingDisplay.vue';
import { AppButton, AppIcon, AppText, HFlex, VFlex } from '@/shared/ui';
import TrainingStats from './ui/TrainingStats.vue';
import { useTrainingStore } from './model/trainingStore';
import { useI18n } from 'vue-i18n';
import { TrainingMode } from '@/shared/types/training';
import { useModal, useModalService } from '@/shared/utils';
import CustomSettingsModal, {
    type ConfigurationResult,
} from './ui/CustomConfigurationModal.vue';
import { useSettingsStore } from '../settings';
import { useKeyboardStore } from './model/keyboardStore';
import { ModeSelector } from '@/widgets';

const { t } = useI18n();

const trainingStore = useTrainingStore();
const settingsStore = useSettingsStore();
const keyboardStore = useKeyboardStore();
const modalService = useModalService();

const prepareTraining = async () => {
    await trainingStore.prepare();
};

const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        prepareTraining();
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
    prepareTraining();
};

onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
    prepareTraining();
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
});

watch(
    () => trainingStore.mode,
    () => {
        prepareTraining();
        keyboardStore.reset();
    },
);
</script>

<template>
    <VFlex gap="16px" align="center">
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
                <AppIcon name="Settings" :size="20" />
                {{ t('training.configuration') }}
            </AppButton>
        </HFlex>
        <TrainingDisplay />
        <TrainingStats />
        <KeyboardPlate />
        <AppText class="restart-message">
            {{ t('training.press') }}
            <AppButton
                @click="prepareTraining"
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
.settings {
    width: 100%;
    padding-inline: 16px;
}

.settings-button {
    display: flex;
    align-items: center;
    gap: 6px;
}

.clear-button {
    font-weight: 500;
    text-decoration: underline;
    color: var(--secondary-color);
}

.restart-message {
    color: var(--secondary-color);
}
</style>
