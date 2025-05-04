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
                this.error = this.t('profile.allFieldsRequired');
                return false;
            }

            if (this.newPassword !== this.confirmPassword) {
                this.error = this.t('profile.passwordsDoNotMatch');
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
