<script setup lang="ts">
import { useMessage } from '@/shared/services/MessageService';
import AppButton from '@/shared/ui/AppButton.vue';

const { error, info, success, warning } = useMessage();
</script>

<template>
    <div>
        <AppButton @click="error('Error message')">Error</AppButton>
        <AppButton @click="info('Info message')">Info</AppButton>
        <AppButton @click="success('Success message')">Success</AppButton>
        <AppButton @click="warning('Warning message')">Warning</AppButton>
    </div>
</template>

<style scoped lang="scss"></style>
