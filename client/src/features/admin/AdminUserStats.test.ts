import { render, fireEvent, screen } from '@testing-library/vue';
import AdminUserStats from './AdminUserStats.vue';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { en, ru } from '@/shared/locales';
import { describe, it, expect, vi } from 'vitest';
import { RoutePaths } from '@/app/router';
import { nextTick } from 'vue';

const routerPushMock = vi.fn();
const viewUserStatsMock = vi.fn();

vi.mock('vue-router', async () => {
    const actual = await vi.importActual<typeof import('vue-router')>(
        'vue-router',
    );
    return {
        ...actual,
        useRoute: () => ({ params: { userId: '123' } }),
        useRouter: () => ({ push: routerPushMock }),
    };
});

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

describe('AdminUserStats', () => {
    it('renders and triggers viewUserStats + back navigation', async () => {
        render(AdminUserStats, {
            global: {
                plugins: [
                    createTestingPinia({
                        stubActions: false,
                        initialState: {
                            admin: {
                                selectedUserStats: {},
                                isLoading: false,
                            },
                            settings: {
                                theme: 'light',
                            },
                        },
                        createSpy: () => viewUserStatsMock,
                    }),
                    i18n,
                ],
            },
        });

        await nextTick();

        expect(viewUserStatsMock).toHaveBeenCalledWith(
            '123',
            '100PopularWords',
            'QWERTY',
            'all',
        );

        const backBtn = await screen.findByText('Go back');
        await fireEvent.click(backBtn);
        expect(routerPushMock).toHaveBeenCalledWith(RoutePaths.ADMIN_USERS);
    });
});
