import { describe, it, expect } from 'vitest';
import { getExpForLevel, expTable, MAX_LEVEL } from './level';

describe('getExpForLevel', () => {
    it('returns correct exp for levels 1 to 9', () => {
        for (let level = 1; level < MAX_LEVEL; level++) {
            expect(getExpForLevel(level)).toBe(expTable[level]);
        }
    });

    it('returns Infinity for level 0', () => {
        expect(getExpForLevel(0)).toBe(Infinity);
    });

    it('returns Infinity for level equal to MAX_LEVEL', () => {
        expect(getExpForLevel(MAX_LEVEL)).toBe(Infinity);
    });

    it('returns Infinity for level above MAX_LEVEL', () => {
        expect(getExpForLevel(MAX_LEVEL + 1)).toBe(Infinity);
        expect(getExpForLevel(100)).toBe(Infinity);
    });

    it('does not return Infinity for valid levels', () => {
        for (let level = 1; level < MAX_LEVEL; level++) {
            expect(getExpForLevel(level)).not.toBe(Infinity);
        }
    });
});
