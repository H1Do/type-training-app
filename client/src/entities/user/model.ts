import { defineStore } from 'pinia';
import type { UserState } from './types';
import { AxiosError } from 'axios';
import { RoutePaths } from '@/app/router';

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        isAuthenticated: false,
        username: '',
        email: '',
        createdAt: '',
        level: 1,
        exp: 0,
        error: '',
    }),
    actions: {
        setLevel(level: number) {
            this.level = level;
        },

        setExp(exp: number) {
            this.exp = exp;
        },

        clearUserState(errorMessage?: string) {
            this.error = errorMessage ?? '';
            this.username = '';
            this.email = '';
            this.isAuthenticated = false;
            this.createdAt = '';
            this.level = 1;
            this.exp = 0;
        },

        async checkAuth() {
            try {
                const data = await this.userApi.getUser();
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.createdAt = data.createdAt;
                this.isAuthenticated = true;
                this.level = data.level;
                this.exp = data.exp;

                return true;
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message ||
                        this.t('auth.checkAuthFailed');
                    this.messageService.warning(message);
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
                this.level = data.level;
                this.exp = data.exp;
                this.messageService.success(this.t('auth.loginSuccess'));
                this.checkAuth();
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message ||
                        this.t('auth.invalidCredentials');
                    this.clearUserState(message);
                    this.messageService.error(message);
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
                this.level = data.level;
                this.exp = data.exp;
                this.messageService.success(this.t('auth.registrationSuccess'));
                this.checkAuth();
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message ||
                        this.t('auth.registrationFailed');
                    this.clearUserState(message);
                    this.messageService.error(message);
                }
            }
        },

        async logout() {
            try {
                await this.userApi.logout();
                this.clearUserState();
                this.messageService.info(this.t('auth.logoutSuccess'));
                this.router.push(RoutePaths.MAIN);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message ||
                        this.t('auth.logoutFailed');
                    this.clearUserState(message);
                    this.messageService.error(message);
                }
            }
        },

        async changePassword(oldPassword: string, newPassword: string) {
            try {
                await this.userApi.changePassword(oldPassword, newPassword);
                this.messageService.success(
                    this.t('auth.passwordChangeSuccess'),
                );
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const message =
                        error?.response?.data?.message ||
                        this.t('auth.changePasswordFailed');
                    this.clearUserState(message);
                    this.messageService.error(message);
                    throw error;
                }
            }
        },

        setError(error: string) {
            this.error = error;
        },
    },
});
