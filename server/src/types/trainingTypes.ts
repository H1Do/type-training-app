export enum TrainingMode {
    Letters = 'letters',
    Symbols = 'symbols',
    '100PopularWords' = '100-popular-words',
    '1000PopularWords' = '1000-popular-words',
    Programming = 'programming',
    Custom = 'custom',
    Numbers = 'numbers',
}

export type TrainingPools = Record<TrainingMode, string | string[]>;

export interface StartSessionRequest {
    mode: TrainingMode;
    sequence: string[];
}

export interface FinishSessionRequest {
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

export interface TrainingSessionDoc {
    _id: string;
    userId: string;
    mode: TrainingMode;
    sequence: string[];
    input: string[];
    events: FinishSessionRequest['events'];
    startedAt: number;
    finishedAt?: number;
}
