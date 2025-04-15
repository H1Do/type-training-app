import { defineStore } from 'pinia';
import { UserApi } from '../services/userApi';
import { inject } from 'vue';

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
        getUserApi(): UserApi {
            const userApi = inject<UserApi>('userApi');
            if (!userApi) throw new Error('UserApi not provided');
            return userApi;
        },
        clearUserState(errorMessage?: string) {
            this.error = errorMessage ?? '';
            this.username = '';
            this.email = '';
            this.isAuthenticated = false;
        },
        async checkAuth() {
            const userApi = this.getUserApi();
            try {
                const data = await userApi.getUser();
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.isAuthenticated = true;
                return true;
            } catch (error) {
                this.clearUserState(String(error));
                return false;
            }
        },
        async login(email: string, password: string) {
            const userApi = this.getUserApi();
            try {
                const data = await userApi.login(email, password);
                this.error = '';
                this.username = data.username;
                this.email = data.email;
                this.isAuthenticated = true;
            } catch (error) {
                this.clearUserState(String(error));
            }
        },
        async registration(username: string, password: string, email: string) {
            const userApi = this.getUserApi();
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
            } catch (error) {
                this.clearUserState(String(error));
            }
        },
        async logout() {
            const userApi = this.getUserApi();
            try {
                await userApi.logout();
                this.clearUserState();
            } catch (error) {
                this.error = String(error);
            }
        },
    },
});
