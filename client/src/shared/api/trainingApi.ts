import type {
    TrainingFinishResponse,
    TrainingMode,
    TrainingResult,
    TrainingSession,
    TrainingStats,
} from '../types/training';
import type { HttpClient } from './httpClient';

export class TrainingApi {
    constructor(private httpClient: HttpClient) {}

    async prepareSequence(mode: TrainingMode): Promise<string[]> {
        const res = await this.httpClient.get<string[]>(
            '/api/training/prepare',
            {
                params: { mode },
            },
        );
        return res.data;
    }

    async startSession(
        mode: TrainingMode,
        sequence: string[],
    ): Promise<TrainingSession> {
        const res = await this.httpClient.post<TrainingSession>(
            '/api/training/session',
            { mode, sequence },
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
