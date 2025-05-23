import { InputEventRecord } from '@/types/trainingTypes';

export function calculateDetailedStats(
    events: InputEventRecord[],
    startedAt: number,
    finishedAt: number,
    input: string[],
    sequence: string[],
) {
    const inputs = events.filter((e) => e.type === 'input');
    const correct = inputs.filter((e) => e.actual === e.expected).length;
    const total = inputs.length;
    const totalTime = finishedAt - startedAt;

    const textErrorsCount =
        Math.max(input.length, sequence.length) -
        input.filter((c, i) => c === sequence[i]).length;

    const perCharStatsMap = new Map<
        string,
        { count: number; errorsCount: number; totalTime: number }
    >();

    const fingerMap = new Map<
        string,
        {
            chars: Set<string>;
            count: number;
            errorsCount: number;
            totalTime: number;
        }
    >();

    for (const event of inputs) {
        const { expected: key, finger } = event;
        if (!key) continue;

        const charStat = perCharStatsMap.get(key) ?? {
            count: 0,
            errorsCount: 0,
            totalTime: 0,
        };
        charStat.count += 1;
        charStat.totalTime += event.time;
        if (event.actual !== event.expected) charStat.errorsCount += 1;
        perCharStatsMap.set(key, charStat);

        if (finger) {
            const fStat = fingerMap.get(finger) ?? {
                chars: new Set<string>(),
                count: 0,
                errorsCount: 0,
                totalTime: 0,
            };
            fStat.count += 1;
            fStat.totalTime += event.time;
            fStat.chars.add(key);
            if (event.actual !== event.expected) fStat.errorsCount += 1;
            fingerMap.set(finger, fStat);
        }
    }

    const perCharStats = Array.from(perCharStatsMap.entries()).map(
        ([char, data]) => ({
            char,
            ...data,
            accuracy: Math.round(
                ((data.count - data.errorsCount) / data.count) * 100,
            ),
            averageReaction: Math.round(data.totalTime / data.count),
        }),
    );

    const fingerStats = Array.from(fingerMap.entries()).map(
        ([finger, data]) => ({
            finger,
            chars: Array.from(data.chars),
            count: data.count,
            errorsCount: data.errorsCount,
            totalTime: data.totalTime,
            averageReaction: Math.round(data.totalTime / data.count),
            accuracy: Math.round(
                ((data.count - data.errorsCount) / data.count) * 100,
            ),
        }),
    );

    return {
        accuracy: total ? Math.round((correct / total) * 100) : 100,
        errorsCount: total - correct,
        textErrorsCount,
        corrections: events.filter((e) => e.type === 'backspace').length,
        averageReaction: total
            ? Math.round(inputs.reduce((a, b) => a + b.time, 0) / total)
            : 0,
        cpm: totalTime ? Math.round(total / (totalTime / 1000 / 60)) : 0,
        count: total,
        totalTime,
        perCharStats,
        fingerStats,
    };
}
