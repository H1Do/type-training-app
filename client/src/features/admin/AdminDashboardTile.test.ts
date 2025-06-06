import { render, fireEvent } from '@testing-library/vue';
import AdminDashboardTile from './AdminDashboardTile.vue';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { en, ru } from '@/shared/locales';
import { describe, it, expect, vi } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import { RoutePaths } from '@/app/router';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

const mockRouterPush = vi.fn();

const router = createRouter({
    history: createMemoryHistory(),
    routes: [],
});
router.push = mockRouterPush;

describe('AdminDashboardTile', () => {
    it('renders and navigates on card click', async () => {
        const { getByText } = render(AdminDashboardTile, {
            global: {
                plugins: [
                    createTestingPinia({
                        stubActions: false,
                        initialState: {
                            admin: {
                                stats: {
                                    registrationsByDay: [],
                                },
                            },
                            settings: {
                                theme: 'light',
                            },
                        },
                    }),
                    i18n,
                    router,
                ],
            },
        });

        getByText('Administration panel');

        const lessonsCard = getByText('Lesson Management');
        const usersCard = getByText('Users Management');

        await fireEvent.click(lessonsCard);
        expect(mockRouterPush).toHaveBeenCalledWith(RoutePaths.ADMIN_LESSONS);

        await fireEvent.click(usersCard);
        expect(mockRouterPush).toHaveBeenCalledWith(RoutePaths.ADMIN_USERS);
    });
});
