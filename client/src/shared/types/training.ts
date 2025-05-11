import type { InputEventRecord } from './keyboard';
import type { Layout } from './layout';
import type { ExpReward } from './level';
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
    events: InputEventRecord[];
    layout: Layout;
    mode: TrainingMode;
    sequence: string[];
}

export interface TrainingFinishResponse {
    message: string;
    stats: TrainingStats;
    exp: ExpReward | null;
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
