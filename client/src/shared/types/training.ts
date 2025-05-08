import type { Layout } from './layout';

export interface TrainingSession {
    id: string;
    sequence: string[];
}

export interface TrainingResult {
    sessionId: string;
    startedAt: number;
    finishedAt: number;
    input: string[];
    events: {
        type: 'input' | 'backspace';
        actual?: string;
        expected?: string;
        time: number;
        timestamp: number;
    }[];
}

export interface PerCharStat {
    char: string;
    accuracy: number;
    count: number;
    errorsCount: number;
    totalTime: number;
    averageTime: number;
}

export interface TrainingStats {
    accuracy: number;
    averageReaction: number;
    cpm: number;
    duration: number;
    perChar: PerCharStat[];
    corrections: number;
    errorsCount: number;
    isRated: boolean;
    isLeaderboardEligible: boolean;
    mode: TrainingMode;
    layout: Layout;
}

export interface TrainingFinishResponse {
    message: string;
    stats: TrainingStats;
}

export enum TrainingMode {
    Letters = 'letters',
    Symbols = 'symbols',
    '100PopularWords' = '100PopularWords',
    '1000PopularWords' = '1000PopularWords',
    Programming = 'programming',
    Custom = 'custom',
    Numbers = 'numbers',
}
