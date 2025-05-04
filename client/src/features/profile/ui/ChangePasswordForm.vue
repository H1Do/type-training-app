<script setup lang="ts">
import { AppButton, AppInput, AppModal, AppText } from '@/shared/ui';
import { useChangePasswordForm } from '../model/profile';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
                type="password"
                :placeholder="t('profile.oldPassword')"
                @input="form.error = ''"
            />
            <AppInput
                v-model="form.newPassword"
                type="password"
                :placeholder="t('profile.newPassword')"
                @input="form.error = ''"
            />
            <AppInput
                v-model="form.confirmPassword"
                type="password"
                :placeholder="t('profile.confirmPassword')"
                @input="form.error = ''"
            />

            <AppButton
                type="submit"
                :buttonStyle="!!form.error ? 'error' : 'primary'"
                >{{ t('profile.changePassword') }}</AppButton
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
