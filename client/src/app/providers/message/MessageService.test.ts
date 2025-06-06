import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach,
    type Mock,
} from 'vitest';
import { MessageService, useMessageService } from './MessageService';
import { inject } from 'vue';

vi.mock('vue', async () => {
    const vue = await vi.importActual<typeof import('vue')>('vue');
    return {
        ...vue,
        inject: vi.fn(),
    };
});

describe('MessageService', () => {
    let service: MessageService;

    beforeEach(() => {
        service = new MessageService();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('pushes a message with auto-removal', () => {
        service.push({ type: 'info', text: 'Hello', timeout: 1000 });
        expect(service.messages).toHaveLength(1);
        expect(service.messages[0].text).toBe('Hello');

        vi.advanceTimersByTime(1000);
        expect(service.messages).toHaveLength(0);
    });

    it('removes message by ID', () => {
        service.push({ type: 'info', text: 'To remove', timeout: 99999 });
        const id = service.messages[0].id;

        service.remove(id);
        expect(service.messages).toHaveLength(0);
    });

    it('success() creates success message', () => {
        service.success('Yay');
        expect(service.messages[0]).toMatchObject({
            type: 'success',
            text: 'Yay',
        });
    });

    it('error() creates error message', () => {
        service.error('Oops');
        expect(service.messages[0]).toMatchObject({
            type: 'error',
            text: 'Oops',
        });
    });

    it('info() creates info message', () => {
        service.info('FYI');
        expect(service.messages[0]).toMatchObject({
            type: 'info',
            text: 'FYI',
        });
    });

    it('warning() creates warning message', () => {
        service.warning('Careful');
        expect(service.messages[0]).toMatchObject({
            type: 'warning',
            text: 'Careful',
        });
    });

    it('assigns unique IDs to messages', () => {
        service.success('msg1');
        service.success('msg2');
        expect(service.messages[0].id).not.toBe(service.messages[1].id);
    });
});

describe('useMessageService', () => {
    const mockService = new MessageService();

    beforeEach(() => {
        (inject as Mock).mockReset();
    });

    it('returns injected message service', () => {
        (inject as Mock).mockReturnValue(mockService);
        const result = useMessageService();
        expect(result).toBe(mockService);
    });

    it('throws if messageService not provided', () => {
        (inject as Mock).mockReturnValue(undefined);
        expect(() => useMessageService()).toThrow(
            'messageService not provided',
        );
    });
});
