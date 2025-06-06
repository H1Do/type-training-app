import { render, screen, fireEvent } from '@testing-library/vue';
import ForgotPasswordForm from './ForgotPasswordForm.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/entities/user';
import { createI18n } from 'vue-i18n';
import { en, ru } from '@/shared/locales';
import { createRouter, createMemoryHistory } from 'vue-router';
import { RoutePaths } from '@/app/router';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

const router = createRouter({
    history: createMemoryHistory(),
    routes: [],
});
router.push = vi.fn();

describe('ForgotPasswordForm.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () =>
        render(ForgotPasswordForm, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        stubActions: false,
                    }),
                    i18n,
                    router,
                ],
            },
        });

    it('renders form elements', () => {
        renderComponent();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /reset/i }),
        ).toBeInTheDocument();
    });

    it('shows validation error if email is empty', async () => {
        renderComponent();
        const button = screen.getByRole('button', { name: /reset/i });
        await fireEvent.click(button);

        const store = useUserStore();
        expect(store.setError).toHaveBeenCalledWith(
            expect.stringMatching(/required/i),
        );
    });

    it('calls requestPasswordReset and redirects on success', async () => {
        renderComponent();

        const input = screen.getByPlaceholderText(/email/i);
        await fireEvent.update(input, 'test@example.com');

        const store = useUserStore();
        const spy = vi.spyOn(store, 'requestPasswordReset').mockResolvedValue();

        const button = screen.getByRole('button', { name: /reset/i });
        await fireEvent.click(button);

        expect(spy).toHaveBeenCalledWith('test@example.com');
        expect(router.push).toHaveBeenCalledWith(RoutePaths.AUTH);
    });

    it('displays error from store', async () => {
        const pinia = createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
                user: {
                    error: 'Some error',
                },
            },
        });

        render(ForgotPasswordForm, {
            global: {
                plugins: [pinia, i18n, router],
            },
        });

        expect(screen.getByText('Some error')).toBeInTheDocument();
    });
});
