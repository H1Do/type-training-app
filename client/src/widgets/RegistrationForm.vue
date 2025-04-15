<script setup lang="ts">
import CButton from '@/shared/ui/AppButton.vue';
import CInput from '@/shared/ui/AppInput.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import type { PropType } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object as PropType<{
            email: string;
            login: string;
            password: string;
            confirmPassword: string;
        }>,
        default: () => ({
            email: '',
            login: '',
            password: '',
            confirmPassword: '',
        }),
    },
});

const emit = defineEmits<{
    (
        e: 'update:modelValue',
        value: {
            email: string;
            login: string;
            password: string;
            confirmPassword: string;
        },
    ): void;
    (
        e: 'submit',
        value: { email: string; login: string; password: string },
    ): void;
}>();

const updateEmail = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', { ...props.modelValue, email: target.value });
};

const updateLogin = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', { ...props.modelValue, login: target.value });
};

const updatePassword = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', { ...props.modelValue, password: target.value });
};

const updateConfirmPassword = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', {
        ...props.modelValue,
        confirmPassword: target.value,
    });
};

const submitForm = (event: Event) => {
    event.preventDefault();
    if (props.modelValue.password !== props.modelValue.confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    emit('submit', props.modelValue);
};
</script>

<template>
    <form class="form" @submit="submitForm">
        <VFlex align="stretch" gap="16px">
            <CInput
                type="email"
                name="email"
                id="email"
                :value="modelValue.email"
                @input="updateEmail"
                placeholder="Email"
                required
            />
            <CInput
                type="text"
                name="login"
                id="login"
                :value="modelValue.login"
                @input="updateLogin"
                placeholder="Login"
                required
            />
            <CInput
                type="password"
                name="password"
                id="password"
                :value="modelValue.password"
                @input="updatePassword"
                placeholder="Password"
                required
            />
            <CInput
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                :value="modelValue.confirmPassword"
                @input="updateConfirmPassword"
                placeholder="Confirm Password"
                required
            />
            <CButton type="submit">Login</CButton>
        </VFlex>
    </form>
</template>

<style scoped lang="scss"></style>
