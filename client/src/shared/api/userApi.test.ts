import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserApi } from './userApi';
import type { HttpClient } from './httpClient';

const createHttpClientMock = (): ReturnType<typeof vi.mocked<HttpClient>> => {
    return {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    } as unknown as ReturnType<typeof vi.mocked<HttpClient>>;
};
describe('UserApi', () => {
    let httpClientMock: ReturnType<typeof vi.mocked<HttpClient>>;
    let userApi: UserApi;

    beforeEach(() => {
        httpClientMock = createHttpClientMock();
        userApi = new UserApi(httpClientMock);
    });

    it('registration sends correct request and returns user', async () => {
        const user = { username: 'test', email: 'test@mail.com' };
        httpClientMock.post.mockResolvedValueOnce({
            data: user,
            status: 0,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: {},
        });

        const result = await userApi.registration(
            'test',
            'pass',
            'test@mail.com',
        );

        expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/user/registration',
            {
                username: 'test',
                password: 'pass',
                email: 'test@mail.com',
            },
        );
        expect(result).toEqual(user);
    });

    it('login sends correct request and returns user', async () => {
        const user = { username: 'test', email: 'test@mail.com' };
        httpClientMock.post.mockResolvedValueOnce({
            data: user,
            status: 0,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: {},
        });

        const result = await userApi.login('test@mail.com', 'pass');

        expect(httpClientMock.post).toHaveBeenCalledWith('api/user/login', {
            email: 'test@mail.com',
            password: 'pass',
        });
        expect(result).toEqual(user);
    });

    it('logout sends post to correct endpoint', async () => {
        httpClientMock.post.mockResolvedValueOnce({
            data: undefined,
            status: 0,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: undefined,
        });

        await userApi.logout();

        expect(httpClientMock.post).toHaveBeenCalledWith('api/user/logout');
    });

    it('changePassword sends correct data', async () => {
        httpClientMock.post.mockResolvedValueOnce({
            data: undefined,
            status: 0,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: undefined,
        });

        await userApi.changePassword('old', 'new');

        expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/user/change-password',
            {
                oldPassword: 'old',
                newPassword: 'new',
            },
        );
    });

    it('getUser returns correct data', async () => {
        const user = { username: 'test', email: 'test@mail.com' };
        httpClientMock.get.mockResolvedValueOnce({
            data: user,
            status: 0,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: undefined,
        });

        const result = await userApi.getUser();

        expect(httpClientMock.get).toHaveBeenCalledWith('api/user');
        expect(result).toEqual(user);
    });

    it('verifyEmail calls correct endpoint', async () => {
        httpClientMock.get.mockResolvedValueOnce({
            data: { message: 'ok' },
            status: 0,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: undefined,
        });

        const result = await userApi.verifyEmail('token');

        expect(httpClientMock.get).toHaveBeenCalledWith(
            'api/user/verify-email?token=token',
        );
        expect(result).toEqual({ message: 'ok' });
    });

    it('requestPasswordReset calls correct endpoint', async () => {
        httpClientMock.post.mockResolvedValueOnce({
            data: { message: 'ok' },
            status: 0,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: undefined,
        });

        const result = await userApi.requestPasswordReset('email');

        expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/user/forgot-password',
            {
                email: 'email',
            },
        );
        expect(result).toEqual({ message: 'ok' });
    });

    it('resetPassword calls correct endpoint', async () => {
        httpClientMock.post.mockResolvedValueOnce({
            data: { message: 'ok' },
            status: 0,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: undefined,
        });

        const result = await userApi.resetPassword('token', 'pass');

        expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/user/reset-password',
            {
                token: 'token',
                newPassword: 'pass',
            },
        );
        expect(result).toEqual({ message: 'ok' });
    });

    it('resendVerificationEmail calls correct endpoint', async () => {
        httpClientMock.post.mockResolvedValueOnce({
            data: { message: 'ok' },
            status: 0,
            statusText: '',
            headers: {},
            // @ts-expect-error mock
            config: undefined,
        });

        const result = await userApi.resendVerificationEmail();

        expect(httpClientMock.post).toHaveBeenCalledWith(
            'api/user/resend-verification',
        );
        expect(result).toEqual({ message: 'ok' });
    });
});
