import type { HttpClient } from './httpClient';
import type {
    CompleteLessonResponse,
    LessonDetails,
    LessonProgress,
    LessonResult,
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

    async finishLesson(result: LessonResult): Promise<CompleteLessonResponse> {
        const res = await this.httpClient.post<CompleteLessonResponse>(
            `/api/lessons/${result.lessonId}/complete`,
            result,
        );
        return res.data;
    }
}
