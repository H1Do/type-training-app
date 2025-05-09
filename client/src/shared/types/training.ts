import type { TrainingStats } from './stats';

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
