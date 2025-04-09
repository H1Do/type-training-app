import { AuthPage } from '@pages';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        component: AuthPage,
    },
];

export const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
});
