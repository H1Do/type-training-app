<script setup lang="ts">
import { RouteNames } from '@/app/router/router';
import { useUserStore } from '@/entities/user';
import AppLink from '@/shared/ui/AppLink.vue';
import HFlex from '@/shared/ui/HFlex.vue';
import { useConfirmDialog, useModalService } from '@/shared/utils';
import {
    HomeIcon,
    Keyboard,
    LogInIcon,
    LogOutIcon,
    Settings,
    User,
} from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const userStore = useUserStore();
const modalService = useModalService();

const { logout } = userStore;
const { isAuthenticated, username } = storeToRefs(userStore);

const onLogout = async () => {
    const acceptStatus = await useConfirmDialog(modalService, {
        title: t('header.logout'),
        message: t('header.logoutConfirm'),
    });

    if (acceptStatus) {
        logout();
    }
};
</script>

<template>
    <header class="app-header">
        <div class="logo">
            <AppLink :to="RouteNames.MAIN" class="app-link">
                Type Training App
            </AppLink>
        </div>
        <nav class="nav">
            <AppLink :to="RouteNames.MAIN" class="app-link">
                <HomeIcon class="app-link-icon" /> {{ t('header.main') }}
            </AppLink>
            <AppLink :to="RouteNames.TRAINING" class="app-link">
                <Keyboard class="app-link-icon" /> {{ t('header.training') }}
            </AppLink>
            <AppLink :to="RouteNames.SETTINGS" class="app-link">
                <Settings class="app-link-icon" /> {{ t('header.settings') }}
            </AppLink>
        </nav>
        <div class="user-actions">
            <HFlex v-if="isAuthenticated" gap="16px" align="center">
                <AppLink :to="RouteNames.PROFILE" class="app-link">
                    <User class="app-link-icon" />
                    {{ username }}
                </AppLink>
                <AppLink type="button" class="app-link" @click="onLogout">
                    <LogOutIcon class="app-link-icon" />
                </AppLink>
            </HFlex>
            <AppLink v-else :to="RouteNames.AUTH" class="app-link">
                <LogInIcon class="app-link-icon" />
                {{ t('header.login/register') }}
            </AppLink>
        </div>
    </header>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.app-header {
    width: 60%;
    margin-inline: auto;
    border-radius: $header-border-radius;
    height: $header-height;
    padding-inline: $header-padding;
    font-size: $header-font-size;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--header-background-color);
    color: var(--header-text-color);
}

.nav,
.user-actions {
    display: flex;
    gap: 16px;
}

.app-link {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--header-text-color);
    text-decoration: none;
}

.app-link-icon {
    height: 20px;
    width: 20px;
}
</style>
