import { render } from '@testing-library/vue';
import App from './App.vue';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { createI18n } from 'vue-i18n';
import { en, ru } from '@/shared/locales';
import { createRouter, createMemoryHistory } from 'vue-router';
import type { MessageService, ModalService } from './providers';

const modalServiceMock = {
    open: vi.fn(),
    close: vi.fn(),
    confirm: vi.fn().mockResolvedValue(true),
} as unknown as ModalService;

const messageServiceMock = {
    showMessage: vi.fn(),
} as unknown as MessageService;

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: { en, ru },
});

const router = createRouter({
    history: createMemoryHistory(),
    routes: [],
});

describe('App.vue', () => {
    it('mounts without errors', () => {
        render(App, {
            global: {
                plugins: [createTestingPinia(), i18n, router],
                provide: {
                    modalService: modalServiceMock,
                    messageService: messageServiceMock,
                },
            },
        });

        expect(true).toBe(true);
    });
});
