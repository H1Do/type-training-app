import { UserApi } from '../api';
import { ModalService } from '../providers/modal';
import { MessageService } from '../providers/message';

declare module 'pinia' {
    export interface PiniaCustomProperties {
        userApi: UserApi;
        modalService: ModalService;
        messageService: MessageService;
    }
}
