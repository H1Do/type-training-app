import type { LessonDetails, LessonProgress } from '@/shared/types';
import { defineStore } from 'pinia';

export const useLessonsStore = defineStore('lessons', {
    state: () => ({
        lessons: [] as LessonProgress[],
        currentLesson: null as LessonDetails | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
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

        async fetchLesson(id: string) {
            this.loading = true;
            try {
                this.currentLesson = await this.lessonsApi.getLesson(id);
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

        async completeLesson(
            id: string,
            stats: { cpm: number; accuracy: number },
        ) {
            try {
                const { stars, message } = await this.lessonsApi.completeLesson(
                    id,
                    stats,
                );
                const lesson = this.lessons.find((l) => l.id === id);
                if (lesson && stars > lesson.stars) {
                    lesson.stars = stars;
                }
                return { stars, message };
            } catch {
                const message =
                    this.t('messages.lesson_completion_failed') ??
                    'Lesson completion failed';
                this.messageService.error(message);
                return { stars: 0, message };
            }
        },

        reset() {
            this.lessons = [];
            this.currentLesson = null;
            this.loading = false;
            this.error = null;
        },
    },
});
