import type { Layout } from '../types';
import type { TrainingStats } from '../types/stats';
import type {
    TrainingFinishResponse,
    TrainingMode,
    TrainingResult,
    TrainingSession,
} from '../types/training';
import type { HttpClient } from './httpClient';

export class TrainingApi {
    constructor(private httpClient: HttpClient) {}

    async prepareSequence(
        mode: TrainingMode,
        layout: Layout,
        items: string | undefined,
        length: number | undefined,
        isWords: boolean | undefined,
    ): Promise<string[]> {
        const res = await this.httpClient.get<string[]>(
            '/api/training/prepare',
            {
                params: { mode, layout, items, length, isWords },
            },
        );
        return res.data;
    }

    async startSession(
        mode: TrainingMode,
        layout: Layout,
        items?: string,
        length?: number,
        isWords?: boolean,
    ): Promise<TrainingSession> {
        const res = await this.httpClient.post<TrainingSession>(
            '/api/training/session',
            {
                mode,
                layout,
                items,
                length,
                isWords,
            },
        );
        return res.data;
    }

    async finishSession(
        result: TrainingResult,
    ): Promise<{ stats: TrainingStats }> {
        const res = await this.httpClient.post<TrainingFinishResponse>(
            `api/training/session/${result.sessionId}/finish`,
            result,
        );
        return res.data;
    }
}
