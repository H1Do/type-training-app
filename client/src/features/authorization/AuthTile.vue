<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import LoginForm from './ui/LoginForm.vue';
import RegistrationForm, {
    type RegistrationModelValueType,
} from './ui/RegistrationForm.vue';
import AppLink from '@/shared/ui/AppLink.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { useUserStore } from '@/shared/models/user';
import { UserApi } from '@/shared/services/userApi';

const user = useUserStore();
const userApi = inject<UserApi>('userApi');

type AuthType = 'login' | 'registration';

const type: Ref<AuthType> = ref('login');

const loginForm = ref({
    email: '',
    password: '',
});

const registrationForm = ref<RegistrationModelValueType>({
    email: '',
    login: '',
    password: '',
    confirmPassword: '',
});

const onSubmit = () => {
    if (!userApi) {
        throw new Error('UserApi is not provided');
    }
    if (type.value === 'login') {
        const { email, password } = loginForm.value;
        user.login(email, password, userApi);
    } else {
        const { email, login, password } = registrationForm.value;
        user.registration(login, password, email, userApi);
    }
};
</script>

<template>
    <VFlex align="center" gap="4px" class="tile">
        <Transition name="fade" mode="out-in">
            <LoginForm
                v-if="type === 'login'"
                v-model:modelValue="loginForm"
                @submit="onSubmit"
                key="login"
            />
            <RegistrationForm
                v-else
                v-model:modelValue="registrationForm"
                @submit="onSubmit"
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
@use '@/shared/styles/variables' as *;

.tile {
    max-width: 200px;
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
