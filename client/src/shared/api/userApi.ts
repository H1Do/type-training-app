import type { User } from '@/entities/user';
import { HttpClient } from './httpClient';

export class UserApi {
    constructor(private httpClient: HttpClient) {}

    registration = async (
        username: string,
        password: string,
        email: string,
    ): Promise<User> => {
        const { data } = await this.httpClient.post<User>(
            'api/user/registration',
            {
                username,
                password,
                email,
            },
        );
        return data;
    };

    login = async (email: string, password: string): Promise<User> => {
        const { data } = await this.httpClient.post<User>('api/user/login', {
            email,
            password,
        });
        return data;
    };

    logout = async (): Promise<void> => {
        await this.httpClient.post('api/user/logout');
    };

    changePassword = async (
        oldPassword: string,
        newPassword: string,
    ): Promise<void> => {
        await this.httpClient.post('api/user/change-password', {
            oldPassword,
            newPassword,
        });
    };

    getUser = async (): Promise<User> => {
        const { data } = await this.httpClient.get<User>('api/user');
        return data;
    };

    verifyEmail = async (token: string): Promise<{ message: string }> => {
        const { data } = await this.httpClient.get<{ message: string }>(
            `api/user/verify-email?token=${token}`,
        );
        return data;
    };

    requestPasswordReset = async (
        email: string,
    ): Promise<{ message: string }> => {
        const { data } = await this.httpClient.post<{ message: string }>(
            'api/user/forgot-password',
            { email },
        );
        return data;
    };

    resetPassword = async (
        token: string,
        newPassword: string,
    ): Promise<{ message: string }> => {
        const { data } = await this.httpClient.post<{ message: string }>(
            'api/user/reset-password',
            { token, newPassword },
        );
        return data;
    };

    resendVerificationEmail = async (): Promise<{ message: string }> => {
        const { data } = await this.httpClient.post<{ message: string }>(
            'api/user/resend-verification',
        );
        return data;
    };
}
