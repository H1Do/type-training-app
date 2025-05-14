<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Layout } from '@/shared/types';
import { isQwertyOnly, isYcukenOnly } from '@/shared/utils';
import { useI18n } from 'vue-i18n';
import {
    AppButton,
    AppInput,
    AppText,
    VFlex,
    HFlex,
    AppModal,
} from '@/shared/ui';
import { LayoutSelector } from '@/widgets';
import type { AdminLesson } from '@/shared/types/admin';

export type LessonEditResult = Partial<AdminLesson> & Omit<AdminLesson, 'id'>;

const props = defineProps<{
    lesson: AdminLesson | null;
}>();

const emit = defineEmits<{
    (e: 'resolve', value: LessonEditResult): void;
    (e: 'resolve'): void;
}>();

const { t } = useI18n();

const title = ref('');
const allowedChars = ref('');
const length = ref(60);
const layout = ref<Layout>(Layout.QWERTY);
const minAccuracy = ref(90);
const cpmFor1 = ref(100);
const cpmFor2 = ref(200);
const cpmFor3 = ref(300);
const error = ref('');

watch(
    () => props.lesson,
    (lesson) => {
        if (lesson) {
            title.value = lesson.title;
            allowedChars.value = lesson.allowedChars;
            length.value = lesson.length;
            layout.value = lesson.layout;
            minAccuracy.value = lesson.minAccuracy;
            cpmFor1.value = lesson.cpmFor1;
            cpmFor2.value = lesson.cpmFor2;
            cpmFor3.value = lesson.cpmFor3;
        } else {
            title.value = '';
            allowedChars.value = '';
            length.value = 60;
            layout.value = Layout.QWERTY;
            minAccuracy.value = 90;
            cpmFor1.value = 100;
            cpmFor2.value = 200;
            cpmFor3.value = 300;
        }
    },
    { immediate: true },
);

const isValid = computed(() => {
    if (!title.value.trim()) return false;
    if (allowedChars.value.trim().length === 0) return false;
    if (length.value < 10 || length.value > 1000) return false;
    if (layout.value === Layout.QWERTY && !isQwertyOnly(allowedChars.value))
        return false;
    if (layout.value === Layout.YCUKEN && !isYcukenOnly(allowedChars.value))
        return false;
    return true;
});

watch([allowedChars, layout, length], () => {
    if (length.value < 10 || length.value > 1000) {
        error.value = t('training.errors.lengthRange');
        return;
    }

    if (layout.value === Layout.QWERTY && !isQwertyOnly(allowedChars.value)) {
        error.value = t('training.errors.layoutQwerty');
        return;
    }

    if (layout.value === Layout.YCUKEN && !isYcukenOnly(allowedChars.value)) {
        error.value = t('training.errors.layoutYcuken');
        return;
    }

    error.value = '';
});

const onCancel = () => emit('resolve');
const onConfirm = () => {
    const data = {
        title: title.value.trim(),
        allowedChars: allowedChars.value.trim(),
        length: length.value,
        layout: layout.value,
        minAccuracy: minAccuracy.value,
        cpmFor1: cpmFor1.value,
        cpmFor2: cpmFor2.value,
        cpmFor3: cpmFor3.value,
        order: props.lesson?.order ?? 0,
    };

    if (props.lesson) {
        emit('resolve', { id: props.lesson.id, ...data });
    } else {
        emit('resolve', data);
    }
};
</script>

<template>
    <AppModal @close="onCancel">
        <VFlex gap="1rem" align="stretch" class="lesson-form">
            <h2 class="lesson-form__title">
                {{
                    props.lesson
                        ? t('admin.buttons.edit')
                        : t('admin.buttons.create')
                }}
            </h2>

            <VFlex>
                <AppText size="0.75rem">{{ t('settings.layout') }}</AppText>
                <LayoutSelector v-model="layout" />
            </VFlex>

            <VFlex>
                <AppText size="0.75rem">{{ t('admin.lessons.title') }}</AppText>
                <AppInput v-model="title" />
            </VFlex>

            <VFlex>
                <AppText size="0.75rem">{{
                    t('admin.lessons.allowedChars')
                }}</AppText>
                <AppInput v-model="allowedChars" />
            </VFlex>

            <VFlex>
                <AppText size="0.75rem">{{
                    t('admin.lessons.length')
                }}</AppText>
                <AppInput
                    v-model.number="length"
                    type="number"
                    :min="10"
                    :max="1000"
                />
            </VFlex>

            <VFlex>
                <AppText size="0.75rem">{{
                    t('admin.lessons.minAccuracy')
                }}</AppText>
                <AppInput v-model.number="minAccuracy" type="number" />
            </VFlex>

            <VFlex>
                <AppText size="0.75rem">{{
                    t('admin.lessons.cpmFor1')
                }}</AppText>
                <AppInput v-model.number="cpmFor1" type="number" />
            </VFlex>

            <VFlex>
                <AppText size="0.75rem">{{
                    t('admin.lessons.cpmFor2')
                }}</AppText>
                <AppInput v-model.number="cpmFor2" type="number" />
            </VFlex>

            <VFlex>
                <AppText size="0.75rem">{{
                    t('admin.lessons.cpmFor3')
                }}</AppText>
                <AppInput v-model.number="cpmFor3" type="number" />
            </VFlex>

            <AppText v-if="error" textStyle="error">{{ error }}</AppText>

            <HFlex justify="end" gap="1rem">
                <AppButton @click="onCancel">
                    {{ t('admin.buttons.cancel') }}
                </AppButton>
                <AppButton :disabled="!isValid" @click="onConfirm">
                    {{ t('admin.buttons.save') }}
                </AppButton>
            </HFlex>
        </VFlex>
    </AppModal>
</template>

<style scoped lang="scss">
.lesson-form {
    width: 30rem;
    padding: 1rem;
}

.lesson-form__title {
    font-size: 1.25rem;
    font-weight: 600;
}
</style>
