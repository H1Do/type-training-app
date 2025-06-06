/* eslint-disable @typescript-eslint/no-explicit-any */
import { setActivePinia, createPinia } from 'pinia';
import { useTrainingStore } from './training';
import { TrainingMode } from '@/shared/types/training';
import { Layout } from '@/shared/types';
import { beforeEach, expect, it, vi } from 'vitest';

const mockTrainingApi = {
    startSession: vi.fn(),
    finishSession: vi.fn(),
};

const mockMessageService = {
    error: vi.fn(),
};

const mockModalService = {
    open: vi.fn(),
};

const mockUserStore = {
    level: 1,
    setLevel: vi.fn(),
    setExp: vi.fn(),
};

vi.mock('@/features/settings', () => ({
    useSettingsStore: () => ({ layout: Layout.QWERTY }),
}));

vi.mock('@/entities/user', () => ({
    useUserStore: () => mockUserStore,
}));

beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
});

it('start() sets session and sequence', async () => {
    const store = useTrainingStore();
    store.trainingApi = mockTrainingApi as any;
    store.messageService = mockMessageService as any;

    mockTrainingApi.startSession.mockResolvedValue({
        id: 'abc',
        sequence: ['a', 'b'],
    });

    await store.start();

    expect(store.sequence).toEqual(['a', 'b']);
    expect(store.session?.id).toBe('abc');
    expect(store.session?.sequence).toEqual(['a', 'b']);
});

it('processKey() pushes input and events', async () => {
    const store = useTrainingStore();
    store.trainingApi = mockTrainingApi as any;
    store.messageService = mockMessageService as any;

    mockTrainingApi.startSession.mockResolvedValue({
        id: 'id',
        sequence: ['x'],
    });

    await store.start();

    await store.processKey('x', 'left-index');

    expect(store.input).toEqual(['x']);
    expect(store.events[0].type).toBe('input');
});

it('backspace() removes input and adds event', async () => {
    const store = useTrainingStore();
    store.input = ['x'];
    store.events = [];

    store.backspace();

    expect(store.input).toEqual([]);
    expect(store.events[0].type).toBe('backspace');
});

it('reset() clears all state', () => {
    const store = useTrainingStore();
    store.input = ['a'];
    store.sequence = ['a'];
    store.session = {
        id: 'x',
        sequence: ['a'],
        startedAt: 0,
        finishedAt: null,
    };
    store.events = [
        {
            type: 'input',
            actual: 'a',
            expected: 'a',
            time: 1,
            timestamp: 2,
            finger: null,
        },
    ];
    store.lastInputTimestamp = 123;

    store.reset();

    expect(store.input).toEqual([]);
    expect(store.sequence).toEqual([]);
    expect(store.session).toBeNull();
    expect(store.events).toEqual([]);
    expect(store.lastInputTimestamp).toBe(0);
});

it('finish() calls modalService.open and updates user level', async () => {
    const store = useTrainingStore();
    store.trainingApi = mockTrainingApi as any;
    store.messageService = mockMessageService as any;
    store.modalService = mockModalService as any;
    store.mode = TrainingMode.Letters;
    store.session = {
        id: 'id',
        sequence: ['a'],
        startedAt: 1,
        finishedAt: null,
    };
    store.sequence = ['a'];
    store.input = ['a'];
    store.events = [];

    mockTrainingApi.finishSession.mockResolvedValue({
        stats: {},
        exp: { current: 100, level: 2 },
    });

    await store.finish();

    expect(mockUserStore.setLevel).toHaveBeenCalledWith(2);
    expect(mockUserStore.setExp).toHaveBeenCalledWith(100);
    expect(mockModalService.open).toHaveBeenCalled();
});
