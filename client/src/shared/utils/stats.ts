import { METRIC_COLOR_PRESETS } from '../config/metricColors';
import type { Theme } from '../types';
import type { PerItemStat, PerItemStatMetric } from '../types/training';

export const getColorByMetric = (
    stat: PerItemStat | undefined,
    averageStat: PerItemStat,
    metric: PerItemStatMetric,
    theme: Theme,
): string | undefined => {
    if (!stat) return;
    console.log(theme);

    const COLORS = METRIC_COLOR_PRESETS[theme];

    switch (metric) {
        case 'averageReaction': {
            const delta = stat.averageReaction - averageStat.averageReaction;

            if (delta <= -100) return COLORS.superb;
            if (delta <= -70) return COLORS.excellent;
            if (delta <= -40) return COLORS.veryGood;
            if (delta <= -20) return COLORS.good;
            if (delta <= 20) return COLORS.normal;
            if (delta <= 50) return COLORS.slightlyWorse;
            if (delta <= 100) return COLORS.worse;
            if (delta <= 200) return COLORS.bad;

            return COLORS.terrible;
        }

        case 'errorsCount': {
            const shareOfErrors = stat.errorsCount / averageStat.errorsCount;

            if (stat.errorsCount === 0) return COLORS.normal;
            if (shareOfErrors <= 0.02) return COLORS.good;
            if (shareOfErrors <= 0.05) return COLORS.slightlyWorse;
            if (shareOfErrors <= 0.1) return COLORS.worse;
            if (shareOfErrors <= 0.2) return COLORS.bad;

            return COLORS.terrible;
        }

        case 'accuracy': {
            const acc = stat.accuracy;

            if (acc >= 100) return COLORS.normal;
            if (acc >= 98) return COLORS.good;
            if (acc >= 94) return COLORS.slightlyWorse;
            if (acc >= 90) return COLORS.worse;
            if (acc >= 85) return COLORS.bad;

            return COLORS.terrible;
        }
    }
};
