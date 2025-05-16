import type { InputEventRecord } from './keyboard';
import type { Layout } from './layout';
import type { ExpReward } from './level';
import type { LessonsStats } from './stats';

export interface Lesson {
    id: string;
    title: string;
    titleRu: string;
    layout: Layout;
    allowedChars: string;
    length: number;
    cpmFor1: number;
    cpmFor2: number;
    cpmFor3: number;
    minAccuracy: number;
    order: number;
    nextLessonId?: string;
    prevLessonId?: string;
}

export interface LessonProgress extends Lesson {
    stars: number;
}

export interface LessonDetails {
    id: string;
    title: string;
    titleRu: string;
    layout: Layout;
    sequence: string[];
    prevLessonId?: string;
    nextLessonId?: string;
}

export interface LessonResult {
    lessonId: string;
    startedAt: number;
    finishedAt: number;
    input: string[];
    events: InputEventRecord[];
    sequence: string[];
}

export interface CompleteLessonResponse {
    message: string;
    stats: LessonsStats;
    stars: number;
    exp: ExpReward | null;
}
