import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { adminController } from './adminController';
import { ApiError } from '@/errors/ApiError';

vi.mock('@/models/User', () => {
    const find = vi.fn();
    const countDocuments = vi.fn();
    const findById = vi.fn();
    const findOne = vi.fn();
    const aggregate = vi.fn();
    return {
        User: {
            find,
            countDocuments,
            findById,
            findOne,
            aggregate,
        },
    };
});

vi.mock('@/models/Lesson', () => {
    const find = vi.fn();
    const findById = vi.fn();
    const findByIdAndUpdate = vi.fn();
    const findByIdAndDelete = vi.fn();
    const findOne = vi.fn();
    const updateMany = vi.fn();
    const aggregate = vi.fn();
    const Lesson = function (this: any, data: any) {
        Object.assign(this, data);
        this.save = vi.fn().mockResolvedValue(this);
    } as any;
    Lesson.find = find;
    Lesson.findById = findById;
    Lesson.findByIdAndUpdate = findByIdAndUpdate;
    Lesson.findByIdAndDelete = findByIdAndDelete;
    Lesson.findOne = findOne;
    Lesson.updateMany = updateMany;
    Lesson.aggregate = aggregate;
    return {
        Lesson,
        UserLessonProgress: {
            countDocuments: vi.fn(),
        },
    };
});

vi.mock;
vi.mock('@/models/TrainingStats', () => {
    const find = vi.fn();
    const countDocuments = vi.fn();
    const findOne = vi.fn();
    const aggregate = vi.fn();
    return {
        TrainingStats: {
            find,
            countDocuments,
            findOne,
            aggregate,
        },
    };
});

vi.mock('./statsController', () => ({
    mergeFingerStats: vi.fn().mockReturnValue([]),
    mergePerCharStat: vi.fn().mockReturnValue([]),
}));

import { User } from '@/models/User';
import { Lesson, UserLessonProgress } from '@/models/Lesson';
import { TrainingStats } from '@/models/TrainingStats';
import { mergeFingerStats, mergePerCharStat } from './statsController';

describe('adminController', () => {
    let res: Partial<Response>;
    let next: NextFunction;

    const createQuery = (data: any) => {
        return {
            select: vi.fn().mockReturnThis(),
            sort: vi.fn().mockReturnThis(),
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            lean: vi.fn().mockResolvedValue(data),
        };
    };

    beforeEach(() => {
        vi.clearAllMocks();
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next = vi.fn();
    });

    describe('getAllUsers', () => {
        it('should return list of users when query present', async () => {
            const usersData = [
                {
                    _id: '1',
                    username: 'user1',
                    email: 'e1',
                    isBlocked: false,
                    isVerified: true,
                },
            ];
            const mockFindQuery = createQuery(usersData);
            (User.find as Mock).mockReturnValue(mockFindQuery);
            (User.countDocuments as Mock).mockResolvedValue(1);
            const req: any = { query: { q: 'user', limit: '10', offset: '0' } };
            await adminController.getAllUsers(req, res as Response, next);
            expect(User.find).toHaveBeenCalledWith({
                username: { $regex: 'user', $options: 'i' },
            });
            expect(User.countDocuments).toHaveBeenCalledWith({
                username: { $regex: 'user', $options: 'i' },
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                users: [
                    {
                        id: '1',
                        username: 'user1',
                        email: 'e1',
                        isBlocked: false,
                        isVerified: true,
                    },
                ],
                total: 1,
                limit: 10,
                offset: 0,
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return list of users when no query', async () => {
            const usersData = [
                {
                    _id: '2',
                    username: 'another',
                    email: 'a@e.com',
                    isBlocked: true,
                    isVerified: false,
                },
            ];
            const mockFindQuery = createQuery(usersData);
            (User.find as Mock).mockReturnValue(mockFindQuery);
            (User.countDocuments as Mock).mockResolvedValue(1);
            const req: any = { query: { limit: '5', offset: '2' } };
            await adminController.getAllUsers(req, res as Response, next);
            expect(User.find).toHaveBeenCalledWith({});
            expect(User.countDocuments).toHaveBeenCalledWith({});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                users: [
                    {
                        id: '2',
                        username: 'another',
                        email: 'a@e.com',
                        isBlocked: true,
                        isVerified: false,
                    },
                ],
                total: 1,
                limit: 5,
                offset: 2,
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next on error', async () => {
            (User.find as Mock).mockImplementation(() => {
                throw new Error('DB error');
            });
            const req: any = { query: {} };
            await adminController.getAllUsers(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('blockUser', () => {
        it('should block a valid user', async () => {
            const validId = '507f1f77bcf86cd799439011';
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(true);
            const mockUser: any = {
                _id: validId,
                isBlocked: false,
                save: vi.fn(),
            };
            (User.findById as Mock).mockResolvedValue(mockUser);
            const req: any = {
                params: { id: validId },
                user: { id: 'anotherId' },
                t: (k: string) => k,
            };
            await adminController.blockUser(req, res as Response, next);
            expect(User.findById).toHaveBeenCalledWith(validId);
            expect(mockUser.isBlocked).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'messages.user_blocked',
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return error if id invalid', async () => {
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(false);
            const req: any = { params: { id: 'invalid' }, t: (k: string) => k };
            await adminController.blockUser(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(400);
        });

        it('should not allow blocking self', async () => {
            const sameId = '507f1f77bcf86cd799439011';
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(true);
            const req: any = {
                params: { id: sameId },
                user: { id: sameId },
                t: (k: string) => k,
            };
            await adminController.blockUser(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(400);
        });

        it('should return error if user not found', async () => {
            const validId = '507f1f77bcf86cd799439011';
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(true);
            (User.findById as Mock).mockResolvedValue(null);
            const req: any = {
                params: { id: validId },
                user: { id: 'other' },
                t: (k: string) => k,
            };
            await adminController.blockUser(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(404);
        });
    });

    describe('unblockUser', () => {
        it('should unblock a valid user', async () => {
            const validId = '507f1f77bcf86cd799439011';
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(true);
            const mockUser: any = {
                _id: validId,
                isBlocked: true,
                save: vi.fn(),
            };
            (User.findById as Mock).mockResolvedValue(mockUser);
            const req: any = { params: { id: validId }, t: (k: string) => k };
            await adminController.unblockUser(req, res as Response, next);
            expect(User.findById).toHaveBeenCalledWith(validId);
            expect(mockUser.isBlocked).toBe(false);
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'messages.user_unblocked',
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return error if id invalid', async () => {
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(false);
            const req: any = { params: { id: 'invalid' }, t: (k: string) => k };
            await adminController.unblockUser(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(400);
        });

        it('should return error if user not found', async () => {
            const validId = '507f1f77bcf86cd799439011';
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(true);
            (User.findById as Mock).mockResolvedValue(null);
            const req: any = { params: { id: validId }, t: (k: string) => k };
            await adminController.unblockUser(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(404);
        });
    });

    describe('getAllLessons', () => {
        it('should return list of lessons', async () => {
            const lessonsData = [
                {
                    _id: 'L1',
                    title: 'T1',
                    titleRu: 'TR1',
                    allowedChars: 'abc',
                    layout: 'qwe',
                    order: 0,
                    length: 10,
                    cpmFor1: 30,
                    cpmFor2: 40,
                    cpmFor3: 50,
                    minAccuracy: 90,
                    prevLessonId: null,
                    nextLessonId: 'L2',
                },
            ];
            (Lesson.find as Mock).mockReturnValue({
                sort: vi.fn().mockReturnThis(),
                lean: vi.fn().mockResolvedValue(lessonsData),
            });
            const req: any = {};
            await adminController.getAllLessons(req, res as Response, next);
            expect(Lesson.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                {
                    id: 'L1',
                    title: 'T1',
                    titleRu: 'TR1',
                    allowedChars: 'abc',
                    layout: 'qwe',
                    order: 0,
                    length: 10,
                    cpmFor1: 30,
                    cpmFor2: 40,
                    cpmFor3: 50,
                    minAccuracy: 90,
                    prevLessonId: null,
                    nextLessonId: 'L2',
                },
            ]);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next on error', async () => {
            (Lesson.find as Mock).mockImplementation(() => {
                throw new Error('DB fail');
            });
            const req: any = {};
            await adminController.getAllLessons(req, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('updateLesson', () => {
        it('should update lesson successfully', async () => {
            const lessonId = '507f1f77bcf86cd799439011';
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(true);
            const updatedLesson = { _id: lessonId, title: 'NewTitle' };
            (Lesson.findByIdAndUpdate as Mock).mockResolvedValue(updatedLesson);
            const req: any = {
                params: { id: lessonId },
                body: { title: 'NewTitle' },
            };
            await adminController.updateLesson(req, res as Response, next);
            expect(Lesson.findByIdAndUpdate).toHaveBeenCalledWith(
                lessonId,
                { title: 'NewTitle' },
                { new: true },
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedLesson);
            expect(next).not.toHaveBeenCalled();
        });

        it('should return error if id invalid', async () => {
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(false);
            const req: any = { params: { id: 'invalid' }, body: {} };
            await adminController.updateLesson(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(400);
        });

        it('should return error if lesson not found', async () => {
            const lessonId = '507f1f77bcf86cd799439011';
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(true);
            (Lesson.findByIdAndUpdate as Mock).mockResolvedValue(null);
            const req: any = {
                params: { id: lessonId },
                body: { title: 'X' },
                t: (k: string) => k,
            };
            await adminController.updateLesson(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(404);
        });
    });

    describe('deleteLesson', () => {
        it('should delete lesson and adjust order', async () => {
            const lessonId = '507f1f77bcf86cd799439011';
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(true);
            const mockLesson: any = {
                _id: lessonId,
                layout: 'layout1',
                order: 2,
                prevLessonId: 'P1',
                nextLessonId: 'N1',
            };
            (Lesson.findById as Mock).mockResolvedValue(mockLesson);
            (Lesson.findByIdAndUpdate as Mock).mockResolvedValue({});
            (Lesson.findByIdAndDelete as Mock).mockResolvedValue({});
            (Lesson.updateMany as Mock).mockResolvedValue({});
            const req: any = { params: { id: lessonId }, t: (k: string) => k };
            await adminController.deleteLesson(req, res as Response, next);
            expect(Lesson.findById).toHaveBeenCalledWith(lessonId);
            expect(Lesson.findByIdAndUpdate).toHaveBeenCalledWith('P1', {
                nextLessonId: 'N1',
            });
            expect(Lesson.findByIdAndUpdate).toHaveBeenCalledWith('N1', {
                prevLessonId: 'P1',
            });
            expect(Lesson.findByIdAndDelete).toHaveBeenCalledWith(lessonId);
            expect(Lesson.updateMany).toHaveBeenCalledWith(
                { layout: 'layout1', order: { $gt: 2 } },
                { $inc: { order: -1 } },
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'messages.lesson_deleted',
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return error if id invalid', async () => {
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(false);
            const req: any = { params: { id: 'invalid' }, t: (k: string) => k };
            await adminController.deleteLesson(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(400);
        });

        it('should return error if lesson not found', async () => {
            const lessonId = '507f1f77bcf86cd799439011';
            (Types.ObjectId.isValid as any) = vi.fn().mockReturnValue(true);
            (Lesson.findById as Mock).mockResolvedValue(null);
            const req: any = { params: { id: lessonId }, t: (k: string) => k };
            await adminController.deleteLesson(req, res as Response, next);
            expect(next).toHaveBeenCalled();
            const err = (next as Mock).mock.calls[0][0] as ApiError;
            expect(err.status).toBe(404);
        });
    });

    describe('getAdminStats', () => {
        it('should return aggregated admin stats', async () => {
            (User.countDocuments as Mock)
                .mockResolvedValueOnce(50)
                .mockResolvedValueOnce(10)
                .mockResolvedValueOnce(20);
            (TrainingStats.countDocuments as Mock).mockResolvedValue(100);
            (UserLessonProgress.countDocuments as Mock).mockResolvedValue(30);
            (TrainingStats.aggregate as Mock)
                .mockResolvedValueOnce([{ _id: 'mode1', count: 40 }])
                .mockResolvedValueOnce([{ avg: 85 }])
                .mockResolvedValueOnce([{ avg: 120 }]);
            (User.aggregate as Mock).mockResolvedValue([
                { _id: '2025-06-01', count: 5 },
                { _id: '2025-06-02', count: 7 },
            ]);
            const req: any = {};
            await adminController.getAdminStats(req, res as Response, next);
            expect(User.countDocuments).toHaveBeenCalledTimes(3);
            expect(TrainingStats.countDocuments).toHaveBeenCalled();
            expect(UserLessonProgress.countDocuments).toHaveBeenCalled();
            expect(TrainingStats.aggregate).toHaveBeenCalledTimes(3);
            expect(User.aggregate).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                totalUsers: 50,
                activeUsersToday: 10,
                activeUsersWeek: 20,
                totalTrainings: 100,
                totalLessonsCompleted: 30,
                mostPopularMode: { _id: 'mode1', count: 40, mode: 'mode1' },
                avgAccuracy: 85,
                avgCpm: 120,
                registrationsByDay: [
                    { _id: '2025-06-01', count: 5 },
                    { _id: '2025-06-02', count: 7 },
                ],
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next on error', async () => {
            (User.countDocuments as Mock).mockImplementation(() => {
                throw new Error('DB fail');
            });
            const req: any = {};
            await adminController.getAdminStats(req, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
