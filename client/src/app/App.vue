<script setup lang="ts">
import { Theme, useThemeStore } from '@/shared/model/theme';
import AppFooter from '@/widgets/AppFooter.vue';
import AppHeader from '@/widgets/AppHeader.vue';
import PageWrapper from '@/widgets/PageWrapper.vue';
import { watch } from 'vue';
import { MessageProvider, ModalProvider } from './providers';

const theme = useThemeStore();

watch(
    () => theme.theme,
    (newTheme) => {
        document.body.classList.remove(Theme.LIGHT, Theme.DARK);
        document.body.classList.add(newTheme);
    },
    { immediate: true },
);
</script>

<template>
    <div class="app">
        <AppHeader />
        <PageWrapper>
            <RouterView />
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
    max-width: 1440px;
    height: 100vh;
    max-height: 100vh;
    margin: 0 auto;
}
</style>
