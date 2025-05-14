<script setup lang="ts">
import type { AdminLesson, Lesson } from '@/shared/types';
import { Layout } from '@/shared/types';
import {
    AppButton,
    AppHint,
    AppIcon,
    AppLoader,
    AppText,
    HFlex,
    VFlex,
} from '@/shared/ui';
import { useConfirmDialog, useModal, useModalService } from '@/shared/utils';
import { LayoutSelector } from '@/widgets';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import { useAdminStore } from './model/adminStore';
import AdminLessonCard from './ui/AdminLessonCard.vue';
import LessonEditModal, {
    type LessonEditResult,
} from './ui/LessonEditModal.vue';

const { t } = useI18n();

const adminStore = useAdminStore();
const modalService = useModalService();

const selectedLayout = ref<Layout>(Layout.QWERTY);

const carouselRef = ref(null) as Ref<{
    next: () => void;
    prev: () => void;
    slideTo: (index: number) => void;
} | null>;

onMounted(() => {
    adminStore.fetchLessons();
});

const filteredLessons = computed(() =>
    adminStore.lessons.filter((l) => l.layout === selectedLayout.value),
);

const groupedLessons = computed(() => {
    const groupSize = 3;
    const groups: AdminLesson[][] = [];
    const lessons = filteredLessons.value;
    for (let i = 0; i < lessons.length; i += groupSize) {
        groups.push(lessons.slice(i, i + groupSize));
    }
    return groups;
});

const openEdit = async (lesson: Lesson) => {
    const result = await useModal<LessonEditResult>(
        modalService,
        LessonEditModal,
        {
            lesson,
        },
    );

    if (result && 'id' in result && result.id) {
        const { id, ...rest } = result;
        adminStore.updateLesson(id, rest);
    }
};

const openCreate = async () => {
    const result = await useModal<LessonEditResult>(
        modalService,
        LessonEditModal,
        {
            lesson: null,
        },
    );

    if (result) {
        adminStore.createLesson(result);
    }
};

const deleteLesson = async (id: string) => {
    if (
        await useConfirmDialog(modalService, {
            cancelText: t('admin.buttons.cancel'),
            confirmText: t('admin.buttons.delete'),
            title: t('admin.confirmDelete'),
            message: t('admin.confirmDeleteMessage'),
        })
    ) {
        adminStore.deleteLesson(id);
    }
};

const next = () => carouselRef.value?.next();
const prev = () => carouselRef.value?.prev();
</script>

<template>
    <VFlex gap="1.5rem" align="center">
        <HFlex justify="between" align="center" class="full-width">
            <AppText size="1.5rem" :weight="600">
                {{ t('admin.cards.lessons') }}
            </AppText>
            <AppButton @click="openCreate">
                <AppIcon name="Plus" />
                {{ t('admin.buttons.create') }}
            </AppButton>
        </HFlex>

        <LayoutSelector v-model="selectedLayout" />

        <AppLoader v-if="adminStore.isLoading" />

        <VFlex v-else-if="filteredLessons.length === 0">
            {{ t('ui.noData') }}
        </VFlex>

        <VFlex v-else align="center" gap="2rem">
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
                :items-to-show="3"
                :mouse-drag="true"
                :wrap-around="false"
                :key="selectedLayout"
                class="lesson-carousel"
            >
                <Slide v-for="(group, index) in groupedLessons" :key="index">
                    <div class="lesson-group">
                        <AdminLessonCard
                            v-for="lesson in group"
                            :key="lesson.id"
                            :lesson="lesson"
                            @edit="openEdit"
                            @delete="deleteLesson"
                        />
                    </div>
                </Slide>
            </Carousel>
        </VFlex>
    </VFlex>
</template>

<style scoped lang="scss">
.title {
    color: var(--primary-color);
}

.full-width {
    width: 48rem;
}

.lesson-carousel {
    width: 48rem;
    margin: 0 auto;
}

.lesson-group {
    display: grid;
    grid-template-rows: repeat(3, auto);
    gap: 1rem;
}

.lesson-item {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
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

    &:hover {
        opacity: 1;
    }
}
</style>
