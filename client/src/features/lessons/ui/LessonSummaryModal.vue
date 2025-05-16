<script setup lang="ts">
import {
    AppButton,
    AppIcon,
    AppLink,
    AppModal,
    AppText,
    HFlex,
    VFlex,
} from '@/shared/ui';
import { useLessonsStore } from '../model/lessonsStore';
import {
    Localization,
    type LessonsStats,
    type PerItemStat,
    type PerItemStatMetric,
} from '@/shared/types';
import { computed, ref } from 'vue';
import { useSettingsStore } from '@/features/settings';
import { useI18n } from 'vue-i18n';
import { KEYBOARD_LAYOUTS } from '@/shared/config/keyboardLayouts';
import { getColorByMetric, getExpForLevel } from '@/shared/utils';
import {
    FingerMapStats,
    KeyboardMapStats,
    PerItemMetricSelector,
} from '@/widgets';
import { RouteNames, RoutePaths } from '@/app/router';
import { layoutNameMap } from '@/features/settings/model/settings';
import LevelProgress from '@/widgets/LevelProgress.vue';
import type { ExpReward } from '@/shared/types/level';

const { t } = useI18n();

const lessonsStore = useLessonsStore();
const settingsStore = useSettingsStore();

const props = defineProps<{
    stats: LessonsStats;
    stars: 1 | 2 | 3;
    exp: ExpReward | null;
    message: string;
    isLevelUp: boolean;
}>();

const metric = ref<PerItemStatMetric>('averageReaction');

const averageStat: PerItemStat = {
    averageReaction: props.stats.averageReaction,
    errorsCount: props.stats.errorsCount,
    accuracy: props.stats.accuracy,
    count: props.stats.count,
    totalTime: props.stats.totalTime,
};

const resolvedLayout = KEYBOARD_LAYOUTS[props.stats.layout] ?? [];

const stars = computed(() =>
    Array.from({ length: 3 }, (_, i) => i < props.stars),
);

const nextLessonId = computed(() => lessonsStore.currentLesson?.nextLessonId);

const emit = defineEmits<{
    (e: 'resolve', value: boolean): void;
}>();

const onCancel = () => {
    emit('resolve', false);
    lessonsStore.reset();
};
</script>

<template>
    <AppModal @close="onCancel" class="modal">
        <VFlex align="center" gap="1rem">
            <HFlex align="center" gap="1rem">
                <h2 class="modal__title">
                    {{
                        `${t('stats.trainingResult')} (${
                            settingsStore.localization === Localization.EN
                                ? stats.lesson.title
                                : stats.lesson.titleRu
                        })`
                    }}
                </h2>

                <HFlex gap="0.5rem">
                    <AppIcon
                        name="Star"
                        v-for="(filled, i) in stars"
                        :key="i"
                        :class="['star', { filled }]"
                        size="1.75rem"
                    />
                </HFlex>
            </HFlex>

            <LevelProgress
                class="level-progress"
                v-if="exp"
                :exp="exp.current"
                :level="exp.level"
                :earned="exp.earned"
                :required="getExpForLevel(exp.level)"
                :isLevelUp="isLevelUp"
            />

            <AppText v-if="message">
                {{ message }}
            </AppText>

            <HFlex align="start" gap="1rem">
                <VFlex justify="between" class="stats" gap="0.25rem">
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('stats.metrics.lesson')
                        }}</span>
                        <span>{{
                            settingsStore.localization === Localization.EN
                                ? stats.lesson.title
                                : stats.lesson.titleRu
                        }}</span>
                    </VFlex>
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('stats.metrics.layout')
                        }}</span>
                        <span>{{ layoutNameMap[stats.lesson.layout] }}</span>
                    </VFlex>
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('stats.metrics.accuracy')
                        }}</span>
                        <span>{{ stats.accuracy }}%</span>
                    </VFlex>
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('stats.metrics.cpm')
                        }}</span>
                        <span>{{ stats.cpm }}</span>
                    </VFlex>
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('stats.metrics.reaction')
                        }}</span>
                        <span
                            >{{ stats.averageReaction
                            }}{{ t('training.ms') }}</span
                        >
                    </VFlex>
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('stats.metrics.time')
                        }}</span>
                        <span
                            >{{ (stats.totalTime / 1000).toFixed(1)
                            }}{{ t('training.s') }}</span
                        >
                    </VFlex>
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('stats.metrics.errorsCount')
                        }}</span>
                        <span>{{ stats.errorsCount }}</span>
                    </VFlex>
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('stats.metrics.textErrorsCount')
                        }}</span>
                        <span>{{ stats.textErrorsCount }}</span>
                    </VFlex>
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('stats.metrics.corrections')
                        }}</span>
                        <span>{{ stats.corrections }}</span>
                    </VFlex>
                </VFlex>

                <VFlex align="start" gap="1rem">
                    <PerItemMetricSelector v-model="metric" />
                    <KeyboardMapStats
                        :layout="resolvedLayout"
                        :perCharStats="stats.perCharStats"
                        :averageStat="averageStat"
                        :metric="metric"
                        :theme="settingsStore.theme"
                        :getColorByMetric="getColorByMetric"
                    />
                    <FingerMapStats
                        :fingerStats="stats.fingerStats"
                        :averageStat="averageStat"
                        :metric="metric"
                        :theme="settingsStore.theme"
                        :getColorByMetric="getColorByMetric"
                    />
                </VFlex>
            </HFlex>

            <HFlex
                align="end"
                gap="1rem"
                justify="between"
                class="modal__footer"
            >
                <AppLink
                    :to="RoutePaths.LESSONS"
                    @click="emit('resolve', false)"
                    >{{ t('lessons.toLessons') }}</AppLink
                >
                <AppLink
                    :to="{
                        name: RouteNames.LESSON,
                        params: { id: nextLessonId },
                    }"
                    :disabled="!nextLessonId"
                    @click="emit('resolve', false)"
                >
                    {{ t('lessons.nextLesson') }}
                </AppLink>
                <AppButton @click="onCancel" class="next-button">
                    {{ t('training.close') }}
                </AppButton>
            </HFlex>
        </VFlex>
    </AppModal>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.modal {
    padding: $training-summary-padding;

    &__title {
        font-size: $training-summary-title-font-size;
        margin: 0;
    }

    &__footer {
        width: 100%;
    }
}

.stats {
    font-size: $training-summary-stats-font-size;
    border: $border-width solid var(--primary-color);
    padding: $training-summary-stats-padding;
    border-radius: $border-radius;

    &__item {
        &-title {
            font-weight: bold;
            margin-right: $training-summary-stats-title-margin-right;
        }
    }
}

.next-button {
    margin-left: auto;
}

.star {
    color: var(--star-color);

    &.filled {
        fill: var(--star-fill);
    }
}
</style>
