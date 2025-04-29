<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import KeyboardButton from './KeyboardButton.vue';
import { useSettingsStore } from '@/features/settings/model/settings';
import {
    KEYBOARD_LAYOUTS,
    type KeyboardKey,
} from '@/shared/config/keyboardLayouts';
import { useKeyboardStore } from '../model/keyboardStore';
import { useTrainingStore } from '../model/trainingStore';

const settings = useSettingsStore();
const layout = computed(() => KEYBOARD_LAYOUTS[settings.layout]);
const keyboardStore = useKeyboardStore();
const trainingStore = useTrainingStore();

onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
});

function findSymbolByCode(code: string): string | null {
    for (const row of layout.value) {
        for (const key of row) {
            if (key.code === code) {
                return keyboardStore.isShiftPressed ? key.upper : key.lower;
            }
        }
    }
    return null;
}

function findKeyBySymbol(symbol: string): KeyboardKey | null {
    for (const row of layout.value) {
        for (const key of row) {
            if (key.lower === symbol || key.upper === symbol) {
                return key;
            }
        }
    }
    return null;
}

watch(
    () => trainingStore.currentSymbol,
    (symbol) => {
        const key = findKeyBySymbol(symbol);
        if (key) {
            keyboardStore.setHintedKey(key.code);
        }
    },
    { immediate: true },
);

function onKeyDown(e: KeyboardEvent) {
    if (e.code === 'Backspace') {
        trainingStore.backspace();
        return;
    }
    console.log(e.code);
    keyboardStore.handleKeyDown(e.code);

    const symbol = findSymbolByCode(e.code);
    if (symbol) {
        trainingStore.processKey(symbol);
    }
}

function onKeyUp(e: KeyboardEvent) {
    keyboardStore.handleKeyUp(e.code);
}
</script>

<template>
    <div class="keyboard-plate">
        <div
            v-for="(row, rowIndex) in layout"
            :key="rowIndex"
            class="keyboard-row"
        >
            <KeyboardButton v-for="key in row" :key="key.code" :keyData="key" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.keyboard-plate {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px;
}

.keyboard-row {
    display: flex;
    gap: 4px;
    justify-content: center;
}
</style>
