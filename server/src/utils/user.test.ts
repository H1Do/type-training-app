import { describe, it, expect } from 'vitest';
import { isPasswordStrong } from './user';

describe('isPasswordStrong', () => {
    it('returns true for a strong password', () => {
        expect(isPasswordStrong('Str0ng!Pass')).toBe(true);
    });

    it('fails if password is too short', () => {
        expect(isPasswordStrong('S1!a')).toBe(false);
    });

    it('fails if password is too long', () => {
        expect(isPasswordStrong('A1!' + 'a'.repeat(30))).toBe(false);
    });

    it('fails if no uppercase letter', () => {
        expect(isPasswordStrong('str0ng!pass')).toBe(false);
    });

    it('fails if no lowercase letter', () => {
        expect(isPasswordStrong('STR0NG!PASS')).toBe(false);
    });

    it('fails if no digit', () => {
        expect(isPasswordStrong('Strong!Pass')).toBe(false);
    });

    it('fails if no special character', () => {
        expect(isPasswordStrong('Strong1Pass')).toBe(false);
    });
});
