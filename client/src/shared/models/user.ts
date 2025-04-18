import { defineStore } from 'pinia';
import { UserApi } from '../services/userApi';

export interface User {
    username: string;
    email: string;
}

export interface UserState {
    isAuthenticated: boolean;
    username: string;
    email: string;
    error: string;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        isAuthenticated: false,
        username: '',
        email: '',
        error: '',
    }),
    actions: {
        clearUserState(errorMessage?: string) {
            this.error = errorMessage ?? '';
            this.username = '';
            this.email = '';
            this.isAuthenticated = false;
        },
        async checkAuth(userApi: UserApi) {
            try {
                const data = await userApi.getUser();
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.isAuthenticated = true;
                return true;
            } catch {
                this.clearUserState('');
                return false;
            }
        },
        async login(email: string, password: string, userApi: UserApi) {
            try {
                const data = await userApi.login(email, password);
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.isAuthenticated = true;
            } catch {
                this.clearUserState('Invalid email or password');
            }
        },
        async registration(
            username: string,
            password: string,
            email: string,
            userApi: UserApi,
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
            } catch {
                this.clearUserState('Email already exists');
            }
        },
        async logout(userApi: UserApi) {
            try {
                await userApi.logout();
                this.clearUserState();
            } catch {
                this.error = 'Logout failed';
            }
        },
        setError(error: string) {
            this.error = error;
        },
    },
});
