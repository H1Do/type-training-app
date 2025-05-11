import type {
    Finger,
    InputEventRecord,
    LessonDetails,
    LessonProgress,
} from '@/shared/types';
import { defineStore } from 'pinia';
import LessonSummaryModal from '../ui/LessonSummaryModal.vue';
import { useUserStore } from '@/entities/user';

export const useLessonsStore = defineStore('lessons', {
    state: () => ({
        lessons: [] as LessonProgress[],
        currentLessonId: null as string | null,
        currentLesson: null as LessonDetails | null,
        loading: false,
        error: null as string | null,
        startedAt: 0 as number,
        finishedAt: null as number | null,
        input: [] as string[],
        events: [] as InputEventRecord[],
        lastInputTimestamp: 0,
    }),

    getters: {
        currentIndex: (state) => state.input.length,

        currentSymbol: (state) =>
            state.currentLesson?.sequence[state.input.length] ?? '',

        isFinished: (state) =>
            !!state.currentLesson &&
            state.input.length >= state.currentLesson.sequence.length,

        undoCount: (state) =>
            state.events.filter((e) => e.type === 'backspace').length,

        duration: (state) => {
            if (!state.startedAt) return 0;
            return (state.finishedAt ?? Date.now()) - state.startedAt;
        },
    },

    actions: {
        setLessonId(lessonId: string) {
            this.currentLessonId = lessonId;
        },

        async fetchLessons() {
            this.loading = true;
            try {
                this.lessons = await this.lessonsApi.getLessons();
                this.error = null;
            } catch {
                const message =
                    this.t('errors.failed_to_fetch') ??
                    'Failed to load lessons';
                this.error = message;
                this.messageService.error(message);
            } finally {
                this.loading = false;
            }
        },

        async fetchLesson() {
            this.reset();
            if (!this.currentLessonId) return;

            this.loading = true;
            try {
                this.currentLesson = await this.lessonsApi.getLesson(
                    this.currentLessonId,
                );
                this.error = null;
            } catch {
                const message =
                    this.t('errors.lesson_not_found') ?? 'Lesson not found';
                this.error = message;
                this.messageService.error(message);
            } finally {
                this.loading = false;
            }
        },

        async finish() {
            if (!this.currentLesson) return;

            const result = {
                lessonId: this.currentLesson.id,
                startedAt: this.startedAt,
                finishedAt: Date.now(),
                input: this.input,
                events: this.events,
                sequence: this.currentLesson.sequence,
            };

            this.finishedAt = result.finishedAt;

            try {
                const data = await this.lessonsApi.finishLesson(result);

                let isLevelUp = false;

                if (data.exp) {
                    const userStore = useUserStore();

                    isLevelUp = userStore.level < data.exp.level;

                    userStore.setLevel(data.exp.level);
                    userStore.setExp(data.exp.current);
                }

                await this.modalService.open(LessonSummaryModal, {
                    stats: data.stats,
                    stars: data.stars,
                    exp: data.exp,
                    isLevelUp,
                });
            } catch {
                const message =
                    this.t('messages.lesson_completion_failed') ??
                    'Lesson completion failed';
                this.messageService.error(message);
            }
        },

        async processKey(inputChar: string, finger: Finger | null) {
            if (this.isFinished) return;

            const now = performance.now();

            if (!this.currentLesson) {
                this.fetchLesson();
                return;
            }

            if (this.startedAt === 0) {
                this.startedAt = Date.now();
            }

            const expected =
                this.currentLesson?.sequence[this.input.length] || '';
            const time = this.lastInputTimestamp
                ? now - this.lastInputTimestamp
                : 0;

            this.input.push(inputChar);
            this.events.push({
                type: 'input',
                actual: inputChar,
                expected,
                time,
                timestamp: now,
                finger,
            });

            this.lastInputTimestamp = now;

            if (
                this.input.length >= this.currentLesson?.sequence.length &&
                this.currentLesson &&
                !this.finishedAt
            ) {
                await this.finish();
            }
        },

        backspace() {
            if (this.input.length === 0) return;

            this.input.pop();

            const now = performance.now();
            const time = this.lastInputTimestamp
                ? now - this.lastInputTimestamp
                : 0;

            this.events.push({
                type: 'backspace',
                time,
                timestamp: now,
                finger: null,
            });

            this.lastInputTimestamp = now;
        },

        reset() {
            this.input = [];
            this.events = [];
            this.lastInputTimestamp = 0;
            this.startedAt = 0;
            this.finishedAt = null;
        },
    },
});
