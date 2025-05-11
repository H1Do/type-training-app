import type { Layout } from './layout';
import type { LessonDetails } from './lessons';
import type { TrainingMode } from './training';

export type StatsPeriod = 'day' | 'week' | 'month' | 'all';

export interface PerItemStat {
    accuracy: number;
    count: number;
    errorsCount: number;
    totalTime: number;
    averageReaction: number;
}

export type PerItemStatMetric = Exclude<
    keyof PerItemStat,
    'count' | 'totalTime'
>;

export interface PerCharStat extends PerItemStat {
    char: string;
}

export interface FingerStat extends PerItemStat {
    finger: string;
    chars: string[];
}

export interface TrainingStats {
    accuracy: number;
    averageReaction: number;
    cpm: number;
    totalTime: number;
    count: number;
    perCharStats: PerCharStat[];
    fingerStats: FingerStat[];
    corrections: number;
    errorsCount: number;
    textErrorsCount: number;
    isRated: boolean;
    isLeaderboardEligible: boolean;
    mode: TrainingMode;
    layout: Layout;
}

export interface LessonsStats {
    accuracy: number;
    averageReaction: number;
    cpm: number;
    totalTime: number;
    count: number;
    perCharStats: PerCharStat[];
    fingerStats: FingerStat[];
    corrections: number;
    errorsCount: number;
    textErrorsCount: number;
    lesson: LessonDetails;
    layout: Layout;
}

export type StatMetric = keyof SessionDto;

export interface SessionDto {
    accuracy: number;
    averageReaction: number;
    cpm: number;
    count: number;
    errorsCount: number;
    textErrorsCount: number;
    errorsRate: number;
    createdAt: Date;
}

export interface LeaderboardEntry {
    userId: string;
    username: string;
    cpm: number;
    accuracy: number;
    isCurrentUser: boolean;
}

export interface UserBestResult {
    _id: string;
    cpm: number;
    accuracy: number;
}

export interface StatsResponse {
    totalSessions: number;
    accuracy: number;
    cpm: number;
    count: number;
    errorsCount: number;
    textErrorsCount: number;
    totalTime: number;
    averageReaction: number;
    perCharStats: PerCharStat[];
    fingerStats: FingerStat[];
    leaderboard: LeaderboardEntry[];
    sessions: SessionDto[];
    position: number | null;
    userBestResult?: UserBestResult | null;
}
