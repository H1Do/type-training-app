import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LessonsApi } from './lessonsApi';
import type { HttpClient } from './httpClient';
import {
    type LessonProgress,
    type LessonDetails,
    type LessonResult,
    type CompleteLessonResponse,
    Layout,
} from '../types';
import { lessonsMock, lessonStatsMock } from '../tests/mocks';

const mockHttpClient = {
    get: vi.fn(),
    post: vi.fn(),
} as unknown as HttpClient;

let api: LessonsApi;

beforeEach(() => {
    vi.clearAllMocks();
    api = new LessonsApi(mockHttpClient);
});

describe('LessonsApi', () => {
    it('getLessons returns lesson list', async () => {
        const lessons: LessonProgress[] = lessonsMock;
        mockHttpClient.get = vi.fn().mockResolvedValue({ data: lessons });

        const result = await api.getLessons();
        expect(result).toEqual(lessons);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/lessons');
    });

    it('getLesson returns lesson details', async () => {
        const lesson: LessonDetails = {
            id: '1',
            title: 'Lesson 1',
            titleRu: 'Урок 1',
            sequence: ['a', 'b', 'c'],
            layout: Layout.QWERTY,
            nextLessonId: '2',
            prevLessonId: undefined,
        };
        mockHttpClient.get = vi.fn().mockResolvedValue({ data: lesson });

        const result = await api.getLesson('1');
        expect(result).toEqual(lesson);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/lessons/1');
    });

    it('finishLesson posts result and returns response', async () => {
        const result: LessonResult = {
            lessonId: '1',
            events: [],
            input: ['a', 'b', 'c'],
            sequence: ['a', 'b', 'c'],
            startedAt: Date.now(),
            finishedAt: Date.now() + 1000,
        };
        const response: CompleteLessonResponse = {
            message: 'Lesson completed',
            stars: 3,
            exp: { current: 50, earned: 100, level: 1, required: 200 },
            stats: lessonStatsMock,
        };
        mockHttpClient.post = vi.fn().mockResolvedValue({ data: response });

        const res = await api.finishLesson(result);
        expect(res).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/api/lessons/1/complete',
            result,
        );
    });
});
