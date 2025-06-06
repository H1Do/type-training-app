import { beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom';

/* eslint-disable @typescript-eslint/no-explicit-any */
globalThis.window ??= {} as any;

window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));

beforeAll(() => {
    global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});
