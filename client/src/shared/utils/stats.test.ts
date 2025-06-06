import { describe, it, expect } from 'vitest';
import { getColorByMetric } from './stats';
import { METRIC_COLOR_PRESETS } from '../config/metricColors';
import { Theme } from '../types';

const theme = Theme.LIGHT;
const COLORS = METRIC_COLOR_PRESETS[theme];

const fullStat = (
    overrides: Partial<ReturnType<typeof getStatMock>>,
): ReturnType<typeof getStatMock> => ({
    count: 10,
    totalTime: 5000,
    averageReaction: 200,
    errorsCount: 5,
    accuracy: 95,
    ...overrides,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getStatMock = () => ({
    count: 10,
    totalTime: 5000,
    averageReaction: 200,
    errorsCount: 5,
    accuracy: 95,
});

describe('getColorByMetric', () => {
    describe('averageReaction', () => {
        const average = fullStat({ averageReaction: 200 });

        it('returns superb for much faster reaction', () => {
            const stat = fullStat({ averageReaction: 90 });
            expect(
                getColorByMetric(stat, average, 'averageReaction', theme),
            ).toBe(COLORS.superb);
        });

        it('returns normal for similar reaction', () => {
            const stat = fullStat({ averageReaction: 210 });
            expect(
                getColorByMetric(stat, average, 'averageReaction', theme),
            ).toBe(COLORS.normal);
        });

        it('returns terrible for much slower reaction', () => {
            const stat = fullStat({ averageReaction: 450 });
            expect(
                getColorByMetric(stat, average, 'averageReaction', theme),
            ).toBe(COLORS.terrible);
        });
    });

    describe('errorsCount', () => {
        const average = fullStat({ errorsCount: 20 });

        it('returns normal if no errors', () => {
            const stat = fullStat({ errorsCount: 0 });
            expect(getColorByMetric(stat, average, 'errorsCount', theme)).toBe(
                COLORS.normal,
            );
        });

        it('returns good if errors < 2%', () => {
            const stat = fullStat({ errorsCount: 0.3 });
            expect(getColorByMetric(stat, average, 'errorsCount', theme)).toBe(
                COLORS.good,
            );
        });

        it('returns terrible if > 20%', () => {
            const stat = fullStat({ errorsCount: 10 });
            const newAverage = fullStat({ errorsCount: 4 });
            expect(
                getColorByMetric(stat, newAverage, 'errorsCount', theme),
            ).toBe(COLORS.terrible);
        });
    });

    describe('accuracy', () => {
        it('returns normal if 100%', () => {
            const stat = fullStat({ accuracy: 100 });
            expect(getColorByMetric(stat, stat, 'accuracy', theme)).toBe(
                COLORS.normal,
            );
        });

        it('returns good if >= 98%', () => {
            const stat = fullStat({ accuracy: 98.5 });
            expect(getColorByMetric(stat, stat, 'accuracy', theme)).toBe(
                COLORS.good,
            );
        });

        it('returns terrible if < 85%', () => {
            const stat = fullStat({ accuracy: 80 });
            expect(getColorByMetric(stat, stat, 'accuracy', theme)).toBe(
                COLORS.terrible,
            );
        });
    });

    it('returns undefined if stat is undefined', () => {
        const avg = fullStat({});
        expect(
            getColorByMetric(undefined, avg, 'accuracy', theme),
        ).toBeUndefined();
    });
});
