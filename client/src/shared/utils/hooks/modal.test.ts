import { describe, it, expect, vi, type Mock } from 'vitest';
import {
    useModal,
    useConfirmDialog,
    useCommonModal,
    useModalService,
} from './modal';
import { ConfirmDialog } from '@/shared/ui/modal';
import type { ModalService } from '@/app/providers';
import { inject } from 'vue';

const createMockModalService = (result: unknown): ModalService => ({
    open: vi.fn().mockResolvedValue(result),
    close: vi.fn(),
    cancel: vi.fn(),
    modals: [],
});

vi.mock('vue', async () => {
    const actual = await vi.importActual<typeof import('vue')>('vue');
    return {
        ...actual,
        inject: vi.fn(),
    };
});

describe('modalService hooks', () => {
    it('useModal should call service.open with component and props', async () => {
        const result = 'mockedResult';
        const service = createMockModalService(result);

        const component = { template: '<div />' };
        const props = { foo: 'bar' };

        const returned = await useModal(service, component, props);
        expect(returned).toBe(result);
        expect(service.open).toHaveBeenCalledWith(component, props);
    });

    it('useConfirmDialog should open ConfirmDialog with props', async () => {
        const service = createMockModalService(true);
        const props = { title: 'Are you sure?' };

        const confirmed = await useConfirmDialog(service, props);
        expect(confirmed).toBe(true);
        expect(service.open).toHaveBeenCalledWith(ConfirmDialog, props);
    });

    it('useCommonModal should open AppModal with content', async () => {
        const service = createMockModalService(undefined);
        const content = { template: '<div>content</div>' };

        await useCommonModal(service, content);
        expect(service.open).toHaveBeenCalledWith(expect.anything(), {
            component: content,
        });
    });

    it('returns injected modal service', () => {
        const mockService = {
            open: vi.fn(),
            close: vi.fn(),
            cancel: vi.fn(),
            modals: [],
        };
        (inject as unknown as Mock).mockReturnValue(mockService);
        const service = useModalService();
        expect(service).toBe(mockService);
    });

    it('throws error if modalService not provided', () => {
        (inject as unknown as Mock).mockReturnValue(undefined);
        expect(() => useModalService()).toThrow('modalService not provided');
    });
});
