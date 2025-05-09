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
import { layoutNameMap } from '@/features/settings/model/settings';
import { FingerStats, KeyboardStats } from '@/features/stats';
import { ref } from 'vue';
import { getColorByMetric } from '@/shared/utils';
import type {
    PerItemStat,
    PerItemStatMetric,
    TrainingStats,
} from '@/shared/types';
import { PerItemMetricSelector } from '@/widgets';

const { t } = useI18n();
const trainingStore = useTrainingStore();

const props = defineProps<{ stats: TrainingStats }>();

const metric = ref<PerItemStatMetric>('averageReaction');

const averageStat: PerItemStat = {
    averageReaction: props.stats.averageReaction,
    errorsCount: props.stats.errorsCount,
    accuracy: props.stats.accuracy,
    count: props.stats.count,
    totalTime: props.stats.totalTime,
};

const emit = defineEmits<{
    (e: 'resolve', value: boolean): void;
}>();

const onCancel = () => {
    emit('resolve', false);
    trainingStore.prepare();
};

const resolvedLayout = KEYBOARD_LAYOUTS[props.stats.layout] ?? [];
</script>

<template>
    <AppModal @close="onCancel" class="modal">
        <VFlex align="center" gap="16px">
            <h2 class="modal__title">{{ t('stats.trainingResult') }}</h2>

            <AppText v-if="!stats.isRated" textStyle="warning">
                {{ t('stats.notCounted.base') }}
                <span v-if="stats.mode === TrainingMode.Custom">
                    {{ t('stats.notCounted.custom') }}
                </span>
                <span v-else-if="stats.accuracy < 80">
                    {{ t('stats.notCounted.lowAccuracy') }}
                </span>
                <span v-else-if="stats.corrections > 10">
                    {{ t('stats.notCounted.tooManyCorrections') }}
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
            </AppText>

            <HFlex align="start" gap="16px">
                <VFlex justify="between" class="stats" gap="4px">
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
                            t('stats.metrics.corrections')
                        }}</span>
                        <span>{{ stats.corrections }}</span>
                    </VFlex>
                </VFlex>

                <VFlex align="start" gap="16px">
                    <PerItemMetricSelector v-model="metric" />
                    <KeyboardStats
                        :layout="resolvedLayout"
                        :perCharStats="stats.perCharStats"
                        :averageStat="averageStat"
                        :metric="metric"
                        :getColorByMetric="getColorByMetric"
                    />
                    <FingerStats
                        :fingerStats="stats.fingerStats"
                        :averageStat="averageStat"
                        :metric="metric"
                        :getColorByMetric="getColorByMetric"
                    />
                </VFlex>
            </HFlex>

            <HFlex
                align="end"
                gap="16px"
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
    padding: 1rem;

    &__title {
        font-size: 1.5rem;
        margin: 0;
    }

    &__footer {
        width: 100%;
    }
}

.stats {
    font-size: 0.8rem;
    border: $border-width solid var(--primary-color);
    padding: 4px 8px;
    border-radius: $border-radius;

    &__item {
        &-title {
            font-weight: bold;
            margin-right: 4px;
        }
    }
}

.close-button {
    margin-left: auto;
}
</style>
