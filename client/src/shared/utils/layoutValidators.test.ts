import { describe, it, expect } from 'vitest';
import { isQwertyOnly, isYcukenOnly } from './layoutValidators';

describe('isQwertyOnly', () => {
    it('returns true for valid QWERTY characters', () => {
        expect(isQwertyOnly('Hello, World! 123')).toBe(true);
        expect(isQwertyOnly('[]{}()')).toBe(true);
        expect(isQwertyOnly('`~!@#$%^&*()_+-=|\\:;"\'<>,.?/')).toBe(true);
    });

    it('returns false for Cyrillic characters', () => {
        expect(isQwertyOnly('Привет')).toBe(false);
        expect(isQwertyOnly('Тест 123')).toBe(false);
    });

    it('returns true for empty string', () => {
        expect(isQwertyOnly('')).toBe(true);
    });

    it('returns false for emoji', () => {
        expect(isQwertyOnly('Hello 😊')).toBe(false);
    });
});

describe('isYcukenOnly', () => {
    it('returns true for valid ЙЦУКЕН characters', () => {
        expect(isYcukenOnly('Привет, мир! 123')).toBe(true);
        expect(isYcukenOnly('Ёжик в тумане')).toBe(true);
        expect(isYcukenOnly('Число: 100%')).toBe(true);
        expect(isYcukenOnly('№1, 2:3')).toBe(true);
    });

    it('returns false for Latin characters', () => {
        expect(isYcukenOnly('Hello')).toBe(false);
        expect(isYcukenOnly('Тест test')).toBe(false);
    });

    it('returns true for empty string', () => {
        expect(isYcukenOnly('')).toBe(true);
    });

    it('returns false for emoji', () => {
        expect(isYcukenOnly('Тест 😎')).toBe(false);
    });

    it('returns false for symbols not in set', () => {
        expect(isYcukenOnly('Привет!@#')).toBe(false);
    });
});
