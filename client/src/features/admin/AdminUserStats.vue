<script setup lang="ts">
import { RoutePaths } from '@/app/router';
import { Layout, TrainingMode, type StatsPeriod } from '@/shared/types';
import { AppButton, AppText, HFlex, VFlex } from '@/shared/ui';
import { getColorByMetric } from '@/shared/utils';
import StatsDashboard from '@/widgets/StatsDashboard.vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useSettingsStore } from '../settings';
import { useAdminStore } from './model/adminStore';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const adminStore = useAdminStore();
const settingsStore = useSettingsStore();

const userId = route.params.userId as string;

const period = ref<StatsPeriod>('all');
const mode = ref<TrainingMode>(TrainingMode['100PopularWords']);
const layout = ref<Layout>(Layout.QWERTY);

const goBack = () => router.push(RoutePaths.ADMIN_USERS);

const setMode = (newMode: TrainingMode) => {
    mode.value = newMode;
};

const setLayout = (newLayout: Layout) => {
    layout.value = newLayout;
};

const setPeriod = (newPeriod: StatsPeriod) => {
    period.value = newPeriod;
};

watch(
    () => [mode.value, layout.value, period.value],
    () => {
        adminStore.viewUserStats(
            userId,
            mode.value,
            layout.value,
            period.value,
        );
    },
    { immediate: true },
);
</script>

<template>
    <VFlex gap="1rem">
        <HFlex align="center" gap="1rem">
            <AppText size="2rem" :weight="600">{{
                `${t('admin.selectedUserStats')}: ${userId}`
            }}</AppText>
            <AppButton @click="goBack">{{ t('admin.goBack') }}</AppButton>
        </HFlex>
        <StatsDashboard
            :stats="adminStore.selectedUserStats"
            :username="t('admin.selectedUser')"
            :layout="layout"
            :mode="mode"
            :period="period"
            :setLayout="setLayout"
            :setMode="setMode"
            :setPeriod="setPeriod"
            :isLoading="adminStore.isLoading"
            :getColorByMetric="getColorByMetric"
            :theme="settingsStore.theme"
        />
    </VFlex>
</template>

<style scoped lang="scss"></style>
