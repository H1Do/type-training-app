import { defineStore } from 'pinia';
import type { UserState } from './types';
import { AxiosError } from 'axios';

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
        async checkAuth() {
            try {
                const data = await this.userApi.getUser();
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
                    this.messageService.push({
                        type: 'warning',
                        text: message,
                    });
                }
                return false;
            }
        },
        async login(email: string, password: string) {
            try {
                const data = await this.userApi.login(email, password);
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.isAuthenticated = true;
                this.messageService.push({
                    type: 'success',
                    text: 'Login successful',
                });
                this.checkAuth();
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message ||
                        'Invalid email or password';
                    this.clearUserState(message);
                    this.messageService.push({
                        type: 'error',
                        text: message,
                    });
                }
            }
        },
        async registration(username: string, password: string, email: string) {
            try {
                const data = await this.userApi.registration(
                    username,
                    password,
                    email,
                );
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.isAuthenticated = true;
                this.messageService.push({
                    type: 'success',
                    text: 'Registration successful',
                });
                this.checkAuth();
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message || 'Registration failed';
                    this.clearUserState(message);
                    this.messageService.push({
                        type: 'error',
                        text: message,
                    });
                }
            }
        },
        async logout() {
            try {
                await this.userApi.logout();
                this.clearUserState();
                this.messageService.push({
                    type: 'info',
                    text: 'Logout successful',
                });
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message || 'Logout failed';
                    this.clearUserState(message);
                    this.messageService.push({
                        type: 'error',
                        text: message,
                    });
                }
            }
        },
        async changePassword(oldPassword: string, newPassword: string) {
            try {
                await this.userApi.changePassword(oldPassword, newPassword);
                this.messageService.push({
                    type: 'success',
                    text: 'Password changed successfully',
                });
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message ||
                        'Change password failed';
                    this.clearUserState(message);
                    this.messageService.push({
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
