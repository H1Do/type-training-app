import { useUserStore } from '@/shared/models/user';
import { createRouter, createWebHistory } from 'vue-router';

export enum RouteNames {
    MAIN = '/',
    AUTH = '/auth',
    PROFILE = '/profile',
}

const routes = [
    {
        path: RouteNames.MAIN,
        component: () => import('@/pages/MainPage.vue'),
    },
    {
        path: RouteNames.AUTH,
        component: () => import('@/pages/AuthPage.vue'),
        meta: {
            requiredAuthStatus: false,
        },
    },
    {
        path: RouteNames.PROFILE,
        component: () => import('@/pages/ProfilePage.vue'),
        meta: {
            requiredAuthStatus: true,
        },
    },
];

export const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore();

    const reqAuth = to.meta.requiredAuthStatus;

    if (reqAuth && !userStore.isAuthenticated) {
        next({ path: RouteNames.AUTH });
    } else if (reqAuth === false && userStore.isAuthenticated) {
        next({ path: RouteNames.MAIN });
    } else {
        next();
    }
});
