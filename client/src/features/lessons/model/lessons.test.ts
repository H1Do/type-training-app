/* eslint-disable @typescript-eslint/no-explicit-any */
import { setActivePinia, createPinia } from 'pinia';
import { useLessonsStore } from './lessons';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { lessonDetailsMock, lessonsMock } from '@/shared/tests/mocks';

const mockLessonsApi = {
    getLessons: vi.fn().mockResolvedValue(lessonsMock),
    getLesson: vi.fn().mockResolvedValue(lessonDetailsMock),
    finishLesson: vi.fn().mockResolvedValue({
        stats: {},
        stars: 3,
        exp: { current: 100, level: 2 },
        message: 'Great job!',
    }),
};

const mockMessageService = {
    error: vi.fn(),
};

const mockModalService = {
    open: vi.fn(),
};

const mockT = (key: string) => key;

vi.mock('@/entities/user', () => ({
    useUserStore: () => ({
        level: 1,
        setLevel: vi.fn(),
        setExp: vi.fn(),
    }),
}));

describe('useLessonsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('fetches lessons successfully', async () => {
        const store = useLessonsStore();
        store.lessonsApi = mockLessonsApi as any;
        store.messageService = mockMessageService as any;
        store.t = mockT;

        await store.fetchLessons();

        expect(store.lessons).toEqual(lessonsMock);
        expect(store.error).toBeNull();
    });

    it('handles fetchLessons error', async () => {
        const store = useLessonsStore();
        store.lessonsApi = {
            getLessons: vi.fn().mockRejectedValue(new Error()),
        } as any;
        store.messageService = mockMessageService as any;
        store.t = mockT;

        await store.fetchLessons();

        expect(store.error).toBe('errors.failed_to_fetch');
        expect(mockMessageService.error).toHaveBeenCalled();
    });

    it('fetches current lesson by ID', async () => {
        const store = useLessonsStore();
        store.lessonsApi = mockLessonsApi as any;
        store.messageService = mockMessageService as any;
        store.t = mockT;

        store.setLessonId('1');
        await store.fetchLesson();

        expect(store.currentLesson).toEqual(lessonDetailsMock);
        expect(store.error).toBeNull();
    });

    it('handles fetchLesson error', async () => {
        const store = useLessonsStore();
        store.lessonsApi = {
            getLesson: vi.fn().mockRejectedValue(new Error()),
        } as any;
        store.messageService = mockMessageService as any;
        store.t = mockT;

        store.setLessonId('123');
        await store.fetchLesson();

        expect(store.currentLesson).toBeNull();
        expect(store.error).toBe('errors.lesson_not_found');
        expect(mockMessageService.error).toHaveBeenCalled();
    });

    it('calls finishLesson after last symbol', async () => {
        const store = useLessonsStore();
        store.lessonsApi = mockLessonsApi as any;
        store.messageService = mockMessageService as any;
        store.modalService = mockModalService as any;
        store.t = mockT;

        store.currentLesson = {
            ...lessonDetailsMock,
            sequence: ['a'],
        };
        store.startedAt = Date.now() - 1000;

        await store.processKey('a', null);

        expect(store.finishedAt).not.toBeNull();
        expect(mockLessonsApi.finishLesson).toHaveBeenCalled();
        expect(mockModalService.open).toHaveBeenCalled();
    });

    it('computes currentIndex, currentSymbol and isFinished', () => {
        const store = useLessonsStore();
        store.currentLesson = {
            ...lessonDetailsMock,
            sequence: ['a', 'b', 'c'],
        };
        store.input = ['a', 'b'];

        expect(store.currentIndex).toBe(2);
        expect(store.currentSymbol).toBe('c');
        expect(store.isFinished).toBe(false);

        store.input.push('c');
        expect(store.isFinished).toBe(true);
    });

    it('computes undoCount', () => {
        const store = useLessonsStore();
        store.events = [
            {
                type: 'input',
                actual: 'a',
                expected: 'a',
                time: 0,
                timestamp: 0,
                finger: null,
            },
            { type: 'backspace', time: 10, timestamp: 10, finger: null },
            { type: 'backspace', time: 20, timestamp: 30, finger: null },
        ];

        expect(store.undoCount).toBe(2);
    });

    it('computes duration', () => {
        const store = useLessonsStore();
        const now = Date.now();
        store.startedAt = now - 2000;
        store.finishedAt = now;

        expect(store.duration).toBeLessThanOrEqual(2000);
    });

    it('computes stars', () => {
        const store = useLessonsStore();
        store.lessons = [lessonsMock[0], lessonsMock[0], lessonsMock[0]];

        expect(store.getTotalStars).toBe(9);
        expect(store.getEarnedStars).toBe(6);
    });

    it('calls fetchLesson if currentLesson is missing', async () => {
        const store = useLessonsStore();
        const fetchLesson = vi.fn();
        store.fetchLesson = fetchLesson;
        store.currentLesson = null;

        await store.processKey('a', null);

        expect(fetchLesson).toHaveBeenCalled();
    });

    it('adds backspace event when backspace is called', () => {
        const store = useLessonsStore();
        store.input = ['a', 'b'];
        const now = performance.now();
        vi.spyOn(performance, 'now').mockReturnValue(now);

        store.backspace();

        expect(store.input).toEqual(['a']);
        expect(store.events.at(-1)).toMatchObject({
            type: 'backspace',
            timestamp: now,
            finger: null,
        });
    });

    it('resets state properly', () => {
        const store = useLessonsStore();
        store.input = ['a'];
        store.events = [
            {
                type: 'input',
                actual: 'a',
                expected: 'a',
                time: 0,
                timestamp: 0,
                finger: null,
            },
        ];
        store.startedAt = 100;
        store.finishedAt = 200;
        store.lastInputTimestamp = 150;

        store.reset();

        expect(store.input).toEqual([]);
        expect(store.events).toEqual([]);
        expect(store.startedAt).toBe(0);
        expect(store.finishedAt).toBeNull();
        expect(store.lastInputTimestamp).toBe(0);
    });
});
