import { Request, Response, NextFunction } from 'express';
import { User } from '@/models/User';
import { Lesson, UserLessonProgress } from '@/models/Lesson';
import { TrainingStats } from '@/models/TrainingStats';
import { ApiError } from '@/errors/ApiError';
import { Types } from 'mongoose';
import {
    AdminCreateLessonRequest,
    AdminDeleteLessonRequest,
    AdminGetLessonsRequest,
    AdminGetUsersRequest,
    AdminUpdateLessonRequest,
    AdminUserIdRequest,
    AdminUserStatsRequest,
} from '@/types/requestTypes';
import { TrainingMode } from '@/types/trainingTypes';
import { SessionDto, StatsPeriod, TrainingStatsDoc } from '@/types/statsTypes';
import { mergeFingerStats, mergePerCharStat } from './statsController';

export const adminController = {
    async getAllUsers(
        req: AdminGetUsersRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const searchQuery = req.query.q?.trim();
            const limit = Math.min(Number(req.query.limit) || 20, 100);
            const offset = Number(req.query.offset) || 0;

            const filter = searchQuery
                ? { username: { $regex: searchQuery, $options: 'i' } }
                : {};

            const [users, total] = await Promise.all([
                User.find(filter)
                    .select('username email isBlocked isVerified createdAt')
                    .sort({ createdAt: -1 })
                    .skip(offset)
                    .limit(limit)
                    .lean(),
                User.countDocuments(filter),
            ]);

            const result = users.map((u) => ({
                id: u.id.toString(),
                username: u.username,
                email: u.email,
                isBlocked: u.isBlocked,
                isVerified: u.isVerified,
            }));

            res.status(200).json({
                users: result,
                total,
                limit,
                offset,
            });
        } catch (e) {
            next(e);
        }
    },

    async blockUser(
        req: AdminUserIdRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.badRequest('Invalid user ID'));
            }

            if (req.user?.id === id) {
                return next(ApiError.badRequest('You cannot block yourself'));
            }

            const user = await User.findById(id);
            if (!user) return next(ApiError.notFound('User not found'));

            user.isBlocked = true;
            await user.save();

            res.status(200).json({ message: 'User blocked successfully' });
        } catch (e) {
            next(e);
        }
    },

    async unblockUser(
        req: AdminUserIdRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.badRequest('Invalid user ID'));
            }

            const user = await User.findById(id);
            if (!user) return next(ApiError.notFound('User not found'));

            user.isBlocked = false;
            await user.save();

            res.status(200).json({ message: 'User unblocked successfully' });
        } catch (e) {
            next(e);
        }
    },

    async getAllLessons(
        req: AdminGetLessonsRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const lessons = await Lesson.find().sort({ order: 1 }).lean();

            const result = lessons.map((l) => ({
                id: l.id.toString(),
                title: l.title,
                allowedChars: l.allowedChars,
                layout: l.layout,
                order: l.order,
                length: l.length,
                cpmFor1: l.cpmFor1,
                cpmFor2: l.cpmFor2,
                cpmFor3: l.cpmFor3,
                minAccuracy: l.minAccuracy,
                prevLessonId: l.prevLessonId,
                nextLessonId: l.nextLessonId,
            }));

            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    },

    async getUserStats(
        req: AdminUserStatsRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const { since = 'all', mode, layout } = req.query;

            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.badRequest('Invalid user ID'));
            }

            if (
                typeof since !== 'string' ||
                !['day', 'week', 'month', 'all'].includes(since)
            ) {
                return next(ApiError.badRequest('Invalid period'));
            }

            if (mode && typeof mode !== 'string') {
                return next(ApiError.badRequest('Invalid mode'));
            }

            if (layout && typeof layout !== 'string') {
                return next(ApiError.badRequest('Invalid layout'));
            }

            const userId = new Types.ObjectId(id);

            const filter: Record<string, any> = {
                userId,
                isRated: true,
            };

            if (since !== 'all') {
                const now = Date.now();
                const msMap: Record<Exclude<StatsPeriod, 'all'>, number> = {
                    day: 1000 * 60 * 60 * 24,
                    week: 1000 * 60 * 60 * 24 * 7,
                    month: 1000 * 60 * 60 * 24 * 30,
                };

                filter.createdAt = { $gte: new Date(now - msMap[since]) };
            }

            if (mode) filter.mode = mode;
            if (layout) filter.layout = layout;

            const sessions: TrainingStatsDoc[] = await TrainingStats.find(
                filter,
            ).lean<TrainingStatsDoc[]>();

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
                isCurrentUser: entry._id.toString() === id,
            }));

            if (!sessions.length) {
                return res.json({
                    totalSessions: 0,
                    accuracy: 100,
                    cpm: 0,
                    averageReaction: 0,
                    perCharStats: [],
                    fingerStats: [],
                    leaderboard,
                    position: null,
                    sessions: [],
                    count: 0,
                    errorsCount: 0,
                    totalTextErrorsCount: 0,
                    totalTime: 0,
                    userBestResult: null,
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
                .lean<TrainingStatsDoc>();

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

    async createLesson(
        req: AdminCreateLessonRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const {
                title,
                allowedChars,
                length,
                layout,
                cpmFor1,
                cpmFor2,
                cpmFor3,
                minAccuracy,
            } = req.body;

            if (
                typeof title !== 'string' ||
                typeof allowedChars !== 'string' ||
                typeof layout !== 'string' ||
                typeof length !== 'number' ||
                typeof cpmFor1 !== 'number' ||
                typeof cpmFor2 !== 'number' ||
                typeof cpmFor3 !== 'number' ||
                typeof minAccuracy !== 'number'
            ) {
                return next(ApiError.badRequest('Invalid lesson data'));
            }

            const lastLesson = await Lesson.findOne({ layout }).sort({
                order: -1,
            });

            const newLesson = new Lesson({
                title,
                allowedChars,
                length,
                layout,
                cpmFor1,
                cpmFor2,
                cpmFor3,
                minAccuracy,
                order: lastLesson ? lastLesson.order + 1 : 0,
                prevLessonId: lastLesson?._id ?? null,
                nextLessonId: null,
            });

            await newLesson.save();

            if (lastLesson) {
                lastLesson.nextLessonId = newLesson._id as Types.ObjectId;
                await lastLesson.save();
            }

            res.status(201).json(newLesson);
        } catch (e) {
            next(e);
        }
    },

    async updateLesson(
        req: AdminUpdateLessonRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.badRequest('Invalid lesson ID'));
            }

            const updateData = req.body;
            const lesson = await Lesson.findByIdAndUpdate(id, updateData, {
                new: true,
            });

            if (!lesson) return next(ApiError.notFound('Lesson not found'));

            res.status(200).json(lesson);
        } catch (e) {
            next(e);
        }
    },

    async deleteLesson(
        req: AdminDeleteLessonRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;

            if (!Types.ObjectId.isValid(id)) {
                return next(ApiError.badRequest('Invalid lesson ID'));
            }

            const lesson = await Lesson.findById(id);
            if (!lesson) return next(ApiError.notFound('Lesson not found'));

            const { layout, order, prevLessonId, nextLessonId } = lesson;

            if (prevLessonId) {
                await Lesson.findByIdAndUpdate(prevLessonId, {
                    nextLessonId: nextLessonId ?? null,
                });
            }

            if (nextLessonId) {
                await Lesson.findByIdAndUpdate(nextLessonId, {
                    prevLessonId: prevLessonId ?? null,
                });
            }

            await Lesson.findByIdAndDelete(id);

            await Lesson.updateMany(
                { layout, order: { $gt: order } },
                { $inc: { order: -1 } },
            );

            res.status(200).json({
                message: 'Lesson deleted and order adjusted',
            });
        } catch (e) {
            next(e);
        }
    },
    async getAdminStats(req: Request, res: Response, next: NextFunction) {
        try {
            const now = new Date();
            const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            const [
                totalUsers,
                activeUsersToday,
                activeUsersWeek,
                totalTrainings,
                totalLessonsCompleted,
                mostPopularModeAgg,
                avgAccuracyAgg,
                avgCpmAgg,
                registrationsByDayAgg,
            ] = await Promise.all([
                User.countDocuments(),
                User.countDocuments({ lastSeen: { $gte: dayAgo } }),
                User.countDocuments({ lastSeen: { $gte: weekAgo } }),
                TrainingStats.countDocuments({
                    mode: {
                        $in: [
                            TrainingMode['1000PopularWords'],
                            TrainingMode['100PopularWords'],
                            TrainingMode.Letters,
                            TrainingMode.Numbers,
                            TrainingMode.Programming,
                            TrainingMode.Symbols,
                        ],
                    },
                }),
                UserLessonProgress.countDocuments({ stars: { $gte: 1 } }),
                TrainingStats.aggregate([
                    {
                        $match: {
                            mode: {
                                $in: [
                                    TrainingMode['1000PopularWords'],
                                    TrainingMode['100PopularWords'],
                                    TrainingMode.Letters,
                                    TrainingMode.Numbers,
                                    TrainingMode.Programming,
                                    TrainingMode.Symbols,
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: '$mode',
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { count: -1 } },
                    { $limit: 1 },
                ]),
                TrainingStats.aggregate([
                    {
                        $match: {
                            mode: {
                                $in: [
                                    TrainingMode['1000PopularWords'],
                                    TrainingMode['100PopularWords'],
                                    TrainingMode.Letters,
                                    TrainingMode.Numbers,
                                    TrainingMode.Programming,
                                    TrainingMode.Symbols,
                                ],
                            },
                        },
                    },
                    {
                        $group: { _id: null, avg: { $avg: '$accuracy' } },
                    },
                ]),
                TrainingStats.aggregate([
                    {
                        $match: {
                            mode: {
                                $in: [
                                    TrainingMode['1000PopularWords'],
                                    TrainingMode['100PopularWords'],
                                    TrainingMode.Letters,
                                    TrainingMode.Numbers,
                                    TrainingMode.Programming,
                                    TrainingMode.Symbols,
                                ],
                            },
                        },
                    },
                    {
                        $group: { _id: null, avg: { $avg: '$cpm' } },
                    },
                ]),
                User.aggregate([
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: '%Y-%m-%d',
                                    date: '$createdAt',
                                },
                            },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
            ]);

            const mostPopularMode = mostPopularModeAgg[0] || null;
            mostPopularMode.mode = mostPopularMode._id;
            const avgAccuracy = avgAccuracyAgg[0]?.avg ?? null;
            const avgCpm = avgCpmAgg[0]?.avg ?? null;

            res.status(200).json({
                totalUsers,
                activeUsersToday,
                activeUsersWeek,
                totalTrainings,
                totalLessonsCompleted,
                mostPopularMode,
                avgAccuracy,
                avgCpm,
                registrationsByDay: registrationsByDayAgg,
            });
        } catch (e) {
            next(e);
        }
    },
};
