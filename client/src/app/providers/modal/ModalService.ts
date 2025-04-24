import { markRaw, reactive, type Component } from 'vue';

interface ModalInstance {
    component: unknown;
    props?: Record<string, unknown>;
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}

export class ModalService {
    public modals = reactive<ModalInstance[]>([]);

    open(
        component: Component,
        props?: Record<string, unknown>,
    ): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.modals.push({
                component: markRaw(component),
                props,
                resolve,
                reject,
            });
        });
    }

    close = (result?: unknown) => {
        const modal = this.modals.pop();
        modal?.resolve(result);
    };

    cancel = (reason?: unknown) => {
        const modal = this.modals.pop();
        modal?.reject(reason);
    };
}
