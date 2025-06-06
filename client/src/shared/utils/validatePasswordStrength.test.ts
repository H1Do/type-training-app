import { describe, it, expect } from 'vitest';
import { isPasswordStrong } from './validatePasswordStrength';

describe('isPasswordStrong', () => {
    it('returns true for a strong password', () => {
        expect(isPasswordStrong('Abcdef1!')).toBe(true);
    });

    it('fails if password is too short', () => {
        expect(isPasswordStrong('A1a!')).toBe(false);
    });

    it('fails if password is too long', () => {
        const long = 'A1a!'.repeat(10); // 40+ chars
        expect(isPasswordStrong(long)).toBe(false);
    });

    it('fails if missing uppercase letter', () => {
        expect(isPasswordStrong('abcdef1!')).toBe(false);
    });

    it('fails if missing lowercase letter', () => {
        expect(isPasswordStrong('ABCDEF1!')).toBe(false);
    });

    it('fails if missing digit', () => {
        expect(isPasswordStrong('Abcdefg!')).toBe(false);
    });

    it('fails if missing special character', () => {
        expect(isPasswordStrong('Abcdefg1')).toBe(false);
    });

    it('passes edge case: exactly 8 chars', () => {
        expect(isPasswordStrong('A1b2c3!d')).toBe(true);
    });

    it('passes edge case: exactly 32 chars', () => {
        expect(isPasswordStrong('Ab1!' + 'aB2#'.repeat(7))).toBe(true);
    });
});
