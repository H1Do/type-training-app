import { inject, type Component } from 'vue';
import type { ModalService } from '../services/ModalService';
import ConfirmDialog, {
    type ConfirmDialogProps,
} from '../ui/ConfirmDialog.vue';
import AppModal from '../ui/AppModal.vue';

export function useModalService() {
    const modalService = inject<ModalService>('modalService');
    if (!modalService) throw new Error('modalService not provided');
    return modalService;
}

export function useModal<T = unknown>(
    service: ModalService,
    component: unknown,
    props?: Record<string, unknown>,
): Promise<T> {
    return service.open(component, props) as Promise<T>;
}

export function useConfirmDialog(
    service: ModalService,
    props?: ConfirmDialogProps,
): Promise<boolean> {
    return useModal(service, ConfirmDialog, props as Record<string, unknown>);
}

export function useCommonModal(
    service: ModalService,
    content: Component,
): Promise<void> {
    return useModal(service, AppModal, { component: content });
}
