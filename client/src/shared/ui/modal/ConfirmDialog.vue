<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import VFlex from '../VFlex.vue';
import AppButton from '../AppButton.vue';
import AppModal from './AppModal.vue';

export interface ConfirmDialogProps {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

defineProps<ConfirmDialogProps>();

const emit = defineEmits<{
    (e: 'resolve', value: boolean): void;
}>();

const handleCancel = () => emit('resolve', false);
const handleConfirm = () => emit('resolve', true);
</script>

<template>
    <AppModal @close="handleCancel">
        <VFlex
            class="confirm-dialog"
            gap="16px"
            align="center"
            justify="between"
        >
            <h2 class="confirm-dialog__title" v-if="title">
                {{ title || 'Confirm' }}
            </h2>
            <div class="confirm-dialog__message" v-if="message">
                {{ message || 'Are you sure?' }}
            </div>

            <div class="confirm-dialog__buttons">
                <AppButton class="cancel" @click="handleCancel">{{
                    cancelText || 'No'
                }}</AppButton>
                <AppButton class="accept" @click="handleConfirm">
                    {{ confirmText || 'Yes' }}
                </AppButton>
            </div>
        </VFlex>
    </AppModal>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.confirm-dialog {
    text-align: center;
    min-width: 300px;

    &__title {
        font-size: $header-font-size;
        font-size: 1.3rem;
        font-weight: 500;
    }

    &__message {
        text-align: start;
    }

    &__buttons {
        display: flex;
        justify-content: center;
        gap: 12px;
        align-self: flex-end;
        margin-top: 24px;

        .cancel {
            background-color: var(--decline-color);
            color: white;

            &:hover {
                background-color: var(--decline-color-hover);
            }
        }

        .accept {
            background-color: var(--accept-color);
            color: white;

            &:hover {
                background-color: var(--accept-color-hover);
            }
        }
    }
}
</style>
