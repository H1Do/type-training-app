<script setup lang="ts">
import { RoutePaths } from '@/app/router';
import { useUserStore } from '@/entities/user';
import { AppButton, AppIcon, LogoIcon } from '@/shared/ui';
import AppLink from '@/shared/ui/AppLink.vue';
import HFlex from '@/shared/ui/HFlex.vue';
import { useConfirmDialog, useModalService } from '@/shared/utils';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import LevelBadge from './LevelBadge.vue';

const { t } = useI18n();
const userStore = useUserStore();
const modalService = useModalService();

const { logout } = userStore;
const { isAuthenticated, username } = storeToRefs(userStore);

const onLogout = async () => {
    const acceptStatus = await useConfirmDialog(modalService, {
        title: t('header.logout'),
        message: t('header.logoutConfirm'),
        cancelText: t('header.cancel'),
        confirmText: t('header.logout'),
    });

    if (acceptStatus) {
        logout();
    }
};
</script>

<template>
    <header class="app-header">
        <div class="logo">
            <AppLink :to="RoutePaths.MAIN" class="app-link">
                <LogoIcon />
            </AppLink>
        </div>
        <nav class="nav">
            <AppLink :to="RoutePaths.MAIN" class="app-link">
                <AppIcon name="HomeIcon" class="app-link-icon" size="1.25rem" />
                <span class="app-link-text">{{ t('header.main') }}</span>
            </AppLink>
            <AppLink :to="RoutePaths.STATS" class="app-link">
                <AppIcon
                    name="ChartNoAxesColumn"
                    class="app-link-icon"
                    size="1.25rem"
                />
                <span class="app-link-text">{{ t('header.stats') }}</span>
            </AppLink>
            <AppLink :to="RoutePaths.LESSONS" class="app-link">
                <AppIcon name="Book" class="app-link-icon" size="1.25rem" />
                <span class="app-link-text">{{ t('header.lessons') }}</span>
            </AppLink>
            <AppLink :to="RoutePaths.TRAINING" class="app-link">
                <AppIcon name="Keyboard" class="app-link-icon" size="1.25rem" />
                <span class="app-link-text">{{ t('header.training') }}</span>
            </AppLink>
            <AppLink :to="RoutePaths.SETTINGS" class="app-link">
                <AppIcon name="Settings" class="app-link-icon" size="1.25rem" />
                <span class="app-link-text">{{ t('header.settings') }}</span>
            </AppLink>
        </nav>
        <div class="user-actions">
            <HFlex v-if="isAuthenticated" gap="1rem" align="center">
                <AppLink :to="RoutePaths.PROFILE" class="app-link">
                    <LevelBadge :level="userStore.level" />
                    <AppIcon name="User" class="app-link-icon" size="1.25rem" />
                    <span class="app-link-text">{{ username }}</span>
                </AppLink>
                <AppButton
                    buttonStyle="clear"
                    type="button"
                    class="app-link"
                    @click="onLogout"
                >
                    <AppIcon
                        name="LogOutIcon"
                        class="app-link-icon"
                        size="1.25rem"
                    />
                    <span class="app-link-text">{{ t('header.logout') }}</span>
                </AppButton>
            </HFlex>
            <AppLink v-else :to="RoutePaths.AUTH" class="app-link">
                <AppIcon
                    name="LogInIcon"
                    class="app-link-icon"
                    size="1.25rem"
                />
                <span class="app-link-text">{{
                    t('header.login/register')
                }}</span>
            </AppLink>
        </div>
    </header>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.app-header {
    position: relative;
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

.nav {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: $gap;
}

.nav,
.user-actions {
    display: flex;
    gap: $gap;
}

.app-link {
    display: flex;
    align-items: center;
    gap: $gap-xs;
    color: var(--header-text-color);
    text-decoration: none;
    position: relative;
    overflow: hidden;

    &:hover {
        color: var(--header-text-color);
    }

    span {
        opacity: 0;
        max-width: 0;
        overflow: hidden;
        white-space: nowrap;
        transition: opacity $transition-duration-slow ease,
            max-width $transition-duration-slow ease;
    }

    &:hover span {
        opacity: 1;
        max-width: $header-span-max-width;
    }
}

.app-link-icon {
    flex-shrink: 0;
}

.app-link-text {
    font-weight: 500;
}
</style>
