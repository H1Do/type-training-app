<script setup lang="ts">
import { layoutNameMap } from '@/features/settings/model/settings';
import type { AdminLesson } from '@/shared/types';
import {
    AppButton,
    AppHint,
    AppIcon,
    AppText,
    HFlex,
    VFlex,
} from '@/shared/ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    lesson: AdminLesson;
}>();

const emit = defineEmits<{
    (e: 'edit', lesson: AdminLesson): void;
    (e: 'delete', id: string): void;
}>();

const title = `#${props.lesson.order} - ${props.lesson.title}`;
</script>

<template>
    <AppHint :hint="title">
        <VFlex class="lesson-card" gap="0.5rem" align="center">
            <AppText
                :weight="500"
                size="0.75rem"
                class="lesson-card__title"
                align="center"
            >
                {{ title }}
            </AppText>

            <AppText tone="secondary" size="xs" align="center">
                {{ layoutNameMap[lesson.layout] }} · {{ lesson.length }}
                {{ t('admin.chars') }}
            </AppText>

            <HFlex gap="0.5rem">
                <AppButton tone="primary" @click="emit('edit', lesson)">
                    <AppIcon name="Edit" size="1rem" />
                </AppButton>
                <AppButton
                    tone="destructive"
                    @click="emit('delete', lesson.id)"
                >
                    <AppIcon name="Trash" size="1rem" />
                </AppButton>
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
    cursor: default;
    transition: background-color $transition-duration,
        color $transition-duration, box-shadow $transition-duration;
    flex-shrink: 0;
    width: 10rem;
    text-align: center;
}

.lesson-card__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
}
</style>
