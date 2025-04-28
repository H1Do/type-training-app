<script setup lang="ts">
import { AppButton, AppInput, AppModal, AppText } from '@/shared/ui';
import { useChangePasswordForm } from '../model/profile';

const form = useChangePasswordForm();

const emit = defineEmits<{
    (e: 'resolve', value: boolean): void;
}>();

const onSubmit = async () => {
    const success = await form.submit();
    if (success) {
        emit('resolve', true);
        form.reset();
    }
};

const handleCancel = () => emit('resolve', false);
</script>

<template>
    <AppModal @close="handleCancel">
        <form @submit.prevent="onSubmit" class="form">
            <AppInput
                v-model="form.oldPassword"
                placeholder="Old password"
                @input="form.error = ''"
            />
            <AppInput
                v-model="form.newPassword"
                placeholder="New password"
                @input="form.error = ''"
            />
            <AppInput
                v-model="form.confirmPassword"
                placeholder="Confirm new password"
                @input="form.error = ''"
            />

            <AppButton
                type="submit"
                :buttonStyle="!!form.error ? 'error' : 'primary'"
                >Change password</AppButton
            >
            <AppText
                v-if="form.error"
                textStyle="error"
                align="center"
                size="12px"
            >
                {{ form.error }}
            </AppText>
        </form>
    </AppModal>
</template>

<style scoped lang="scss">
.form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 300px;
}
</style>
