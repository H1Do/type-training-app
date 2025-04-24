import { reactive } from 'vue';
import { inject } from 'vue';

type MessageType = 'success' | 'error' | 'info' | 'warning';

export interface Message {
    id: number;
    type: MessageType;
    text: string;
    timeout?: number;
}

export class MessageService {
    public messages = reactive<Message[]>([]);
    private idCounter = 0;

    push(message: Omit<Message, 'id'>) {
        const id = this.idCounter++;
        const fullMessage = { ...message, id };
        this.messages.push(fullMessage);

        const timeout = message.timeout ?? 3000;
        setTimeout(() => this.remove(id), timeout);
    }

    remove(id: number) {
        const index = this.messages.findIndex((message) => message.id === id);
        if (index !== -1) this.messages.splice(index, 1);
    }

    success(text: string, timeout?: number) {
        this.push({ type: 'success', text, timeout });
    }

    error(text: string, timeout?: number) {
        this.push({ type: 'error', text, timeout });
    }

    info(text: string, timeout?: number) {
        this.push({ type: 'info', text, timeout });
    }

    warning(text: string, timeout?: number) {
        this.push({ type: 'warning', text, timeout });
    }
}

export function useMessageService() {
    const service = inject<MessageService>('messageService');
    if (!service) throw new Error('messageService not provided');
    return service;
}
