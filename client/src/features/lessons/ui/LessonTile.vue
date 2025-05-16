<script setup lang="ts">
import { useLessonsStore } from '../model/lessonsStore';
import { computed, onMounted, onUnmounted } from 'vue';
import { AppButton, AppText, HFlex, VFlex } from '@/shared/ui';
import { CharDisplay, CurrentStats, KeyboardPlate } from '@/widgets';
import { KEYBOARD_LAYOUTS } from '@/shared/config/keyboardLayouts';
import { useSettingsStore } from '@/features/settings';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { RouteNames } from '@/app/router';
import { Localization } from '@/shared/types';

const { t } = useI18n();
const router = useRouter();

const lessonsStore = useLessonsStore();
const settingsStore = useSettingsStore();

const lesson = computed(() => lessonsStore.currentLesson);

const prevLessonId = computed(() => lesson.value?.prevLessonId);
const nextLessonId = computed(() => lesson.value?.nextLessonId);

const goTo = (id: string | undefined) => {
    if (!id) return;
    router.push({ name: RouteNames.LESSON, params: { id } });
};

const onResetLesson = () => {
    lessonsStore.fetchLesson();
};

const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        onResetLesson();
    }
};

onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
    <VFlex v-if="lesson" gap="1rem" align="center">
        <AppText size="1.5rem" :weight="500">{{
            settingsStore.localization === Localization.EN
                ? lesson.title
                : lesson.titleRu
        }}</AppText>
        <HFlex justify="between" class="buttons">
            <AppButton :disabled="!prevLessonId" @click="goTo(prevLessonId)">
                {{ t('lessons.prevLesson') }}
            </AppButton>
            <AppButton :disabled="!nextLessonId" @click="goTo(nextLessonId)">
                {{ t('lessons.nextLesson') }}
            </AppButton>
        </HFlex>
        <CharDisplay
            :sequence="lesson.sequence"
            :input="lessonsStore.input"
            :currentIndex="lessonsStore.currentIndex"
        />
        <CurrentStats
            :startedAt="lessonsStore.startedAt"
            :finishedAt="lessonsStore.finishedAt"
            :input="lessonsStore.input"
            :undoCount="lessonsStore.undoCount"
            :events="lessonsStore.events"
        />
        <KeyboardPlate
            :layout="KEYBOARD_LAYOUTS[lesson.layout]"
            :currentSymbol="lessonsStore.currentSymbol"
            :difficulty="settingsStore.difficulty"
            :onBackspace="lessonsStore.backspace"
            :onProcessKey="lessonsStore.processKey"
        />

        <AppText class="restart-message">
            {{ t('lessons.press') }}
            <AppButton
                @click="onResetLesson"
                buttonStyle="clear"
                class="clear-button"
            >
                ESC
            </AppButton>
            {{ t('lessons.toRestart') }}
        </AppText>
    </VFlex>
</template>

<style scoped>
.buttons {
    width: 100%;
    padding-inline: 1rem;
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
