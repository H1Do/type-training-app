import { ModalService } from '@/app/providers';
import {
    AppModal,
    ConfirmDialog,
    type ConfirmDialogProps,
} from '@/shared/ui/modal';
import { inject, type Component } from 'vue';

export function useModalService() {
    const service = inject<ModalService>('modalService');
    if (!service) throw new Error('modalService not provided');
    return service;
}

export function useModal<T = unknown>(
    service: ModalService,
    component: Component,
    props?: Record<string, unknown>,
): Promise<T> {
    return service.open(component, props) as Promise<T>;
}

export function useConfirmDialog(
    modalService: ModalService,
    props?: ConfirmDialogProps,
): Promise<boolean> {
    return useModal(
        modalService,
        ConfirmDialog,
        props as Record<string, unknown>,
    );
}

export function useCommonModal(
    modalService: ModalService,
    content: Component,
): Promise<void> {
    return useModal(modalService, AppModal, { component: content });
}
