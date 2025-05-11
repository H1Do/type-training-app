import type { HttpClient } from './httpClient';
import type {
    CompleteLessonResult,
    LessonDetails,
    LessonProgress,
} from '../types';

export class LessonsApi {
    constructor(private httpClient: HttpClient) {}

    async getLessons(): Promise<LessonProgress[]> {
        const res = await this.httpClient.get<LessonProgress[]>('/api/lessons');
        return res.data;
    }

    async getLesson(id: string): Promise<LessonDetails> {
        const res = await this.httpClient.get<LessonDetails>(
            `/api/lessons/${id}`,
        );
        return res.data;
    }

    async completeLesson(
        id: string,
        stats: { cpm: number; accuracy: number },
    ): Promise<CompleteLessonResult> {
        const res = await this.httpClient.post<CompleteLessonResult>(
            `/api/lessons/${id}/complete`,
            stats,
        );
        return res.data;
    }
}
