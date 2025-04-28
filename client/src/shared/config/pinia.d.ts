import { UserApi } from '../api';
import { ModalService } from '../providers/modal';
import { MessageService } from '../providers/message';
import type { Router } from 'vue-router';

declare module 'pinia' {
    export interface PiniaCustomProperties {
        userApi: UserApi;
        modalService: ModalService;
        messageService: MessageService;
        router: Router;
    }
}
