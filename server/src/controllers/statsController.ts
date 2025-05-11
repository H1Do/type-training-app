import { Response, NextFunction } from 'express';
import { TrainingStats } from '@/models/TrainingStats';
import { ApiError } from '@/errors/ApiError';
import { StatsQueryRequest } from '@/types/requestTypes';
import { FingerStat, PerCharStat } from '@/types/statsTypes';
import type {
    SessionDto,
    StatsPeriod,
    TrainingStatsDoc,
} from '@/types/statsTypes';

export const StatsController = {
    async getUserStats(
        req: StatsQueryRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.user?.id;
            if (!userId)
                return next(
                    ApiError.unauthorized(
                        req.t?.('errors.unauthorized') ?? 'Unauthorized',
                    ),
                );

            const { since = 'all', mode, layout } = req.query;

            const filter: Record<string, any> = {
                userId,
                isRated: true,
            };

            if (since !== 'all') {
                const now = Date.now();
                const msMap = {
                    day: 1000 * 60 * 60 * 24,
                    week: 1000 * 60 * 60 * 24 * 7,
                    month: 1000 * 60 * 60 * 24 * 30,
                } satisfies Record<Exclude<StatsPeriod, 'all'>, number>;

                filter.createdAt = { $gte: new Date(now - msMap[since]) };
            }

            if (mode) filter.mode = mode;
            if (layout) filter.layout = layout;

            const sessions: TrainingStatsDoc[] = await TrainingStats.find(
                filter,
            ).lean();

            const leaderboardFilter: Record<string, any> = {
                isLeaderboardEligible: true,
            };
            if (since !== 'all') leaderboardFilter.createdAt = filter.createdAt;
            if (mode) leaderboardFilter.mode = mode;
            if (layout) leaderboardFilter.layout = layout;

            const leaderboardRaw = await TrainingStats.aggregate([
                { $match: leaderboardFilter },
                { $sort: { cpm: -1 } },
                {
                    $group: {
                        _id: '$userId',
                        cpm: { $first: '$cpm' },
                        accuracy: { $first: '$accuracy' },
                    },
                },
                { $sort: { cpm: -1 } },
                { $limit: 10 },
            ])
                .lookup({
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                })
                .unwind('$user');

            const leaderboard = leaderboardRaw.map((entry) => ({
                userId: entry._id.toString(),
                username: entry.user.username,
                cpm: entry.cpm,
                accuracy: entry.accuracy,
                isCurrentUser: entry._id.toString() === userId,
            }));

            if (!sessions.length) {
                return res.json({
                    totalSessions: 0,
                    accuracy: 100,
                    cpm: 0,
                    averageReaction: 0,
                    perChar: [],
                    fingerStats: [],
                    leaderboard: leaderboard,
                    position: null,
                });
            }

            const totalSessions = sessions.length;

            const totalInputs = sessions.reduce(
                (acc, s) =>
                    acc + s.perCharStats?.reduce((a, c) => a + c.count, 0),
                0,
            );
            const totalCorrect = sessions.reduce(
                (acc, s) =>
                    acc +
                    s.perCharStats?.reduce(
                        (a, c) => a + (c.count - c.errorsCount),
                        0,
                    ),
                0,
            );

            const accuracy = Math.round((totalCorrect / totalInputs) * 100);
            const cpm = Math.round(
                sessions.reduce((a, s) => a + s.cpm, 0) / totalSessions,
            );
            const averageReaction = Math.round(
                sessions.reduce((a, s) => a + s.averageReaction, 0) /
                    totalSessions,
            );

            const userBest = await TrainingStats.findOne({
                userId,
                isLeaderboardEligible: true,
                ...(since !== 'all' && { createdAt: filter.createdAt }),
                ...(mode && { mode }),
                ...(layout && { layout }),
            })
                .sort({ cpm: -1 })
                .select('_id cpm accuracy')
                .lean();

            let position: number | null = null;

            if (userBest) {
                position = await TrainingStats.countDocuments({
                    ...leaderboardFilter,
                    cpm: { $gt: userBest.cpm },
                });
                position += 1;
            }

            const sessionDtos: SessionDto[] = sessions.map((s) => ({
                accuracy: s.accuracy,
                averageReaction: s.averageReaction,
                cpm: s.cpm,
                count: s.count,
                errorsCount: s.errorsCount,
                textErrorsCount: s.textErrorsCount,
                errorsRate: s.errorsCount / s.count,
                createdAt: s.createdAt,
            }));

            return res.json({
                totalSessions,
                accuracy,
                cpm,
                averageReaction,
                count: totalInputs,
                errorsCount: totalInputs - totalCorrect,
                totalTextErrorsCount: sessions.reduce(
                    (a, s) => a + s.textErrorsCount,
                    0,
                ),
                totalTime: sessions.reduce((acc, s) => acc + s.totalTime, 0),
                perCharStats: mergePerCharStat(sessions),
                fingerStats: mergeFingerStats(sessions),
                sessions: sessionDtos,
                leaderboard,
                userBestResult: userBest,
                position,
            });
        } catch (e) {
            next(e);
        }
    },
};

function mergePerCharStat(sessions: TrainingStatsDoc[]): PerCharStat[] {
    const map = new Map<
        string,
        { count: number; errorsCount: number; totalTime: number }
    >();

    for (const session of sessions) {
        if (!session.perCharStats) continue;

        for (const charStat of session.perCharStats) {
            const existing = map.get(charStat.char) ?? {
                count: 0,
                errorsCount: 0,
                totalTime: 0,
            };
            existing.count += charStat.count;
            existing.errorsCount += charStat.errorsCount;
            existing.totalTime += charStat.totalTime;
            map.set(charStat.char, existing);
        }
    }

    return Array.from(map.entries()).map(([char, data]) => ({
        char,
        count: data.count,
        errorsCount: data.errorsCount,
        totalTime: data.totalTime,
        averageReaction: Math.round(data.totalTime / data.count),
        accuracy: Math.round(
            ((data.count - data.errorsCount) / data.count) * 100,
        ),
    }));
}

function mergeFingerStats(sessions: TrainingStatsDoc[]): FingerStat[] {
    const map = new Map<
        string,
        {
            chars: Set<string>;
            count: number;
            errorsCount: number;
            totalTime: number;
        }
    >();

    for (const session of sessions) {
        if (!session.fingerStats) continue;

        for (const finger of session.fingerStats ?? []) {
            const existing = map.get(finger.finger) ?? {
                chars: new Set<string>(),
                count: 0,
                errorsCount: 0,
                totalTime: 0,
            };
            finger.chars.forEach((c: string) => existing.chars.add(c));
            existing.count += finger.count;
            existing.errorsCount += finger.errorsCount;
            existing.totalTime += finger.totalTime;
            map.set(finger.finger, existing);
        }
    }

    return Array.from(map.entries()).map(([finger, data]) => ({
        finger,
        chars: Array.from(data.chars),
        count: data.count,
        errorsCount: data.errorsCount,
        totalTime: data.totalTime,
        averageReaction: Math.round(data.totalTime / data.count),
        accuracy: Math.round(
            ((data.count - data.errorsCount) / data.count) * 100,
        ),
    }));
}
