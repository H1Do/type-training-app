import { en, ru } from '@/shared/locales';
import { Layout } from '@/shared/types';
import { createTestingPinia } from '@pinia/testing';
import { render, screen } from '@testing-library/vue';
import { describe, expect, it, vi } from 'vitest';
import { createI18n } from 'vue-i18n';
import LessonsList from './LessonsList.vue';

vi.mock('./LessonCard.vue', () => ({
    default: {
        template: '<div>LessonCard</div>',
        props: ['lesson'],
    },
}));

vi.mock('vue3-carousel', () => ({
    Carousel: {
        template: '<div><slot /></div>',
        props: ['itemsToShow', 'mouseDrag', 'wrapAround'],
        setup(_: unknown, { expose }: { expose: (exposed: object) => void }) {
            expose({
                next: vi.fn(),
                prev: vi.fn(),
            });
        },
    },
    Slide: {
        template: '<div><slot /></div>',
    },
}));

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

const createLessons = (count = 3, layout = Layout.QWERTY) =>
    Array.from({ length: count }).map((_, i) => ({
        id: `${layout}-${i}`,
        layout,
        stars: 3,
    }));

describe('LessonsList', () => {
    it('renders loader when loading', () => {
        render(LessonsList, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            lessons: {
                                loading: true,
                            },
                        },
                    }),
                    i18n,
                ],
                stubs: ['AppLoader'],
            },
        });

        expect(document.querySelector('app-loader-stub')).toBeTruthy();
    });

    it('shows "no lessons found" message if list is empty', () => {
        render(LessonsList, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            lessons: {
                                loading: false,
                                lessons: [],
                            },
                            settings: {
                                layout: Layout.QWERTY,
                            },
                        },
                    }),
                    i18n,
                ],
            },
        });

        expect(
            screen.getByText('messages.no_lessons_found'),
        ).toBeInTheDocument();
    });

    it('renders correct number of lessons', () => {
        render(LessonsList, {
            global: {
                plugins: [
                    createTestingPinia({
                        initialState: {
                            lessons: {
                                loading: false,
                                lessons: createLessons(6),
                            },
                            settings: {
                                layout: Layout.QWERTY,
                            },
                        },
                    }),
                    i18n,
                ],
            },
        });

        expect(screen.getAllByText('LessonCard')).toHaveLength(6);
    });
});
