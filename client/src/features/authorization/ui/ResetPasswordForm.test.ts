import { render, screen, fireEvent } from '@testing-library/vue';
import ResetPasswordForm from './ResetPasswordForm.vue';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useUserStore } from '@/entities/user';
import { createI18n } from 'vue-i18n';
import { en, ru } from '@/shared/locales';
import { createRouter, createMemoryHistory } from 'vue-router';

vi.mock('@/shared/utils', async (mod) => {
    const actual = (await mod()) || {};
    return {
        ...actual,
        isPasswordStrong: vi.fn().mockReturnValue(true),
    };
});

vi.mock('vue-router', async (mod) => {
    const actual = (await mod()) || {};
    return {
        ...actual,
        useRoute: () => ({ query: { token: 'test-token' } }),
    };
});

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

const router = createRouter({
    history: createMemoryHistory(),
    routes: [],
});
vi.spyOn(router, 'push').mockResolvedValue();

describe('ResetPasswordForm.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        return render(ResetPasswordForm, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        stubActions: false,
                        initialState: {
                            user: {
                                error: '',
                            },
                        },
                    }),
                    i18n,
                    router,
                ],
            },
        });
    };

    it('renders all fields', () => {
        renderComponent();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('Confirm password'),
        ).toBeInTheDocument();
    });

    it('shows error if fields are empty', async () => {
        renderComponent();
        await fireEvent.click(screen.getByRole('button'));
        expect(useUserStore().setError).toHaveBeenCalledWith(
            expect.stringMatching(/required/i),
        );
    });

    it('shows error if passwords do not match', async () => {
        renderComponent();
        await fireEvent.update(
            screen.getByPlaceholderText('Password'),
            '12345678',
        );
        await fireEvent.update(
            screen.getByPlaceholderText('Confirm password'),
            '87654321',
        );
        await fireEvent.click(screen.getByRole('button'));
        expect(useUserStore().setError).toHaveBeenCalledWith(
            expect.stringMatching(/match/i),
        );
    });

    it('shows error if password is weak', async () => {
        const { isPasswordStrong } = await import('@/shared/utils');
        (isPasswordStrong as Mock).mockReturnValue(false);

        renderComponent();
        await fireEvent.update(
            screen.getByPlaceholderText('Password'),
            '12345678',
        );
        await fireEvent.update(
            screen.getByPlaceholderText('Confirm password'),
            '12345678',
        );
        await fireEvent.click(screen.getByRole('button'));
        expect(useUserStore().setError).toHaveBeenCalledWith(
            'Password must be at least 8 and not more than 32 characters and include uppercase, lowercase, numbers, and symbols.',
        );
    });

    it('shows error from store if exists', () => {
        const pinia = createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
                user: {
                    error: 'Something went wrong',
                },
            },
        });

        render(ResetPasswordForm, {
            global: { plugins: [pinia, i18n, router] },
        });

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
});
