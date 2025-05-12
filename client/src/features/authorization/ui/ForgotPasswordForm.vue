<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/entities/user';
import { AppInput, AppButton, VFlex, AppText } from '@/shared/ui';
import { useI18n } from 'vue-i18n';
import { RoutePaths } from '@/app/router';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const email = ref('');
const userStore = useUserStore();

const onSubmit = async () => {
    await userStore.requestPasswordReset(email.value);
    router.push(RoutePaths.AUTH);
};
</script>

<template>
    <form class="form" @submit.prevent="onSubmit">
        <VFlex align="stretch" gap="1rem">
            <AppText :weight="600" align="center" size="1.25rem">{{
                t('auth.resetPasswordTitle')
            }}</AppText>
            <AppInput v-model="email" type="email" placeholder="Ваш email" />
            <AppButton type="submit">{{ t('auth.reset') }}</AppButton>
        </VFlex>
    </form>
</template>

<style lang="scss" scoped>
@use '@/shared/styles/variables' as *;

.form {
    width: $auth-width;
}
</style>
