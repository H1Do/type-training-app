<script setup lang="ts">
import { useSettingsStore } from '@/features/settings';
import { Layout } from '@/shared/types';
import {
    AppButton,
    AppIcon,
    AppInput,
    AppModal,
    AppSelector,
    AppText,
    AppTextarea,
    HFlex,
    VFlex,
    type Option,
} from '@/shared/ui';
import { isQwertyOnly, isYcukenOnly } from '@/shared/utils';
import { LayoutSelector } from '@/widgets';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export interface ConfigurationResult {
    length: number;
    layout: Layout;
    text: string;
    isWords: boolean;
}

type CustomMode = 'words' | 'symbols';

const emit = defineEmits<{
    (e: 'resolve', value: boolean | ConfigurationResult): void;
}>();

const { t } = useI18n();
const settingsStore = useSettingsStore();

const text = ref<string>('');
const selectedMode = ref<CustomMode>('words');
const selectedLength = ref(50);
const selectedLayout = ref<Layout>(settingsStore.layout);
const error = ref<string>('');

const modeOptions: Option<CustomMode>[] = [
    { value: 'words', label: t('training.words') },
    { value: 'symbols', label: t('training.modes.symbols') },
];

const isCorrect = computed(() => {
    if (!text.value.length) return false;
    if (selectedLength.value < 10 || selectedLength.value > 1000) return false;
    if (selectedLayout.value === Layout.QWERTY && !isQwertyOnly(text.value))
        return false;
    if (selectedLayout.value === Layout.YCUKEN && !isYcukenOnly(text.value))
        return false;
    if (
        selectedMode.value === 'symbols' &&
        !text.value
            .trim()
            .split(' ')
            .every((it) => it.length === 1)
    )
        return false;

    return true;
});

watch([selectedMode, selectedLayout, selectedLength, text], () => {
    if (selectedLength.value < 10 || selectedLength.value > 1000) {
        error.value = t('training.errors.lengthRange');
        return;
    }

    if (selectedLayout.value === Layout.QWERTY && !isQwertyOnly(text.value)) {
        error.value = t('training.errors.layoutQwerty');
        return;
    }

    if (selectedLayout.value === Layout.YCUKEN && !isYcukenOnly(text.value)) {
        error.value = t('training.errors.layoutYcuken');
        return;
    }

    if (
        selectedMode.value === 'symbols' &&
        text.value.trim().length > 0 &&
        !text.value
            .trim()
            .split(' ')
            .every((it) => it.length === 1)
    ) {
        error.value = t('training.errors.symbolSpacing');
        return;
    }

    error.value = '';
});

const onCancel = () => emit('resolve', false);
const onConfirm = () =>
    emit('resolve', {
        text: text.value.trim().replace(/\s+/g, ' '),
        length: selectedLength.value,
        layout: selectedLayout.value,
        isWords: selectedMode.value === 'words',
    });
</script>

<template>
    <AppModal @close="onCancel">
        <VFlex gap="8px" align="center">
            <AppText :weight="600">
                {{ t('training.customConfiguration') }}
            </AppText>
            <HFlex gap="16px" justify="center" align="center" class="settings">
                <VFlex align="center">
                    <AppText size="12px">{{
                        t('training.labels.mode')
                    }}</AppText>
                    <AppSelector
                        v-model="selectedMode"
                        :options="modeOptions"
                    />
                </VFlex>
                <VFlex align="center">
                    <AppText size="12px">{{
                        t('training.labels.length')
                    }}</AppText>
                    <AppInput
                        v-model="selectedLength"
                        type="number"
                        :min="10"
                        :max="1000"
                    />
                </VFlex>
                <VFlex align="center">
                    <AppText size="12px">{{ t('settings.layout') }}</AppText>
                    <LayoutSelector v-model="selectedLayout" />
                </VFlex>
            </HFlex>
            <AppTextarea
                v-model="text"
                :placeholder="t('training.placeholder.customInput')"
            />
            <AppText textStyle="error" v-if="error">{{ error }}</AppText>
            <AppButton
                @click="onConfirm"
                :disabled="!isCorrect"
                class="confirm-button"
            >
                <AppIcon name="Save" :size="18" /> {{ t('training.save') }}
            </AppButton>
        </VFlex>
    </AppModal>
</template>

<style scoped lang="scss">
.settings {
    width: 100%;
}

.confirm-button {
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>
