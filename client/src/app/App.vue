<script setup lang="ts">
import { useThemeStore } from '@/shared/models/theme';
import { useUserStore } from '@/shared/models/user';
import AppFooter from '@/widgets/AppFooter.vue';
import AppHeader from '@/widgets/AppHeader.vue';
import PageWrapper from '@/widgets/PageWrapper.vue';
import { onMounted } from 'vue';

const theme = useThemeStore();
const user = useUserStore();

onMounted(() => {
    user.checkAuth();
});
</script>

<template>
    <div :class="['app', theme.theme]">
        <AppHeader />
        <PageWrapper>
            <RouterView />
        </PageWrapper>
        <AppFooter />
    </div>
</template>

<style lang="scss">
.app {
    width: 100%;
    max-width: 1440px;
    height: 100vh;
    max-height: 100vh;
    margin: 0 auto;
}
</style>
