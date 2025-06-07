import { describe, it, expect } from 'vitest';
import {
    getExpForLevel,
    calculateExp,
    addExpToUser,
    MAX_LEVEL,
} from './levelSystem';
import { UserDoc } from '@/types/userTypes';

describe('getExpForLevel', () => {
    it('returns correct experience for valid level', () => {
        expect(getExpForLevel(1)).toBe(100);
        expect(getExpForLevel(2)).toBe(250);
    });

    it('returns Infinity for level < 1 or >= MAX_LEVEL', () => {
        expect(getExpForLevel(0)).toBe(Infinity);
        expect(getExpForLevel(10)).toBe(Infinity);
        expect(getExpForLevel(100)).toBe(Infinity);
    });
});

describe('calculateExp', () => {
    it('calculates experience with mode words', () => {
        const exp = calculateExp({
            cpm: 300,
            accuracy: 100,
            charCount: 400,
            mode: 'words',
        });
        expect(exp).toBeGreaterThan(0);
        expect(exp).toBe(100);
    });

    it('calculates experience with mode symbols', () => {
        const exp = calculateExp({
            cpm: 200,
            accuracy: 80,
            charCount: 400,
            mode: 'symbols',
        });
        expect(exp).toBe(133);
    });

    it('returns at least 1 even if result is zero or negative', () => {
        const exp = calculateExp({
            cpm: 0,
            accuracy: 0,
            charCount: 0,
            mode: 'words',
        });
        expect(exp).toBe(1);
    });
});

describe('addExpToUser', () => {
    const createUser = (level: number, exp: number) =>
        ({
            username: 'user',
            password: 'pass',
            email: 'a@b.com',
            createdAt: new Date(),
            isBlocked: false,
            isVerified: true,
            level,
            exp,
            role: 'user',
            lastSeen: new Date(),
        } as unknown as UserDoc);

    it('adds exp and levels up correctly', () => {
        const user = createUser(1, 90);
        const result = addExpToUser(user, 20);
        expect(result.newLevel).toBe(2);
        expect(result.currentExp).toBe(10);
        expect(user.level).toBe(2);
        expect(user.exp).toBe(10);
    });

    it('does not level up if not enough exp', () => {
        const user = createUser(1, 0);
        const result = addExpToUser(user, 50);
        expect(result.newLevel).toBe(1);
        expect(result.currentExp).toBe(50);
    });

    it('caps at MAX_LEVEL and sets exp to 0', () => {
        const user = createUser(9, 2699);
        const result = addExpToUser(user, 10);
        expect(result.newLevel).toBe(MAX_LEVEL);
        expect(result.currentExp).toBe(0);
    });

    it('handles multiple level-ups', () => {
        const user = createUser(1, 0);
        const totalExp = 3000;
        const result = addExpToUser(user, totalExp);
        expect(result.newLevel).toBeGreaterThan(1);
        expect(result.newLevel).toBeLessThanOrEqual(MAX_LEVEL);
    });
});
