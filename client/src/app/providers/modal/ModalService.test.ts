import { describe, it, expect, beforeEach } from 'vitest';
import { ModalService } from './ModalService';

describe('ModalService', () => {
    let service: ModalService;

    beforeEach(() => {
        service = new ModalService();
    });

    it('opens modal and adds it to the list', () => {
        const DummyComponent = {};
        service.open(DummyComponent);
        expect(service.modals.length).toBe(1);
        expect(service.modals[0].component).toBe(DummyComponent);
    });

    it('resolves promise on close()', async () => {
        const DummyComponent = {};
        const promise = service.open(DummyComponent);
        service.close('ok');
        await expect(promise).resolves.toBe('ok');
        expect(service.modals.length).toBe(0);
    });

    it('rejects promise on cancel()', async () => {
        const DummyComponent = {};
        const promise = service.open(DummyComponent);
        service.cancel('cancelled');
        await expect(promise).rejects.toBe('cancelled');
        expect(service.modals.length).toBe(0);
    });

    it('close does nothing if no modals', () => {
        expect(() => service.close()).not.toThrow();
    });

    it('cancel does nothing if no modals', () => {
        expect(() => service.cancel()).not.toThrow();
    });

    it('passes props to modal', () => {
        const DummyComponent = {};
        service.open(DummyComponent, { test: 123 });
        expect(service.modals[0].props).toEqual({ test: 123 });
    });
});
