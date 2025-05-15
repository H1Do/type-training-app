import { useUserStore } from '@/entities/user';
import { createRouter, createWebHistory } from 'vue-router';

export enum RoutePaths {
    MAIN = '/',
    AUTH = '/auth',
    PROFILE = '/profile',
    STATS = '/stats',
    LESSONS = '/lessons',
    LESSON = '/lessons/:id',
    TRAINING = '/training',
    SETTINGS = '/settings',
    VERIFY_EMAIL = '/verify-email',
    FORGOT_PASSWORD = '/forgot-password',
    RESET_PASSWORD = '/reset-password',
    NOT_FOUND = '/:pathMatch(.*)*',

    ADMIN = '/admin',
    ADMIN_USERS = '/admin/users',
    ADMIN_LESSONS = '/admin/lessons',
    ADMIN_USER_STATS = '/admin/user-stats/:userId',
}

export enum RouteNames {
    MAIN = 'main',
    AUTH = 'auth',
    PROFILE = 'profile',
    STATS = 'stats',
    LESSONS = 'lessons',
    LESSON = 'lesson',
    TRAINING = 'training',
    SETTINGS = 'settings',
    VERIFY_EMAIL = 'verifyEmail',
    FORGOT_PASSWORD = 'forgotPassword',
    RESET_PASSWORD = 'resetPassword',
    NOT_FOUND = 'notFound',

    ADMIN = 'admin',
    ADMIN_USERS = 'adminUsers',
    ADMIN_LESSONS = 'adminLessons',
    ADMIN_USER_STATS = 'adminUserStats',
}

const routes = [
    {
        name: RouteNames.MAIN,
        path: RoutePaths.MAIN,
        component: () => import('@/pages/MainPage.vue'),
    },
    {
        name: RouteNames.AUTH,
        path: RoutePaths.AUTH,
        component: () => import('@/pages/AuthPage.vue'),
        meta: {
            requiredAuthStatus: false,
        },
    },
    {
        name: RouteNames.PROFILE,
        path: RoutePaths.PROFILE,
        component: () => import('@/pages/ProfilePage.vue'),
        meta: {
            requiredAuthStatus: true,
        },
    },
    {
        name: RouteNames.STATS,
        path: RoutePaths.STATS,
        component: () => import('@/pages/StatsPage.vue'),
        meta: {
            requiredAuthStatus: true,
        },
    },
    {
        name: RouteNames.LESSONS,
        path: RoutePaths.LESSONS,
        component: () => import('@/pages/LessonsPage.vue'),
        meta: {
            requiredAuthStatus: true,
        },
    },
    {
        name: RouteNames.LESSON,
        path: RoutePaths.LESSON,
        component: () => import('@/pages/LessonPage.vue'),
        meta: {
            requiredAuthStatus: true,
        },
    },
    {
        name: RouteNames.TRAINING,
        path: RoutePaths.TRAINING,
        component: () => import('@/pages/TrainingPage.vue'),
    },
    {
        name: RouteNames.SETTINGS,
        path: RoutePaths.SETTINGS,
        component: () => import('@/pages/SettingsPage.vue'),
    },
    {
        name: RouteNames.NOT_FOUND,
        path: RoutePaths.NOT_FOUND,
        component: () => import('@/pages/NotFoundPage.vue'),
    },
    {
        name: RouteNames.VERIFY_EMAIL,
        path: RoutePaths.VERIFY_EMAIL,
        component: () => import('@/pages/VerifyEmailPage.vue'),
    },
    {
        name: RouteNames.FORGOT_PASSWORD,
        path: RoutePaths.FORGOT_PASSWORD,
        component: () => import('@/pages/ForgotPasswordPage.vue'),
        meta: {
            requiredAuthStatus: false,
        },
    },
    {
        name: RouteNames.RESET_PASSWORD,
        path: RoutePaths.RESET_PASSWORD,
        component: () => import('@/pages/ResetPasswordPage.vue'),
        meta: {
            requiredAuthStatus: false,
        },
    },
    {
        name: RouteNames.ADMIN,
        path: RoutePaths.ADMIN,
        component: () => import('@/pages/admin/AdminDashboardPage.vue'),
        meta: {
            requiredAuthStatus: true,
            requiredAdmin: true,
        },
    },
    {
        name: RouteNames.ADMIN_USERS,
        path: RoutePaths.ADMIN_USERS,
        component: () => import('@/pages/admin/UsersPage.vue'),
        meta: {
            requiredAuthStatus: true,
            requiredAdmin: true,
        },
    },
    {
        name: RouteNames.ADMIN_LESSONS,
        path: RoutePaths.ADMIN_LESSONS,
        component: () => import('@/pages/admin/LessonsPage.vue'),
        meta: {
            requiredAuthStatus: true,
            requiredAdmin: true,
        },
    },
    {
        name: RouteNames.ADMIN_USER_STATS,
        path: RoutePaths.ADMIN_USER_STATS,
        component: () => import('@/pages/admin/UserStatsPage.vue'),
        meta: {
            requiredAuthStatus: true,
            requiredAdmin: true,
        },
    },
];

export const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore();

    if (!userStore.isAuthenticated) {
        await userStore.checkAuth();
    }

    const reqAuth = to.meta.requiredAuthStatus;
    const reqAdmin = to.meta.requiredAdmin;

    if (reqAuth && !userStore.isAuthenticated) {
        return next({ path: RoutePaths.AUTH });
    }

    if (reqAdmin && !userStore.isAdmin) {
        return next({ path: RoutePaths.MAIN });
    }

    if (reqAuth === false && userStore.isAuthenticated) {
        return next({ path: RoutePaths.MAIN });
    }

    return next();
});
