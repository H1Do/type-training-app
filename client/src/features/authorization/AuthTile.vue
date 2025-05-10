<script setup lang="ts">
import { useAuthorizationStore } from './model/authorization';
import { useUserStore } from '@/entities/user';
import { useRouter } from 'vue-router';
import { AppLink, VFlex } from '@/shared/ui';
import { RouteNames } from '@/app/router';
import LoginForm from './ui/LoginForm.vue';
import RegistrationForm from './ui/RegistrationForm.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const authStore = useAuthorizationStore();
const userStore = useUserStore();
const router = useRouter();

const onSubmit = async () => {
    await authStore.submit();
    if (userStore.isAuthenticated) {
        router.push(RouteNames.MAIN);
    }
};
</script>

<template>
    <VFlex align="center" gap="0.25rem" class="tile">
        <Transition name="fade" mode="out-in">
            <LoginForm
                v-if="authStore.type === 'login'"
                v-model:modelValue="authStore.loginForm"
                @submit="onSubmit"
                key="login"
            />
            <RegistrationForm
                v-else
                v-model:modelValue="authStore.registrationForm"
                @submit="onSubmit"
                key="registration"
            />
        </Transition>

        <AppLink type="button" @click="authStore.toggleType">
            {{ t('auth.switch') }}
            {{
                authStore.type === 'login'
                    ? t('auth.registration')
                    : t('auth.login')
            }}
        </AppLink>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.tile {
    max-width: $auth-tile-max-width;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity $transition-duration-slow ease,
        transform $transition-duration-slow ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
