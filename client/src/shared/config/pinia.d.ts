import { TrainingApi, UserApi } from '../api';
import { ModalService } from '../providers/modal';
import { MessageService } from '../providers/message';
import type { Router } from 'vue-router';
import type { StatsApi } from '../api/statsApi';

declare module 'pinia' {
    export interface PiniaCustomProperties {
        userApi: UserApi;
        trainingApi: TrainingApi;
        statsApi: StatsApi;
        modalService: ModalService;
        messageService: MessageService;
        router: Router;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        t: any;
    }
}
