<script setup lang="ts">
import { useMessageService } from './MessageService';

const messageService = useMessageService();
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

.message__wrapper {
    position: fixed;
    bottom: calc(20px + #{$footer-height});
    right: 20px;
    z-index: $z-index-message;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
    max-width: 300px;
}

.message {
    padding: 12px 16px;
    border-radius: $border-radius;
    border: $border-width solid transparent;
    font-size: 0.9rem;
    line-height: 1.4;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: var(--background-color);
    color: var(--primary-color);
    transition: transform 0.3s ease, opacity 0.3s ease;
    word-break: break-word;
    text-align: center;

    &:not(:last-child) {
        margin-bottom: 12px;
    }

    &.success {
        border-color: var(--message-success-color);
        background-color: var(--message-success-bg);
        color: var(--message-success-color);
    }

    &.error {
        border-color: var(--message-error-color);
        background-color: var(--message-error-bg);
        color: var(--message-error-color);
    }

    &.info {
        border-color: var(--message-info-color);
        background-color: var(--message-info-bg);
        color: var(--message-info-color);
    }

    &.warning {
        border-color: var(--message-warning-color);
        background-color: var(--message-warning-bg);
        color: var(--message-warning-color);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
