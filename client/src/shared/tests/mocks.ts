import {
    Layout,
    TrainingMode,
    type AdminLesson,
    type LeaderboardEntry,
    type LessonDetails,
    type LessonProgress,
    type LessonsStats,
    type SessionDto,
    type TopUser,
    type TrainingStats,
} from '@/shared/types';
import type { ExpReward } from '@/shared/types/level';

export const statsMock: TrainingStats = {
    accuracy: 95,
    count: 100,
    errorsCount: 5,
    corrections: 2,
    cpm: 120,
    averageReaction: 200,
    fingerStats: [
        {
            finger: 'index',
            chars: ['a', 's', 'd'],
            accuracy: 95,
            count: 50,
            errorsCount: 2,
            totalTime: 10000,
            averageReaction: 200,
        },
    ],
    perCharStats: [
        {
            char: 'a',
            accuracy: 95,
            count: 50,
            errorsCount: 2,
            totalTime: 10000,
            averageReaction: 200,
        },
    ],
    totalTime: 120000,
    isRated: true,
    isLeaderboardEligible: true,
    mode: TrainingMode['100PopularWords'],
    layout: Layout.QWERTY,
    textErrorsCount: 3,
};

export const expMock: ExpReward = {
    current: 100,
    earned: 50,
    level: 2,
    required: 200,
};

export const leaderboardMock: LeaderboardEntry[] = [
    {
        accuracy: 95,
        cpm: 120,
        isCurrentUser: true,
        userId: 'abc123',
        username: 'John Doe',
    },
];

export const sessionsMock: SessionDto[] = [
    {
        accuracy: 95,
        count: 100,
        errorsCount: 5,
        cpm: 120,
        averageReaction: 200,
        createdAt: new Date(),
        errorsRate: 0.05,
        textErrorsCount: 3,
    },
];

export const leaderboardLevelMock: TopUser[] = [
    {
        exp: 150,
        level: 3,
        isCurrentUser: true,
        userId: 'user123',
        username: 'Jane Doe',
    },
];

export const lessonsMock: LessonProgress[] = [
    {
        id: '1',
        title: 'Lesson 1',
        titleRu: 'Урок 1',
        allowedChars: 'abc',
        layout: Layout.QWERTY,
        length: 10,
        cpmFor1: 100,
        cpmFor2: 120,
        cpmFor3: 140,
        minAccuracy: 90,
        order: 1,
        stars: 2,
        nextLessonId: '2',
        prevLessonId: undefined,
    },
];

export const lessonDetailsMock: LessonDetails = {
    id: '1',
    title: 'Lesson 1',
    titleRu: 'Урок 1',
    sequence: ['a', 'b', 'c'],
    layout: Layout.QWERTY,
    nextLessonId: '2',
    prevLessonId: undefined,
};

export const lessonStatsMock: LessonsStats = {
    accuracy: 95,
    count: 100,
    errorsCount: 5,
    corrections: 2,
    cpm: 120,
    averageReaction: 200,
    fingerStats: [
        {
            finger: 'index',
            chars: ['a', 's', 'd'],
            accuracy: 95,
            count: 50,
            errorsCount: 2,
            totalTime: 10000,
            averageReaction: 200,
        },
    ],
    perCharStats: [
        {
            char: 'a',
            accuracy: 95,
            count: 50,
            errorsCount: 2,
            totalTime: 10000,
            averageReaction: 200,
        },
    ],
    totalTime: 120000,
    layout: Layout.QWERTY,
    textErrorsCount: 3,
    lesson: lessonDetailsMock,
};

export const adminLessonMock: Omit<AdminLesson, 'id'> = {
    title: 'New lesson',
    titleRu: 'Новый урок',
    allowedChars: 'abc',
    order: 1,
    cpmFor1: 100,
    cpmFor2: 200,
    cpmFor3: 300,
    layout: Layout.QWERTY,
    length: 50,
    minAccuracy: 0.8,
};
