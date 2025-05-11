import type { Finger } from './layout';

export interface InputEventRecord {
    type: 'input' | 'backspace';
    actual?: string;
    expected?: string;
    time: number;
    timestamp: number;
    finger: Finger | null;
}
