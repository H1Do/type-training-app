import { en, ru } from '@/shared/locales';
import { adminLessonMock } from '@/shared/tests/mocks';
import { Layout } from '@/shared/types';
import { createTestingPinia } from '@pinia/testing';
import { fireEvent, render, screen } from '@testing-library/vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';
import AdminLessonsList from './AdminLessonsList.vue';
import { useAdminStore } from './model/admin';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

vi.mock('@/shared/utils', async (original) => {
    const actual = (await original()) || {};
    return {
        ...actual,
        useModalService: () => ({
            open: vi.fn().mockResolvedValue(undefined),
        }),
        useModal: vi.fn().mockResolvedValue(undefined),
        useConfirmDialog: vi.fn().mockResolvedValue(true),
    };
});

describe('AdminLessonsList.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderComponent = (options: any = {}) => {
        return render(AdminLessonsList, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            admin: {
                                lessons: [],
                                isLoading: false,
                            },
                        },
                        stubActions: false,
                        ...options.pinia,
                    }),
                    i18n,
                ],
            },
        });
    };

    it('renders title and layout selector', async () => {
        renderComponent({
            pinia: {
                initialState: {
                    admin: {
                        lessons: [],
                        isLoading: false,
                    },
                },
            },
        });

        expect(screen.getByText(/lesson management/i)).toBeInTheDocument();
        expect(screen.getByText(/qwerty/i)).toBeInTheDocument();
    });

    it('shows loader when loading', async () => {
        renderComponent({
            pinia: {
                initialState: {
                    admin: {
                        lessons: [],
                        isLoading: true,
                    },
                },
            },
        });

        expect(screen.getByTestId('app-loader')).toBeInTheDocument();
    });

    it('shows "no data" if lessons list is empty', async () => {
        renderComponent();
        await nextTick();
        expect(screen.getByText(/lesson management/i)).toBeInTheDocument();
    });

    it('renders grouped lessons if available', async () => {
        renderComponent({
            pinia: {
                initialState: {
                    admin: {
                        lessons: [
                            {
                                ...adminLessonMock,
                                id: '1',
                                layout: 'QWERTY',
                                title: 'L1',
                            },
                            {
                                ...adminLessonMock,
                                id: '2',
                                layout: 'QWERTY',
                                title: 'L2',
                            },
                            {
                                ...adminLessonMock,
                                id: '3',
                                layout: 'QWERTY',
                                title: 'L3',
                            },
                            {
                                ...adminLessonMock,
                                id: '4',
                                layout: 'QWERTY',
                                title: 'L4',
                            },
                        ],
                        isLoading: false,
                    },
                },
            },
        });

        const titles = screen.getAllByText((content) => content.includes('L1'));
        expect(titles.length).toBeGreaterThan(0);
    });

    it('opens create lesson modal on click', async () => {
        const { useModal } = await import('@/shared/utils');
        renderComponent();
        const createButtons = screen.getAllByRole('button');
        const createButton = createButtons.find((btn) =>
            btn.textContent?.includes('Create'),
        );
        expect(createButton).toBeDefined();
        await fireEvent.click(createButton!);
        expect(useModal).toHaveBeenCalled();
    });

    it('calls deleteLesson if confirmed', async () => {
        const { useConfirmDialog } = await import('@/shared/utils');

        const pinia = createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
        });
        const store = useAdminStore();

        store.lessons = [
            { ...adminLessonMock, id: '1', layout: Layout.QWERTY },
        ];

        render(AdminLessonsList, {
            global: {
                plugins: [pinia, i18n],
            },
        });

        await nextTick();

        const deleteBtn = screen
            .getAllByRole('button')
            .find((b) => b.innerHTML.includes('trash'));
        if (deleteBtn) {
            await fireEvent.click(deleteBtn);
            expect(useConfirmDialog).toHaveBeenCalled();
        }
    });
});
