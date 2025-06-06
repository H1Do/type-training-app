import { setActivePinia, createPinia } from 'pinia';
import { useAuthorizationStore } from './authorization';
import { useUserStore } from '@/entities/user';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

vi.mock('@/entities/user', () => {
    return {
        useUserStore: vi.fn(),
    };
});

describe('useAuthorizationStore', () => {
    const loginMock = vi.fn();
    const registrationMock = vi.fn();
    const setErrorMock = vi.fn();

    beforeEach(() => {
        setActivePinia(createPinia());

        (useUserStore as unknown as Mock).mockReturnValue({
            login: loginMock,
            registration: registrationMock,
            setError: setErrorMock,
        });

        loginMock.mockReset();
        registrationMock.mockReset();
        setErrorMock.mockReset();
    });

    it('submits login form', async () => {
        const store = useAuthorizationStore();
        store.type = 'login';
        store.loginForm.email = 'test@mail.com';
        store.loginForm.password = 'pass';

        await store.submit();

        expect(loginMock).toHaveBeenCalledWith('test@mail.com', 'pass');
    });

    it('submits registration form', async () => {
        const store = useAuthorizationStore();
        store.type = 'registration';
        store.registrationForm.email = 'test@mail.com';
        store.registrationForm.login = 'testuser';
        store.registrationForm.password = 'pass';

        await store.submit();

        expect(registrationMock).toHaveBeenCalledWith(
            'testuser',
            'pass',
            'test@mail.com',
        );
    });

    it('toggles form type and resets error', () => {
        const store = useAuthorizationStore();
        store.type = 'login';

        store.toggleType();

        expect(setErrorMock).toHaveBeenCalledWith('');
        expect(store.type).toBe('registration');
    });
});
