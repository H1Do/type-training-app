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

export interface TrainingStats {
    accuracy: number;
    averageReaction: number;
    cpm: number;
    duration: number;
}

export interface TrainingFinishResponse {
    message: string;
    stats: TrainingStats;
}

export enum TrainingMode {
    Letters = 'letters',
    Symbols = 'symbols',
    PopularWords = 'popular-words',
    Custom = 'custom',
    Numbers = 'numbers',
}
