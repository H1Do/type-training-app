import { defineStore } from 'pinia';
import type { AxiosError } from 'axios';

export interface ChangePasswordFormState {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    error: string;
}

export const useChangePasswordForm = defineStore('changePasswordForm', {
    state: () => ({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: '',
    }),

    actions: {
        reset() {
            this.oldPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
            this.error = '';
        },

        async submit(): Promise<boolean> {
            if (
                !this.oldPassword ||
                !this.newPassword ||
                !this.confirmPassword
            ) {
                this.error = 'All fields are required';
                return false;
            }

            if (this.newPassword !== this.confirmPassword) {
                this.error = 'Passwords do not match';
                return false;
            }

            try {
                await this.userApi.changePassword(
                    this.oldPassword,
                    this.newPassword,
                );
                return true;
            } catch (error) {
                this.error =
                    (
                        (error as AxiosError).response?.data as {
                            message: string;
                        }
                    )?.message || 'Unexpected error';
                return false;
            }
        },
    },
});
