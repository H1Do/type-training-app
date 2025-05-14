<script setup lang="ts">
import { RoutePaths } from '@/app/router';
import { useUserStore } from '@/entities/user';
import { AppButton, AppIcon, AppLink, HFlex, LogoIcon } from '@/shared/ui';
import { useConfirmDialog, useModalService } from '@/shared/utils';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import LevelBadge from './LevelBadge.vue';
import { ref, watch } from 'vue';

const { t } = useI18n();
const userStore = useUserStore();
const modalService = useModalService();

const { logout } = userStore;
const { isAuthenticated, username, isVerified } = storeToRefs(userStore);

const isBannerVisible = ref(false);
const isEmailSent = ref(false);

watch(
    () => [isVerified, isAuthenticated],
    ([isVerified, isAuthenticated]) => {
        isBannerVisible.value = isAuthenticated && !isVerified;
    },
    { immediate: true },
);

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

const onSend = async () => {
    await userStore.resendVerificationEmail();
    isEmailSent.value = true;

    setTimeout(() => {
        isBannerVisible.value = false;
    }, 3000);
};
</script>

<template>
    <div class="app-header__wrapper">
        <header class="app-header">
            <div class="logo">
                <AppLink :to="RoutePaths.MAIN" class="app-link">
                    <LogoIcon />
                </AppLink>
            </div>
            <nav class="nav">
                <AppLink :to="RoutePaths.MAIN" class="app-link">
                    <AppIcon
                        name="HomeIcon"
                        class="app-link-icon"
                        size="1.25rem"
                    />
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
                    <AppIcon
                        name="Keyboard"
                        class="app-link-icon"
                        size="1.25rem"
                    />
                    <span class="app-link-text">{{
                        t('header.training')
                    }}</span>
                </AppLink>
                <AppLink :to="RoutePaths.SETTINGS" class="app-link">
                    <AppIcon
                        name="Settings"
                        class="app-link-icon"
                        size="1.25rem"
                    />
                    <span class="app-link-text">{{
                        t('header.settings')
                    }}</span>
                </AppLink>
                <AppLink :to="RoutePaths.ADMIN" class="app-link">
                    <AppIcon
                        name="ShieldUser"
                        class="app-link-icon"
                        size="1.25rem"
                    />
                    <span class="app-link-text">{{ t('header.admin') }}</span>
                </AppLink>
            </nav>
            <div class="user-actions">
                <HFlex v-if="isAuthenticated" gap="1rem" align="center">
                    <AppLink :to="RoutePaths.PROFILE" class="app-link">
                        <LevelBadge :level="userStore.level" />
                        <AppIcon
                            name="User"
                            class="app-link-icon"
                            size="1.25rem"
                        />
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
                        <span class="app-link-text">{{
                            t('header.logout')
                        }}</span>
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
        <HFlex
            align="center"
            gap="1rem"
            v-if="isBannerVisible"
            class="email-verification-banner"
        >
            <HFlex align="center" gap="1rem" v-if="!isEmailSent">
                <span>{{ t('auth.emailNotVerified') }}</span>
                <AppButton
                    buttonStyle="clear"
                    class="email-verification-button"
                    @click="onSend"
                    :to="RoutePaths.VERIFY_EMAIL"
                >
                    {{ t('auth.verifyNow') }}
                </AppButton>
            </HFlex>
            <span v-else>
                {{ t('auth.verificationSent') }}
            </span>
            <AppButton buttonStyle="clear" @click="isBannerVisible = false">
                <AppIcon name="X" size="1.25rem" class="close-icon" />
            </AppButton>
        </HFlex>
    </div>
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
    width: $header-width;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--header-background-color);
    color: var(--header-text-color);

    &__wrapper {
        position: relative;
    }
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
    color: var(--header-text-color);
}

.app-link-text {
    font-weight: 500;
}

.email-verification-banner {
    position: absolute;
    left: 50%;
    translate: -50%;
    margin-inline: auto;
    margin-top: 0.5rem;
    background-color: var(--orange-adaptive-color);
    color: $black;
    border-radius: $border-radius-big;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.email-verification-button {
    color: inherit;
    font-weight: 600;
    text-decoration: underline;

    &:hover {
        color: $black;
    }
}

.close-icon {
    color: $black;
    vertical-align: middle;
}
</style>
