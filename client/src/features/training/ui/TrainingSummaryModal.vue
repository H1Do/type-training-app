<script setup lang="ts">
import { TrainingMode } from '@/shared/types/training';
import {
    AppButton,
    AppLink,
    AppModal,
    AppText,
    HFlex,
    VFlex,
} from '@/shared/ui';
import { useTrainingStore } from '../model/trainingStore';
import { KEYBOARD_LAYOUTS } from '@/shared/config/keyboardLayouts';
import { useI18n } from 'vue-i18n';
import { RouteNames } from '@/app/router';
import {
    layoutNameMap,
    useSettingsStore,
} from '@/features/settings/model/settings';
import { ref } from 'vue';
import { getColorByMetric, getExpForLevel } from '@/shared/utils';
import type {
    PerItemStat,
    PerItemStatMetric,
    TrainingStats,
} from '@/shared/types';
import {
    FingerMapStats,
    KeyboardMapStats,
    PerItemMetricSelector,
} from '@/widgets';
import { useUserStore } from '@/entities/user';
import type { ExpReward } from '@/shared/types/level';
import LevelProgress from '@/widgets/LevelProgress.vue';

const { t } = useI18n();

const trainingStore = useTrainingStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();

const props = defineProps<{
    stats: TrainingStats;
    exp: ExpReward | null;
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

const emit = defineEmits<{
    (e: 'resolve', value: boolean): void;
}>();

const onCancel = () => {
    emit('resolve', false);
    trainingStore.start();
};
</script>

<template>
    <AppModal @close="onCancel" class="modal">
        <VFlex align="center" gap="1rem">
            <h2 class="modal__title">{{ t('stats.trainingResult') }}</h2>

            <LevelProgress
                class="level-progress"
                v-if="exp"
                :exp="exp.current"
                :level="exp.level"
                :earned="exp.earned"
                :required="getExpForLevel(exp.level)"
                :isLevelUp="isLevelUp"
            />

            <AppText v-if="!stats.isRated" textStyle="warning">
                {{ t('stats.notCounted.base') }}
                <span v-if="!userStore.isAuthenticated">
                    {{ t('stats.notCounted.notAuth') }}
                </span>
                <span v-else-if="stats.mode === TrainingMode.Custom">
                    {{ t('stats.notCounted.custom') }}
                </span>
                <span v-else-if="stats.accuracy < 50">
                    {{ t('stats.notCounted.lowAccuracy') }}
                </span>
                <span v-else-if="stats.errorsCount > 20">
                    {{ t('stats.notCounted.tooManyTextErrors') }}
                </span>
            </AppText>

            <AppText
                v-else-if="!stats.isLeaderboardEligible"
                textStyle="warning"
            >
                {{ t('stats.leaderboardDisqualified.base') }}
                <span v-if="stats.accuracy < 90">
                    {{ t('stats.leaderboardDisqualified.lowAccuracy') }}
                </span>
                <span v-else-if="stats.corrections > 20">
                    {{ t('stats.leaderboardDisqualified.tooManyCorrections') }}
                </span>
            </AppText>

            <HFlex align="start" gap="1rem">
                <VFlex justify="between" class="stats" gap="0.25rem">
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('training.labels.mode')
                        }}</span>
                        <span>{{ t('training.modes.' + stats.mode) }}</span>
                    </VFlex>
                    <VFlex class="stats__item" align="start">
                        <span class="stats__item-title">{{
                            t('training.labels.layout')
                        }}</span>
                        <span>{{ layoutNameMap[stats.layout] }}</span>
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
                    :to="RouteNames.STATS"
                    v-if="stats.isRated"
                    @click="emit('resolve', false)"
                    >{{ t('training.toStats') }}</AppLink
                >
                <AppButton @click="onCancel" class="close-button">{{
                    t('training.close')
                }}</AppButton>
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

.close-button {
    margin-left: auto;
}

.level-progress {
    width: 70%;
}
</style>
