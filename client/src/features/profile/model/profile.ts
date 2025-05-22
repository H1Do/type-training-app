import { defineStore } from 'pinia';
import { AxiosError } from 'axios';
import { isPasswordStrong } from '@/shared/utils';

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
                this.error = this.t('auth.allFieldsRequired');
                return false;
            }

            if (this.newPassword !== this.confirmPassword) {
                this.error = this.t('auth.passwordsDoNotMatch');
                return false;
            }

            if (!isPasswordStrong(this.newPassword)) {
                this.error = this.t('auth.passwordWeak');
                return false;
            }

            try {
                try {
                    await this.userApi.changePassword(
                        this.oldPassword,
                        this.newPassword,
                    );
                    this.messageService.success(
                        this.t('auth.passwordChangeSuccess'),
                    );
                } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                        const message =
                            error?.response?.data?.message ||
                            this.t('auth.changePasswordFailed');
                        this.messageService.error(message);
                        throw false;
                    }
                }
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
