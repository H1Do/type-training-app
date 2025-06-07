import { describe, it, expect } from 'vitest';
import { calculateDetailedStats } from './calculateStats';
import { mockEvents, mockInput, mockSequence } from '@/tests/mocks';

describe('calculateDetailedStats', () => {
    const result = calculateDetailedStats(
        mockEvents,
        1000,
        4000,
        mockInput,
        mockSequence,
    );

    it('calculates overall accuracy and error count', () => {
        expect(result.accuracy).toBe(67);
        expect(result.errorsCount).toBe(1);
    });

    it('calculates text error count based on input/sequence diff', () => {
        expect(result.textErrorsCount).toBe(1);
    });

    it('calculates number of corrections (backspaces)', () => {
        expect(result.corrections).toBe(1);
    });

    it('calculates average reaction time', () => {
        expect(result.averageReaction).toBe(150);
    });

    it('calculates CPM', () => {
        expect(result.cpm).toBe(60);
    });

    it('returns per-char stats', () => {
        const stats = result.perCharStats.find((s) => s.char === 's');
        expect(stats?.errorsCount).toBe(1);
        expect(stats?.accuracy).toBe(0);
    });

    it('returns per-finger stats', () => {
        const finger = result.fingerStats.find((f) => f.finger === 'left-ring');
        expect(finger?.errorsCount).toBe(1);
        expect(finger?.chars).toContain('s');
        expect(finger?.accuracy).toBe(0);
    });
});
