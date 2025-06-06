import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from './model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AxiosError } from 'axios';

describe('user', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let store: any;

    const mockUserApi = {
        getUser: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        registration: vi.fn(),
        changePassword: vi.fn(),
        verifyEmail: vi.fn(),
        requestPasswordReset: vi.fn(),
        resetPassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
    };

    const mockMessageService = {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
    };

    const mockRouter = {
        push: vi.fn(),
    };

    const mockT = vi.fn((key) => key);

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useUserStore();

        store.userApi = mockUserApi;
        store.messageService = mockMessageService;
        store.router = mockRouter;
        store.t = mockT;

        vi.clearAllMocks();
    });

    it('sets level and exp', () => {
        store.setLevel(4);
        store.setExp(250);
        expect(store.level).toBe(4);
        expect(store.exp).toBe(250);
    });

    it('sets error manually', () => {
        store.setError('Custom error');
        expect(store.error).toBe('Custom error');
    });

    it('clears user state with and without message', () => {
        store.username = 'test';
        store.clearUserState();
        expect(store.username).toBe('');
        expect(store.error).toBe('');

        store.clearUserState('Some error');
        expect(store.error).toBe('Some error');
    });

    it('login success', async () => {
        mockUserApi.login.mockResolvedValue({
            username: 'user',
            email: 'email@test.com',
            level: 2,
            exp: 500,
        });
        mockUserApi.getUser.mockResolvedValue({
            username: 'user',
            email: 'email@test.com',
            level: 2,
            exp: 500,
            createdAt: '2023-01-01',
            isVerified: true,
            role: 'user',
        });

        await store.login('email@test.com', 'pass');

        expect(store.username).toBe('user');
        expect(store.isAuthenticated).toBe(true);
        expect(mockMessageService.success).toHaveBeenCalled();
    });

    it('login failure', async () => {
        const axiosError = new AxiosError(
            'Invalid credentials',
            '400',
            undefined,
            {},
            {
                data: { message: 'Invalid credentials' },
                status: 400,
                statusText: 'Bad Request',
                headers: {},
                config: {
                    url: '',
                    method: 'post',
                    // @ts-expect-error mock
                    headers: {},
                },
            },
        );

        mockUserApi.login.mockRejectedValue(axiosError);

        await store.login('wrong@test.com', 'fail');

        expect(store.isAuthenticated).toBe(false);
        expect(store.error).toBe('Invalid credentials');
        expect(mockMessageService.error).toHaveBeenCalledWith(
            'Invalid credentials',
        );
    });

    it('registration success', async () => {
        mockUserApi.registration.mockResolvedValue({
            username: 'newuser',
            email: 'new@test.com',
            level: 1,
            exp: 100,
        });
        mockUserApi.getUser.mockResolvedValue({
            username: 'newuser',
            email: 'new@test.com',
            level: 1,
            exp: 100,
            createdAt: '2023-01-01',
            isVerified: true,
            role: 'user',
        });

        await store.registration('newuser', 'pass', 'new@test.com');
        expect(store.username).toBe('newuser');
        expect(store.isAuthenticated).toBe(true);
        expect(mockMessageService.success).toHaveBeenCalled();
    });

    it('logout success', async () => {
        await store.logout();
        expect(store.isAuthenticated).toBe(false);
        expect(mockMessageService.info).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalled();
    });

    it('changePassword success', async () => {
        await store.changePassword('old', 'new');
        expect(mockMessageService.success).toHaveBeenCalled();
    });

    it('changePassword failure', async () => {
        mockUserApi.changePassword.mockRejectedValue(
            new AxiosError(
                'Invalid current password',
                '400',
                undefined,
                {},
                {
                    data: { message: 'Invalid current password' },
                    status: 400,
                    statusText: 'Bad Request',
                    headers: {},
                    config: {
                        url: '',
                        method: 'post',
                        // @ts-expect-error mock
                        headers: undefined,
                    },
                },
            ),
        );

        await expect(store.changePassword('old', 'bad')).rejects.toBeDefined();
        expect(store.error).toBe('Invalid current password');
        expect(mockMessageService.error).toHaveBeenCalled();
    });

    it('checkAuth success', async () => {
        mockUserApi.getUser.mockResolvedValue({
            username: 'test',
            email: 'test@test.com',
            createdAt: '2023-01-01',
            level: 3,
            exp: 300,
            isVerified: true,
            role: 'admin',
        });

        const result = await store.checkAuth();

        expect(result).toBe(true);
        expect(store.username).toBe('test');
        expect(store.isAuthenticated).toBe(true);
        expect(store.role).toBe('admin');
        expect(store.isAdmin).toBe(true);
    });

    it('checkAuth failure', async () => {
        mockUserApi.getUser.mockRejectedValue(new Error('401'));

        const result = await store.checkAuth();

        expect(result).toBe(false);
        expect(store.isAuthenticated).toBe(false);
    });

    it('verifyEmail success', async () => {
        mockUserApi.verifyEmail.mockResolvedValue({
            message: 'Email verified',
        });
        mockUserApi.getUser.mockResolvedValue({
            username: 'test',
            email: 'test@test.com',
            createdAt: '2023-01-01',
            level: 3,
            exp: 300,
            isVerified: true,
            role: 'user',
        });

        await store.verifyEmail('token123');

        expect(mockMessageService.success).toHaveBeenCalledWith(
            'Email verified',
        );
    });

    it('verifyEmail failure', async () => {
        mockUserApi.verifyEmail.mockRejectedValue(
            new AxiosError(
                'Verification failed',
                undefined,
                {
                    // @ts-expect-error mock
                    headers: {},
                },
                {},
                {
                    data: { message: 'Verification failed' },
                    status: 400,
                    statusText: 'Bad Request',
                    headers: {},
                    config: {},
                },
            ),
        );

        await store.verifyEmail('badtoken');
        expect(mockMessageService.error).toHaveBeenCalledWith(
            'Verification failed',
        );
    });

    it('requestPasswordReset success', async () => {
        mockUserApi.requestPasswordReset.mockResolvedValue({
            message: 'Reset link sent',
        });

        await store.requestPasswordReset('email@test.com');

        expect(mockMessageService.success).toHaveBeenCalledWith(
            'Reset link sent',
        );
    });

    it('requestPasswordReset failure', async () => {
        mockUserApi.requestPasswordReset.mockRejectedValue(
            new AxiosError(
                'Reset failed',
                undefined,
                {
                    // @ts-expect-error mock
                    headers: {},
                },
                {},
                {
                    data: { message: 'Reset failed' },
                    status: 400,
                    statusText: 'Bad Request',
                    headers: {},
                    config: {},
                },
            ),
        );

        await store.requestPasswordReset('fail@test.com');
        expect(mockMessageService.error).toHaveBeenCalledWith('Reset failed');
    });

    it('resetPassword success', async () => {
        mockUserApi.resetPassword.mockResolvedValue({
            message: 'auth.passwordResetSuccess',
        });

        await store.resetPassword('token', 'newPassword');

        expect(mockMessageService.success).toHaveBeenCalledWith(
            'auth.passwordResetSuccess',
        );
    });

    it('resetPassword failure', async () => {
        mockUserApi.resetPassword.mockRejectedValue(
            new AxiosError(
                'Reset error',
                undefined,
                {
                    // @ts-expect-error mock
                    headers: {},
                },
                {},
                {
                    data: { message: 'Reset error' },
                    status: 400,
                    statusText: 'Bad Request',
                    headers: {},
                    config: {},
                },
            ),
        );

        await store.resetPassword('token', 'badPassword');

        expect(mockMessageService.error).toHaveBeenCalledWith('Reset error');
    });

    it('resendVerificationEmail success', async () => {
        mockUserApi.resendVerificationEmail.mockResolvedValue({
            message: 'Verification email sent',
        });

        await store.resendVerificationEmail();

        expect(mockMessageService.success).toHaveBeenCalledWith(
            'Verification email sent',
        );
    });

    it('resendVerificationEmail failure', async () => {
        mockUserApi.resendVerificationEmail.mockRejectedValue(
            new AxiosError(
                'Send failed',
                undefined,
                {
                    // @ts-expect-error mock
                    headers: {},
                },
                {},
                {
                    data: { message: 'Send failed' },
                    status: 400,
                    statusText: 'Bad Request',
                    headers: {},
                    config: {},
                },
            ),
        );

        await store.resendVerificationEmail();

        expect(mockMessageService.error).toHaveBeenCalledWith('Send failed');
    });
});
