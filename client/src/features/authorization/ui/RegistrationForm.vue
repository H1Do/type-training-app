<script setup lang="ts">
import { useUserStore } from '@/shared/models/user';
import CButton from '@/shared/ui/AppButton.vue';
import AppInput from '@/shared/ui/AppInput.vue';
import AppText from '@/shared/ui/AppText.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { computed } from 'vue';

export type RegistrationModelValueType = {
    email: string;
    login: string;
    password: string;
    confirmPassword: string;
};

const props = defineProps<{
    modelValue: RegistrationModelValueType;
}>();

const canSubmit = computed(() => {
    const { email, login, password, confirmPassword } = props.modelValue;
    return (
        !!email.trim() &&
        !!login.trim() &&
        !!password.trim() &&
        !!confirmPassword.trim()
    );
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: RegistrationModelValueType): void;
    (e: 'update:error', value: string): void;
    (e: 'submit', value: RegistrationModelValueType): void;
}>();

const userStore = useUserStore();

const updateField = (field: keyof RegistrationModelValueType, event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: target.value,
    });
    emit('update:error', '');
};

const submitForm = (event: Event) => {
    event.preventDefault();
    if (!canSubmit.value) {
        userStore.setError('All fields are required');
        return;
    }
    if (props.modelValue.password !== props.modelValue.confirmPassword) {
        userStore.setError('Passwords do not match');
        return;
    }
    emit('submit', props.modelValue);
};
</script>

<template>
    <form class="form" @submit="submitForm">
        <VFlex align="stretch" gap="16px">
            <AppInput
                type="email"
                name="email"
                id="email"
                :value="modelValue.email"
                @input="updateField('email', $event)"
                placeholder="Email"
            />
            <AppInput
                type="text"
                name="login"
                id="login"
                :value="modelValue.login"
                @input="updateField('login', $event)"
                placeholder="Login"
            />
            <AppInput
                type="password"
                name="password"
                id="password"
                :value="modelValue.password"
                @input="updateField('password', $event)"
                placeholder="Password"
            />
            <AppInput
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                :value="modelValue.confirmPassword"
                @input="updateField('confirmPassword', $event)"
                placeholder="Confirm Password"
            />
            <VFlex align="stretch" gap="4px">
                <CButton type="submit">Register</CButton>
                <AppText
                    v-if="userStore.error"
                    textStyle="error"
                    align="center"
                    size="12px"
                >
                    {{ userStore.error }}
                </AppText>
            </VFlex>
        </VFlex>
    </form>
</template>

<style scoped lang="scss"></style>
