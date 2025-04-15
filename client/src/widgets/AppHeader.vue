<script setup lang="ts">
import { RouteNames } from '@/app/router/router';
import { useUserStore } from '@/shared/models/user';
import AppLink from '@/shared/ui/AppLink.vue';
import { User } from 'lucide-vue-next';

const { isAuthenticated, username } = useUserStore();
</script>

<template>
    <header class="app-header">
        <div class="logo">
            <AppLink :to="RouteNames.MAIN" class="app-link">
                Type Training App
            </AppLink>
        </div>
        <nav class="nav">
            <AppLink to="/about" class="app-link">About</AppLink>
            <AppLink to="/contact" class="app-link">Contact</AppLink>
            <AppLink to="/help" class="app-link">Help</AppLink>
        </nav>
        <div class="user-actions">
            <AppLink v-if="isAuthenticated" to="/profile" class="app-link">
                <User class="app-link-icon" />
                {{ username }}
            </AppLink>
            <AppLink v-else :to="RouteNames.AUTH" class="app-link">
                Login/Register
            </AppLink>
        </div>
    </header>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.app-header {
    width: 100%;
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
    color: var(--header-text-color);
    text-decoration: none;
}
</style>
