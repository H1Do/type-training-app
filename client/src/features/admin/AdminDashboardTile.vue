<script setup lang="ts">
import { RoutePaths } from '@/app/router';
import { AppIcon, AppText, HFlex, VFlex } from '@/shared/ui';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import UserRegistrationChart from './ui/UserRegistrationChart.vue';
import { useAdminStore } from './model/admin';
import { useSettingsStore } from '../settings';
import AdminStatsDisplay from './ui/AdminStatsDisplay.vue';

const { t } = useI18n();
const router = useRouter();
const adminStore = useAdminStore();
const settingsStore = useSettingsStore();

const goToUsersList = () => router.push(RoutePaths.ADMIN_USERS);
const goToLessonsList = () => router.push(RoutePaths.ADMIN_LESSONS);
</script>

<template>
    <VFlex align="center" gap="1rem">
        <AppText :weight="600" size="2rem">{{ t('admin.title') }}</AppText>
        <HFlex gap="1rem">
            <VFlex
                class="card"
                @click="goToLessonsList"
                align="center"
                justify="center"
                gap="0.5rem"
            >
                <AppIcon name="Book" size="2rem" />
                <AppText :weight="600">{{ t('admin.cards.lessons') }}</AppText>
            </VFlex>

            <VFlex
                class="card"
                @click="goToUsersList"
                align="center"
                justify="center"
                gap="0.5rem"
            >
                <AppIcon name="User" size="2rem" />
                <AppText :weight="600">{{ t('admin.cards.users') }}</AppText>
            </VFlex>
        </HFlex>
        <HFlex gap="1rem">
            <AdminStatsDisplay :stats="adminStore.stats" />
            <UserRegistrationChart
                :registrationsByDay="adminStore.stats?.registrationsByDay ?? []"
                :theme="settingsStore.theme"
            />
        </HFlex>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.card {
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
    border: var(--primary-color) solid $border-width-big;
    cursor: pointer;
    width: 10rem;
    height: 10rem;
    gap: 0.5rem;
    transition: $transition-duration color,
        $transition-duration background-color;

    &:hover {
        color: var(--background-color);
        background-color: var(--primary-color);
    }
}
</style>
