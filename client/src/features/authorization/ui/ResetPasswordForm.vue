<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/entities/user';
import { AppInput, AppButton, AppText, VFlex } from '@/shared/ui';
import { useI18n } from 'vue-i18n';
import { isPasswordStrong } from '@/shared/utils';
import { RoutePaths } from '@/app/router';

const { t } = useI18n();

const userStore = useUserStore();
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const route = useRoute();

const token = route.query.token as string;

const onSubmit = async () => {
    if (!password.value || !confirmPassword.value) {
        userStore.setError(t('auth.allFieldsRequired'));
        return;
    }

    if (password.value !== confirmPassword.value) {
        userStore.setError(t('auth.passwordsDoNotMatch'));
        return;
    }

    if (!isPasswordStrong(password.value)) {
        userStore.setError(t('auth.passwordWeak'));
        return;
    }

    await userStore.resetPassword(token, password.value);
    userStore.setError('');
    router.push(RoutePaths.AUTH);
};
</script>

<template>
    <form class="form" @submit.prevent="onSubmit">
        <VFlex align="stretch" gap="1rem">
            <AppText :weight="600" align="center" size="1.25rem">
                {{ t('auth.setNewPassword') }}
            </AppText>
            <AppInput
                v-model="password"
                type="password"
                id="password"
                :placeholder="t('auth.password')"
            />
            <AppInput
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                :placeholder="t('auth.confirmPassword')"
            />
            <AppButton type="submit">{{ t('auth.set') }}</AppButton>
            <AppText
                v-if="userStore.error"
                textStyle="error"
                align="center"
                size="0.75rem"
            >
                {{ userStore.error }}
            </AppText>
        </VFlex>
    </form>
</template>

<style lang="scss" scoped>
@use '@/shared/styles/variables' as *;

.form {
    width: $auth-width;
}
</style>
