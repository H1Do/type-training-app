import { Types } from 'mongoose';
import { Finger, Layout } from './keyboardTypes';

export enum TrainingMode {
    Letters = 'letters',
    Symbols = 'symbols',
    '100PopularWords' = '100PopularWords',
    '1000PopularWords' = '1000PopularWords',
    Programming = 'programming',
    Custom = 'custom',
    Numbers = 'numbers',
}

export type TrainingPools = Record<TrainingMode, string | string[]>;

export interface StartSessionRequest {
    mode: TrainingMode;
    layout: Layout;
    items?: string;
    length?: number;
    isWords?: boolean;
}

export interface InputEventRecord {
    type: 'input' | 'backspace';
    actual?: string;
    expected?: string;
    time: number;
    timestamp: number;
    finger: Finger | null;
}

export interface FinishSessionRequest {
    startedAt: number;
    finishedAt: number;
    input: string[];
    events: InputEventRecord[];
    layout?: Layout;
    mode?: TrainingMode;
}

export interface TrainingSessionDoc {
    _id: string;
    userId: string;
    mode: TrainingMode;
    layout: Layout;
    sequence: string[];
    input: string[];
    events: InputEventRecord[];
    startedAt: number;
    finishedAt?: number;
    statsId?: Types.ObjectId;
}
