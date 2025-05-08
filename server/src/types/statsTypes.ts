import { Types } from 'mongoose';
import { Layout } from './keyboardTypes';
import { TrainingMode } from './trainingTypes';

export interface PerChar {
    char: string;
    count: number;
    errorsCount: number;
    totalTime: number;
    averageTime: number;
    accuracy: number;
}

export interface FingerStat {
    finger: string;
    chars: string[];
    count: number;
    errorsCount: number;
    totalTime: number;
    averageTime: number;
    accuracy: number;
}

export interface TrainingStatsDoc {
    _id: Types.ObjectId;
    sessionId: Types.ObjectId;
    userId: Types.ObjectId;
    mode: TrainingMode;
    layout: Layout;
    accuracy: number;
    errorsCount: number;
    corrections: number;
    averageReaction: number;
    cpm: number;
    duration: number;
    perChar: PerChar[];
    fingerStats: FingerStat[];
    isRated: boolean;
    isLeaderboardEligible: boolean;
    createdAt: Date;
}
