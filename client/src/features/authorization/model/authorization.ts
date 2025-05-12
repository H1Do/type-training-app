import { defineStore } from 'pinia';
import { useUserStore } from '@/entities/user';

export type AuthorizationType = 'login' | 'registration';

export interface LoginForm {
    email: string;
    password: string;
}

export interface RegistrationForm {
    email: string;
    login: string;
    password: string;
    confirmPassword: string;
}

export const useAuthorizationStore = defineStore('authorization', {
    state: () => ({
        loginForm: {
            email: '',
            password: '',
        } as LoginForm,
        registrationForm: {
            email: '',
            login: '',
            password: '',
            confirmPassword: '',
        } as RegistrationForm,
        type: 'login' as AuthorizationType,
    }),

    actions: {
        async submit() {
            const userStore = useUserStore();
            if (this.type === 'login') {
                const { email, password } = this.loginForm;
                await userStore.login(email, password);
            } else {
                const { email, login, password } = this.registrationForm;
                await userStore.registration(login, password, email);
            }
        },

        toggleType() {
            const userStore = useUserStore();

            userStore.setError('');
            this.type = this.type === 'login' ? 'registration' : 'login';
        },
    },
});
