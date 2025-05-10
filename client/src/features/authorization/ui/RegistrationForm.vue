<script setup lang="ts">
import { computed } from 'vue';
import { AppButton, AppInput, AppText, VFlex } from '@/shared/ui';
import { useUserStore } from '@/entities/user';
import type { RegistrationForm } from '../model/authorization';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    modelValue: {
        type: Object as () => RegistrationForm,
        required: true,
    },
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: RegistrationForm): void;
    (e: 'update:error', value: string): void;
    (e: 'submit', value: RegistrationForm): void;
}>();

const userStore = useUserStore();

const canSubmit = computed(() => {
    const { email, login, password, confirmPassword } = props.modelValue;
    return (
        !!email.trim() &&
        !!login.trim() &&
        !!password.trim() &&
        !!confirmPassword.trim()
    );
});

const updateField = (field: keyof typeof props.modelValue, event: Event) => {
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
        <VFlex align="stretch" gap="1rem">
            <AppInput
                type="email"
                name="email"
                id="email"
                :value="modelValue.email"
                @input="updateField('email', $event)"
                :placeholder="t('auth.email')"
            />
            <AppInput
                type="text"
                name="login"
                id="login"
                :value="modelValue.login"
                @input="updateField('login', $event)"
                :placeholder="t('auth.login')"
            />
            <AppInput
                type="password"
                name="password"
                id="password"
                :value="modelValue.password"
                @input="updateField('password', $event)"
                :placeholder="t('auth.password')"
            />
            <AppInput
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                :value="modelValue.confirmPassword"
                @input="updateField('confirmPassword', $event)"
                :placeholder="t('auth.confirmPassword')"
            />
            <VFlex align="stretch" gap="0.25rem">
                <AppButton type="submit">{{
                    t('auth.registration')
                }}</AppButton>
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
