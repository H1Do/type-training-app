import { render } from '@testing-library/vue';
import { describe, test } from 'vitest';
import * as Pages from '@/pages';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import { en, ru } from '@/shared/locales';
import ModalProvider from '@/app/providers/modal/ModalProvider.vue';
import MessageProvider from '@/app/providers/message/MessageProvider.vue';
import { h } from 'vue';
import type { ModalService } from '@/app/providers';

export function createModalService(): ModalService {
    return {
        open: () => Promise.resolve(),
        close: () => {},
        cancel: () => Promise.resolve(false),
        modals: [],
    };
}

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

const router = createRouter({
    history: createMemoryHistory(),
    routes: [],
});

describe('All pages render', () => {
    Object.entries(Pages).forEach(([name, Page]) => {
        test(`${name} renders`, () => {
            render(Page, {
                global: {
                    plugins: [createTestingPinia(), i18n, router],
                    components: { ModalProvider, MessageProvider },
                    provide: {
                        modalService: createModalService(),
                    },
                },
                slots: {
                    default: {
                        render() {
                            return h(ModalProvider, {}, () =>
                                h(MessageProvider, {}, () => h(Page)),
                            );
                        },
                    },
                },
            });
        });
    });
});
