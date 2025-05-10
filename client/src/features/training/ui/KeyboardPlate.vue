<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import KeyboardButton from './KeyboardButton.vue';
import { useSettingsStore } from '@/features/settings/model/settings';
import { KEYBOARD_LAYOUTS } from '@/shared/config/keyboardLayouts';
import { useKeyboardStore } from '../model/keyboardStore';
import { useTrainingStore } from '../model/trainingStore';
import { Difficulty, type KeyCode } from '@/shared/types';
import AppText from '@/shared/ui/AppText.vue';
import ShiftButton from './ShiftButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const settingsStore = useSettingsStore();
const keyboardStore = useKeyboardStore();
const trainingStore = useTrainingStore();

const layout = computed(() => KEYBOARD_LAYOUTS[settingsStore.layout]);
const isBlurred = computed(
    () => settingsStore.difficulty === Difficulty.Expert,
);

onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
});

watch(
    layout,
    (newLayout) => {
        keyboardStore.buildKeyMaps(newLayout);
    },
    { immediate: true },
);

watch(
    () => trainingStore.currentSymbol,
    (symbol: string | null) => {
        if (!symbol) return;
        const key = keyboardStore.getKeyBySymbol(symbol);
        if (key) {
            keyboardStore.setHintedKey(key.code);
            keyboardStore.setIsShiftRequired(
                key.upper === symbol && key.code !== 'Space',
            );
        }
    },
    { immediate: true },
);

function onKeyDown(e: KeyboardEvent) {
    if (e.code === 'Backspace') {
        trainingStore.backspace();
        keyboardStore.onKeyDown(e.code as KeyCode);
        return;
    }
    keyboardStore.onKeyDown(e.code as KeyCode);

    const symbol = keyboardStore.getSymbolByCode(e.code);
    const finger = keyboardStore.getFingerByCode(e.code);

    if (symbol) {
        trainingStore.processKey(symbol, finger);
    }
}

function onKeyUp(e: KeyboardEvent) {
    keyboardStore.onKeyUp(e.code as KeyCode);
}
</script>

<template>
    <div class="keyboard-plate__wrapper">
        <div
            class="keyboard-plate"
            :class="{ 'keyboard-plate--blurred': isBlurred }"
        >
            <div
                v-for="(row, rowIndex) in layout"
                :key="rowIndex"
                class="keyboard-row"
                :class="`keyboard-row--${rowIndex}`"
            >
                <ShiftButton v-if="rowIndex === 3" />
                <KeyboardButton
                    v-for="key in row"
                    :key="key.code"
                    :keyData="key"
                />
            </div>
        </div>
        <AppText
            v-if="isBlurred"
            class="keyboard-plate__hint"
            :weight="600"
            align="center"
        >
            {{ t('training.keyboardBlurredHint') }}
        </AppText>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.keyboard-plate {
    display: flex;
    flex-direction: column;
    gap: $gap-xs-sm;
    padding: $plate-padding;
    user-select: none;

    &--blurred {
        filter: blur($keyboard-blur-size);
    }

    &__wrapper {
        position: relative;
    }

    &__hint {
        position: absolute;
        max-width: $plate-hint-max-width;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -75%);
    }
}

.keyboard-row {
    display: flex;
    gap: $gap-xs;
    justify-content: center;

    &--0 {
        margin-left: $keyboard-row-offset-0;
    }

    &--1 {
        margin-left: $keyboard-row-offset-1;
    }

    &--2 {
        margin-left: $keyboard-row-offset-2;
    }

    &--3 {
        margin-left: $keyboard-row-offset-3;
    }

    &--4 {
        margin-left: $keyboard-row-offset-4;
    }
}
</style>
