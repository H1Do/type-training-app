import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TrainingApi } from './trainingApi';
import type { HttpClient } from './httpClient';
import {
    TrainingMode,
    type TrainingSession,
    type TrainingFinishResponse,
    type TrainingResult,
} from '../types/training';
import { Layout } from '../types';
import { expMock, statsMock } from '../tests/mocks';

const mockHttpClient = {
    post: vi.fn(),
} as unknown as HttpClient;

let api: TrainingApi;

beforeEach(() => {
    vi.clearAllMocks();
    api = new TrainingApi(mockHttpClient);
});

describe('TrainingApi', () => {
    it('startSession sends correct payload and returns session', async () => {
        const expected: TrainingSession = {
            id: 'abc123',
            sequence: ['a', 'b', 'c'],
        };

        mockHttpClient.post = vi.fn().mockResolvedValue({ data: expected });

        const result = await api.startSession(
            TrainingMode['100PopularWords'],
            Layout.QWERTY,
            'abc def',
            20,
            true,
        );

        expect(result).toEqual(expected);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/api/training/session',
            {
                mode: TrainingMode['100PopularWords'],
                layout: Layout.QWERTY,
                items: 'abc def',
                length: 20,
                isWords: true,
            },
        );
    });

    it('finishSession sends result and returns response', async () => {
        const result: TrainingResult = {
            sessionId: 'abc123',
            layout: Layout.QWERTY,
            mode: TrainingMode['100PopularWords'],
            events: [],
            finishedAt: Date.now(),
            input: ['a', 'b', 'c'],
            sequence: ['a', 'b', 'c'],
            startedAt: Date.now() - 1000,
        };

        const response: TrainingFinishResponse = {
            message: 'Session saved',
            exp: expMock,
            stats: statsMock,
        };

        mockHttpClient.post = vi.fn().mockResolvedValue({ data: response });

        const res = await api.finishSession(result);

        expect(res).toEqual(response);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `api/training/session/${result.sessionId}/finish`,
            result,
        );
    });
});
