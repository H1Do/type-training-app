<script setup lang="ts">
import { ref, type Ref } from 'vue';
import LoginForm from '@/widgets/LoginForm.vue';
import RegistrationForm from '@/widgets/RegistrationForm.vue';
import AppLink from '@/shared/ui/AppLink.vue';
import VFlex from '@/shared/ui/VFlex.vue';

type AuthType = 'login' | 'registration';

const type: Ref<AuthType> = ref('login');

const loginForm = ref({
    email: '',
    password: '',
});

const registrationForm = ref({
    email: '',
    login: '',
    password: '',
    confirmPassword: '',
});
</script>

<template>
    <VFlex align="center" gap="16px">
        <Transition name="fade" mode="out-in">
            <LoginForm
                v-if="type === 'login'"
                :model-value="loginForm"
                @update:model-value="loginForm = $event"
                @submit="console.log($event)"
                key="login"
            />
            <RegistrationForm
                v-else
                :model-value="registrationForm"
                @update:model-value="registrationForm = $event"
                @submit="console.log($event)"
                key="registration"
            />
        </Transition>

        <AppLink
            type="button"
            @click="type = type === 'login' ? 'registration' : 'login'"
        >
            Switch to {{ type === 'login' ? 'Registration' : 'Login' }}
        </AppLink>
    </VFlex>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
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
