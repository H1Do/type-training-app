import { Types } from 'mongoose';
import { Layout } from './keyboardTypes';
import { TrainingMode } from './trainingTypes';

export interface PerCharStat {
    char: string;
    count: number;
    errorsCount: number;
    totalTime: number;
    averageReaction: number;
    accuracy: number;
}

export interface FingerStat {
    finger: string;
    chars: string[];
    count: number;
    errorsCount: number;
    totalTime: number;
    averageReaction: number;
    accuracy: number;
}

export interface TrainingStatsDoc {
    _id: Types.ObjectId;
    sessionId: Types.ObjectId;
    userId: Types.ObjectId;
    mode: TrainingMode;
    layout: Layout;
    accuracy: number;
    count: number;
    errorsCount: number;
    corrections: number;
    averageReaction: number;
    cpm: number;
    totalTime: number;
    perCharStats: PerCharStat[];
    fingerStats: FingerStat[];
    isRated: boolean;
    isLeaderboardEligible: boolean;
    createdAt: Date;
}

export type StatsPeriod = 'day' | 'week' | 'month' | 'all';
