import type { Lesson } from './lessons';
import type { TrainingMode } from './training';

export interface AdminUserDto {
    id: string;
    username: string;
    email: string;
    isBlocked: boolean;
    isVerified: boolean;
}

export interface AdminGetUsersResponse {
    users: AdminUserDto[];
    total: number;
    limit: number;
    offset: number;
}

export type AdminGetLessonsResponse = Lesson[];

export interface AdminStatsResponse {
    totalUsers: number;
    activeUsersToday: number;
    activeUsersWeek: number;
    totalTrainings: number;
    totalLessonsCompleted: number;
    mostPopularMode: {
        mode: TrainingMode;
        count: number;
    } | null;
    avgAccuracy: number | null;
    avgCpm: number | null;
    registrationsByDay: {
        _id: string;
        count: number;
    }[];
}

export type AdminLesson = Omit<Lesson, 'prevLessonId' | 'nextLessonId'>;
