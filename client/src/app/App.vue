<script setup lang="ts">
import AppFooter from '@/widgets/AppFooter.vue';
import AppHeader from '@/widgets/AppHeader.vue';
import PageWrapper from '@/widgets/PageWrapper.vue';
import { onMounted, watch } from 'vue';
import { ErrorBoundary, MessageProvider, ModalProvider } from './providers';
import { Theme } from '@/shared/types';
import { useSettingsStore } from '@/features/settings/model/settings';
import { useUserStore } from '@/entities/user';

const settingsStore = useSettingsStore();
const userStore = useUserStore();

watch(
    () => settingsStore.theme,
    (newTheme) => {
        document.body.classList.remove(Theme.LIGHT, Theme.DARK);
        document.body.classList.add(newTheme);
    },
    { immediate: true },
);

onMounted(async () => {
    await userStore.checkAuth();
});
</script>

<template>
    <div class="app">
        <AppHeader />
        <PageWrapper>
            <ErrorBoundary>
                <RouterView />
            </ErrorBoundary>
        </PageWrapper>
        <AppFooter />

        <ModalProvider />
        <MessageProvider />
    </div>
</template>

<style lang="scss">
body {
    background-color: var(--background-color);
}

.app {
    position: relative;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    margin: 0 auto;
}
</style>
