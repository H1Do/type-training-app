import { render, fireEvent } from '@testing-library/vue';
import AdminUsersList from './AdminUsersList.vue';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { en, ru } from '@/shared/locales';
import { describe, it, expect, vi } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import { RouteNames } from '@/app/router';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

const routerPushMock = vi.fn();

const router = createRouter({
    history: createMemoryHistory(),
    routes: [],
});
router.push = routerPushMock;

describe('AdminUsersList', () => {
    it('renders users and handles actions', async () => {
        const userMock = {
            id: '1',
            username: 'TestUser',
            email: 'test@example.com',
            isBlocked: false,
        };

        const { getByText, getAllByRole } = render(AdminUsersList, {
            global: {
                plugins: [
                    createTestingPinia({
                        stubActions: false,
                        initialState: {
                            admin: {
                                users: [userMock],
                                isLoading: false,
                                totalUsers: 1,
                                limit: 10,
                                offset: 0,
                                searchQuery: '',
                            },
                        },
                    }),
                    i18n,
                    router,
                ],
            },
        });

        getByText('TestUser');
        getByText('test@example.com');

        const viewButtons = getAllByRole('button');
        await fireEvent.click(viewButtons[0]);
        expect(routerPushMock).toHaveBeenCalledWith({
            name: RouteNames.ADMIN_USER_STATS,
            params: { userId: '1' },
        });

        await fireEvent.click(viewButtons[1]);
    });
});
