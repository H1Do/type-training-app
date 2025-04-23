<script setup lang="ts">
import { useUserApi } from '@/shared/domains/userApi';
import { useUserStore } from '@/shared/models/user';
import { useMessageService } from '@/shared/services/MessageService';
import AppButton from '@/shared/ui/AppButton.vue';
import AppInput from '@/shared/ui/AppInput.vue';
import AppModal from '@/shared/ui/AppModal.vue';
import AppText from '@/shared/ui/AppText.vue';
import type { AxiosError } from 'axios';
import { ref } from 'vue';

const userApi = useUserApi();
const messageService = useMessageService();
const { changePassword } = useUserStore();

const oldPasswordValue = ref('');
const newPasswordValue = ref('');
const confirmNewPasswordValue = ref('');
const errorText = ref('');

const onSubmit = async () => {
    if (
        !newPasswordValue.value ||
        !confirmNewPasswordValue.value ||
        !oldPasswordValue.value
    ) {
        errorText.value = 'All fields are required';
        return;
    }

    if (newPasswordValue.value !== confirmNewPasswordValue.value) {
        errorText.value = 'Passwords do not match';
        return;
    }

    try {
        await changePassword(
            oldPasswordValue.value,
            newPasswordValue.value,
            userApi,
            messageService,
        );
        emit('resolve', true);
    } catch (error) {
        console.log(error);
        errorText.value = (
            (error as AxiosError).response?.data as {
                message: string;
            }
        )?.message;
        return;
    }
};

const emit = defineEmits<{
    (e: 'resolve', value: boolean): void;
}>();

const handleCancel = () => emit('resolve', false);
</script>

<template>
    <AppModal @close="handleCancel">
        <form @submit.prevent="onSubmit" class="form">
            <AppInput
                v-model="oldPasswordValue"
                placeholder="Old password"
                @input="errorText = ''"
            />
            <AppInput
                v-model="newPasswordValue"
                placeholder="New password"
                @input="errorText = ''"
            />
            <AppInput
                v-model="confirmNewPasswordValue"
                placeholder="Confirm new password"
                @input="errorText = ''"
            />
            <AppButton type="submit" :error="!!errorText">
                Change password
            </AppButton>
            <AppText
                v-if="!!errorText"
                textStyle="error"
                align="center"
                size="12px"
            >
                {{ errorText }}
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
