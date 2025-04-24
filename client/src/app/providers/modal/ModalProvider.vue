<script setup lang="ts">
import { useModalService } from '@/shared/utils/hooks/modal';

const modalService = useModalService();

const { modals, close, cancel } = modalService;

const onClose = (result: unknown) => {
    close(result);
};

const onCancel = (reason: unknown) => {
    cancel(reason);
};
</script>

<template>
    <teleport to="body">
        <div>
            <TransitionGroup name="fade" tag="div">
                <div v-for="(modal, index) in modals" :key="index">
                    <component
                        :is="modal.component"
                        v-bind="modal.props"
                        @close="onClose"
                        @resolve="onClose"
                        @reject="onCancel"
                    />
                </div>
            </TransitionGroup>
        </div>
    </teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
