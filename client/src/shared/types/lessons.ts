import type { Layout } from './layout';

export interface Lesson {
    id: string;
    title: string;
    layout: Layout;
    allowedChars: string;
    length: number;
    cpmFor1: number;
    cpmFor2: number;
    cpmFor3: number;
    minAccuracy: number;
    order: number;
}

export interface LessonProgress extends Lesson {
    stars: number;
}

export interface LessonDetails {
    id: string;
    title: string;
    layout: Layout;
    sequence: string[];
}

export interface CompleteLessonResult {
    stars: number;
    message: string;
}
