<script setup lang="ts">
import { onErrorCaptured } from 'vue';
import { useMessageService } from '../message';

const messageService = useMessageService();

onErrorCaptured((err) => {
    const message = err instanceof Error ? err.message : String(err);
    messageService.error(`Error: ${message}`);
    return false;
});
</script>

<template>
    <slot />
</template>
