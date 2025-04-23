<script setup lang="ts">
import { inject } from 'vue';
import type { MessageService } from '@/shared/services/MessageService';

const messageService = inject<MessageService>('messageService');
</script>

<template>
    <div class="message__wrapper">
        <TransitionGroup name="fade" tag="div">
            <div
                v-for="message in messageService?.messages"
                :key="message.id"
                :class="['message', message.type]"
            >
                {{ message.text }}
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.message {
    padding: 10px 16px;
    border-radius: $border-radius;
    border: $border-width solid $black;
    text-align: center;

    &.success {
        color: $success;
        border-color: $success;
    }

    &.error {
        color: $error;
        border-color: $error;
    }

    &.info {
        color: $info;
        border-color: $info;
    }

    &.warning {
        color: $warning;
        border-color: $warning;
    }

    &__wrapper {
        position: absolute;
        bottom: 20px + $footer-height;
        right: 20px;
        z-index: $z-index-message;
    }

    &:not(:last-child) {
        margin-bottom: 12px;
    }
}
</style>
