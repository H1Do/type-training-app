<script setup lang="ts">
import type { LessonProgress } from '@/shared/types/lessons';
import { AppHint, AppIcon, AppText, HFlex, VFlex } from '@/shared/ui';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useSettingsStore } from '@/features/settings';
import { Localization } from '@/shared/types';

const props = defineProps<{
    lesson: LessonProgress;
}>();

const router = useRouter();
const settingsStore = useSettingsStore();

const stars = computed(() =>
    Array.from({ length: 3 }, (_, i) => i < props.lesson.stars),
);

const onClick = () => {
    router.push(`/lessons/${props.lesson.id}`);
};

const title = `#${props.lesson.order} - ${
    settingsStore.localization === Localization.EN
        ? props.lesson.title
        : props.lesson.titleRu
}`;
</script>

<template>
    <AppHint :hint="title">
        <VFlex class="lesson-card" @click="onClick" gap="0.5rem" align="center">
            <AppText
                :weight="500"
                size="0.75rem"
                class="lesson-card__title"
                align="center"
                >{{ title }}</AppText
            >

            <HFlex gap="0.25rem">
                <AppIcon
                    name="Star"
                    v-for="(filled, i) in stars"
                    :key="i"
                    :class="['lesson-card__star', { filled }]"
                    size="1.25rem"
                />
            </HFlex>
        </VFlex>
    </AppHint>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.lesson-card {
    background-color: var(--background-color);
    color: var(--primary-color);
    border: $border-width-big solid var(--primary-color);
    border-radius: $border-radius-bigger;
    padding: 0.75rem;
    cursor: pointer;
    transition: background-color $transition-duration,
        color $transition-duration, box-shadow $transition-duration;
    flex-shrink: 0;
    width: 10rem;

    &:hover {
        background-color: var(--primary-color);
        color: var(--background-color);
    }

    &:active {
        background-color: var(--secondary-color);
        color: var(--background-color);
    }
}

.lesson-card__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
}

.lesson-card__star {
    color: var(--star-color);

    &.filled {
        fill: var(--star-fill);
    }
}
</style>
