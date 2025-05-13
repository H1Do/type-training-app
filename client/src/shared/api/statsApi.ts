import type {
    Layout,
    StatsPeriod,
    StatsResponse,
    TopUsersByLevelResponse,
    TrainingMode,
} from '../types';
import type { HttpClient } from './httpClient';

export class StatsApi {
    constructor(private httpClient: HttpClient) {}

    async getStats(
        since: StatsPeriod = 'all',
        mode?: TrainingMode,
        layout?: Layout,
    ): Promise<StatsResponse> {
        const res = await this.httpClient.get<StatsResponse>('/api/stats/me', {
            params: {
                since,
                mode,
                layout,
            },
        });
        return res.data;
    }

    async getTopUsers(): Promise<TopUsersByLevelResponse> {
        const res = await this.httpClient.get<TopUsersByLevelResponse>(
            '/api/stats/top-users',
            {},
        );
        return res.data;
    }
}
