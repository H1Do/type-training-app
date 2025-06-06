<script setup lang="ts">
import { onMounted, computed, ref, type Ref } from 'vue';
import { useLessonsStore } from '../model/lessons';
import { KeyboardLayoutButton, useSettingsStore } from '@/features/settings';
import {
    AppButton,
    AppHint,
    AppIcon,
    AppLoader,
    AppText,
    HFlex,
    VFlex,
} from '@/shared/ui';
import { useI18n } from 'vue-i18n';
import LessonCard from './LessonCard.vue';
import { Carousel, Slide } from 'vue3-carousel';
import type { LessonProgress } from '@/shared/types/lessons';
import { Layout } from '@/shared/types';
import 'vue3-carousel/dist/carousel.css';

const lessonsStore = useLessonsStore();
const settingsStore = useSettingsStore();
const { t } = useI18n();

const carouselRef = ref(null) as Ref<{
    next: () => void;
    prev: () => void;
    slideTo: (index: number) => void;
} | null>;

onMounted(() => {
    lessonsStore.fetchLessons();
});

const filteredLessons = computed(() =>
    lessonsStore.lessons.filter((l) => l.layout === settingsStore.layout),
);

const groupedLessons = computed<LessonProgress[][]>(() => {
    const groupSize = 3;
    const groups: LessonProgress[][] = [];
    const lessons = filteredLessons.value;
    for (let i = 0; i < lessons.length; i += groupSize) {
        groups.push(lessons.slice(i, i + groupSize));
    }
    return groups;
});

const next = () => {
    carouselRef.value?.next();
};

const prev = () => {
    carouselRef.value?.prev();
};
</script>

<template>
    <VFlex gap="24px">
        <VFlex v-if="lessonsStore.loading">
            <AppLoader />
        </VFlex>

        <VFlex v-else-if="filteredLessons.length === 0">
            {{ t('messages.no_lessons_found') }}
        </VFlex>

        <VFlex v-else align="center" gap="2rem">
            <AppText :weight="500" size="1.75rem" class="title">
                {{ t('lessons.layout') }}
            </AppText>

            <HFlex gap="1rem">
                <KeyboardLayoutButton :layout="Layout.QWERTY" />
                <KeyboardLayoutButton :layout="Layout.YCUKEN" />
            </HFlex>

            <HFlex align="center">
                <AppHint :hint="t('lessons.prevLessons')">
                    <AppButton
                        @click="prev"
                        class="nav-button"
                        buttonStyle="clear"
                    >
                        <AppIcon name="ChevronLeft" />
                    </AppButton>
                </AppHint>
                <AppText :weight="500" size="1.75rem" class="title">
                    {{ t('lessons.title') }}
                </AppText>
                <AppHint :hint="t('lessons.nextLessons')">
                    <AppButton
                        @click="next"
                        class="nav-button"
                        buttonStyle="clear"
                    >
                        <AppIcon name="ChevronRight" />
                    </AppButton>
                </AppHint>
            </HFlex>

            <Carousel
                v-if="groupedLessons.length"
                ref="carouselRef"
                :items-to-show="4"
                :mouse-drag="true"
                :wrap-around="false"
                :key="settingsStore.layout"
                class="lesson-carousel"
            >
                <Slide v-for="(group, index) in groupedLessons" :key="index">
                    <div class="lesson-group">
                        <LessonCard
                            v-for="lesson in group"
                            :key="lesson.id"
                            :lesson="lesson"
                        />
                    </div>
                </Slide>
            </Carousel>
        </VFlex>
    </VFlex>
</template>

<style scoped>
.title {
    color: var(--primary-color);
}

.lesson-carousel {
    width: 100%;
    max-width: 45rem;
    margin: 0 auto;
}

.lesson-group {
    display: grid;
    grid-template-rows: repeat(2, auto);
    gap: 1rem;
}

.nav-button {
    background: var(--background);
    border: none;
    font-size: 2rem;
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
    border-radius: 8px;
}

.nav-button:hover {
    opacity: 1;
}
</style>
