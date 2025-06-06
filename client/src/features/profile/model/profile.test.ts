/* eslint-disable @typescript-eslint/no-explicit-any */
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { useChangePasswordForm } from './profile';

const mockUserApi = {
    changePassword: vi.fn(),
};

const mockMessageService = {
    success: vi.fn(),
    error: vi.fn(),
};

const mockT = (key: string) => key;

vi.mock('@/shared/utils', () => ({
    isPasswordStrong: (p: string) => p.length >= 8,
}));

describe('useChangePasswordForm', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('returns false if fields are empty', async () => {
        const store = useChangePasswordForm();
        store.t = mockT;

        const result = await store.submit();
        expect(result).toBe(false);
        expect(store.error).toBe('auth.allFieldsRequired');
    });

    it('returns false if passwords do not match', async () => {
        const store = useChangePasswordForm();
        store.t = mockT;
        store.oldPassword = 'old123';
        store.newPassword = 'new123456';
        store.confirmPassword = 'wrong123';

        const result = await store.submit();
        expect(result).toBe(false);
        expect(store.error).toBe('auth.passwordsDoNotMatch');
    });

    it('returns false if password is weak', async () => {
        const store = useChangePasswordForm();
        store.t = mockT;
        store.oldPassword = 'old123';
        store.newPassword = 'weak';
        store.confirmPassword = 'weak';

        const result = await store.submit();
        expect(result).toBe(false);
        expect(store.error).toBe('auth.passwordWeak');
    });

    it('handles API success', async () => {
        const store = useChangePasswordForm();
        store.userApi = mockUserApi as any;
        store.messageService = mockMessageService as any;
        store.t = mockT;
        store.oldPassword = 'old123';
        store.newPassword = 'newPassword1';
        store.confirmPassword = 'newPassword1';

        mockUserApi.changePassword.mockResolvedValueOnce(undefined);

        const result = await store.submit();
        expect(result).toBe(true);
        expect(mockMessageService.success).toHaveBeenCalledWith(
            'auth.passwordChangeSuccess',
        );
    });

    it('handles API AxiosError', async () => {
        const store = useChangePasswordForm();
        store.userApi = mockUserApi as any;
        store.messageService = mockMessageService as any;
        store.t = mockT;
        store.oldPassword = 'old123';
        store.newPassword = 'newPassword1';
        store.confirmPassword = 'newPassword1';

        mockUserApi.changePassword.mockRejectedValueOnce({
            isAxiosError: true,
            response: { data: { message: 'fail' } },
        });

        const result = await store.submit();
        expect(result).toBe(false);
        expect(store.error).toBe('fail');
        expect(mockMessageService.error).toHaveBeenCalledWith('fail');
    });
});
