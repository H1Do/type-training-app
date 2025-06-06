import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import axios from 'axios';
import { HttpClient } from './httpClient';
import { Localization } from '../types';
import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from '@/features/settings';

vi.mock('axios');

let client: HttpClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockedAxiosInstance: any;

beforeEach(() => {
    setActivePinia(createPinia());

    useSettingsStore().$patch({ localization: Localization.RU });

    mockedAxiosInstance = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        interceptors: {
            request: {
                use: vi.fn(),
            },
        },
    };

    (axios.create as unknown as Mock).mockReturnValue(mockedAxiosInstance);

    client = new HttpClient();
});

describe('HttpClient', () => {
    it('creates axios instance with correct baseURL and withCredentials', () => {
        expect(axios.create).toHaveBeenCalledWith({
            baseURL: 'http://localhost:7000',
            withCredentials: true,
        });
    });

    it('adds Accept-Language header from store', () => {
        const interceptorFn =
            mockedAxiosInstance.interceptors.request.use.mock.calls[0][0];
        const config = { headers: undefined };
        const result = interceptorFn(config);
        expect(result.headers.get('Accept-Language')).toBe(Localization.RU);
    });

    it('delegates GET request to axios', async () => {
        mockedAxiosInstance.get.mockResolvedValue({ data: 'result' });
        const result = await client.get('/test');
        expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
            '/test',
            undefined,
        );
        expect(result.data).toBe('result');
    });

    it('delegates POST request with data', async () => {
        mockedAxiosInstance.post.mockResolvedValue({ data: 42 });
        const result = await client.post('/test', { value: 123 });
        expect(mockedAxiosInstance.post).toHaveBeenCalledWith(
            '/test',
            { value: 123 },
            undefined,
        );
        expect(result.data).toBe(42);
    });

    it('delegates PUT, PATCH, DELETE', async () => {
        mockedAxiosInstance.put.mockResolvedValue({ data: 1 });
        mockedAxiosInstance.patch.mockResolvedValue({ data: 2 });
        mockedAxiosInstance.delete.mockResolvedValue({ data: 3 });

        expect((await client.put('/a', { x: 1 })).data).toBe(1);
        expect((await client.patch('/b', { y: 2 })).data).toBe(2);
        expect((await client.delete('/c')).data).toBe(3);
    });
});
