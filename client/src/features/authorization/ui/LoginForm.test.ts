import { render, screen, fireEvent } from '@testing-library/vue';
import LoginForm from './LoginForm.vue';
import { describe, it, expect } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { en, ru } from '@/shared/locales';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

describe('LoginForm.vue', () => {
    const initialModelValue = { email: '', password: '' };

    const renderComponent = (modelValue = initialModelValue) =>
        render(LoginForm, {
            props: { modelValue },
            global: {
                plugins: [createTestingPinia({ stubActions: false }), i18n],
            },
        });

    it('renders email and password inputs and submit button', () => {
        renderComponent();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /login/i }),
        ).toBeInTheDocument();
    });

    it('emits update:modelValue and update:error on input', async () => {
        const { emitted } = renderComponent();

        const emailInput = screen.getByPlaceholderText(/email/i);
        await fireEvent.update(emailInput, 'test@example.com');
        expect(emitted()['update:modelValue']).toBeTruthy();
        expect(emitted()['update:error']).toBeTruthy();

        const passwordInput = screen.getByPlaceholderText(/password/i);
        await fireEvent.update(passwordInput, '12345678');
        expect(emitted()['update:modelValue'].length).toBeGreaterThan(1);
    });

    it('shows error from store when userStore.error is set', async () => {
        const pinia = createTestingPinia({
            initialState: {
                user: { error: 'Invalid credentials' },
            },
            stubActions: false,
        });

        render(LoginForm, {
            props: { modelValue: initialModelValue },
            global: { plugins: [pinia, i18n] },
        });

        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
});
