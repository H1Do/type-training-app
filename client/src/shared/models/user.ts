import { defineStore } from 'pinia';
import { UserApi } from '../domains/userApi';
import type { MessageService } from '../services/MessageService';
import { AxiosError } from 'axios';

export interface User {
    username: string;
    email: string;
    createdAt: string;
}

export interface UserState {
    isAuthenticated: boolean;
    username: string;
    email: string;
    error: string;
    createdAt: string;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        isAuthenticated: false,
        username: '',
        email: '',
        error: '',
        createdAt: '',
    }),
    actions: {
        clearUserState(errorMessage?: string) {
            this.error = errorMessage ?? '';
            this.username = '';
            this.email = '';
            this.isAuthenticated = false;
        },
        async checkAuth(userApi: UserApi, messageService: MessageService) {
            try {
                const data = await userApi.getUser();
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.createdAt = data.createdAt;
                this.isAuthenticated = true;
                return true;
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message || 'Check auth failed';
                    messageService.push({
                        type: 'warning',
                        text: message,
                    });
                }
                return false;
            }
        },
        async login(
            email: string,
            password: string,
            userApi: UserApi,
            messageService: MessageService,
        ) {
            try {
                const data = await userApi.login(email, password);
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.isAuthenticated = true;
                messageService.push({
                    type: 'success',
                    text: 'Login successful',
                });
                this.checkAuth(userApi, messageService);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message ||
                        'Invalid email or password';
                    this.clearUserState(message);
                    messageService.push({
                        type: 'error',
                        text: message,
                    });
                }
            }
        },
        async registration(
            username: string,
            password: string,
            email: string,
            userApi: UserApi,
            messageService: MessageService,
        ) {
            try {
                const data = await userApi.registration(
                    username,
                    password,
                    email,
                );
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.isAuthenticated = true;
                messageService.push({
                    type: 'success',
                    text: 'Registration successful',
                });
                this.checkAuth(userApi, messageService);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message || 'Registration failed';
                    this.clearUserState(message);
                    messageService.push({
                        type: 'error',
                        text: message,
                    });
                }
            }
        },
        async logout(userApi: UserApi, messageService: MessageService) {
            try {
                await userApi.logout();
                this.clearUserState();
                messageService.push({
                    type: 'info',
                    text: 'Logout successful',
                });
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message || 'Logout failed';
                    this.clearUserState(message);
                    messageService.push({
                        type: 'error',
                        text: message,
                    });
                }
            }
        },
        async changePassword(
            oldPassword: string,
            newPassword: string,
            userApi: UserApi,
            messageService: MessageService,
        ) {
            try {
                await userApi.changePassword(oldPassword, newPassword);
                messageService.push({
                    type: 'success',
                    text: 'Password changed successfully',
                });
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message ||
                        'Change password failed';
                    this.clearUserState(message);
                    messageService.push({
                        type: 'error',
                        text: message,
                    });
                    throw error;
                }
            }
        },
        setError(error: string) {
            this.error = error;
        },
    },
});
