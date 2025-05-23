import { TrainingApi, UserApi, LessonsApi, StatsApi } from '../api';
import { ModalService } from '../providers/modal';
import { MessageService } from '../providers/message';
import type { Router } from 'vue-router';
import type { AdminApi } from '../api/adminApi';

declare module 'pinia' {
    export interface PiniaCustomProperties {
        userApi: UserApi;
        trainingApi: TrainingApi;
        statsApi: StatsApi;
        lessonsApi: LessonsApi;
        adminApi: AdminApi;
        modalService: ModalService;
        messageService: MessageService;
        router: Router;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        t: any;
    }
}
