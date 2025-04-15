import AuthPage from '@/pages/AuthPage.vue';
import { useUserStore } from '@/shared/models/user';
import { createRouter, createWebHistory } from 'vue-router';

export enum RouteNames {
    MAIN = '/',
    AUTH = '/auth',
}

const routes = [
    {
        path: RouteNames.AUTH,
        component: AuthPage,
    },
];

export const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore();

    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
        next({ name: RouteNames.AUTH });
    } else {
        next();
    }
});
