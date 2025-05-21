<script setup lang="ts">
import { computed } from 'vue';
import { AppButton, AppInput, AppText, VFlex } from '@/shared/ui';
import { useUserStore } from '@/entities/user';
import type { LoginForm } from '../model/authorization';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    modelValue: {
        type: Object as () => LoginForm,
        required: true,
    },
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: LoginForm): void;
    (e: 'update:error', value: string): void;
    (e: 'submit', value: LoginForm): void;
}>();

const userStore = useUserStore();

const canSubmit = computed(() => {
    const { email, password } = props.modelValue;
    return !!email.trim() && !!password.trim();
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
        userStore.setError(t('auth.allFieldsRequired'));
        return;
    }
    if (props.modelValue.password.length < 8) {
        userStore.setError(t('auth.passwordTooShort'));
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
                type="password"
                name="password"
                id="password"
                :value="modelValue.password"
                @input="updateField('password', $event)"
                :placeholder="t('auth.password')"
            />
            <VFlex align="stretch" gap="0.25rem">
                <AppButton type="submit">{{ t('auth.login') }}</AppButton>
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

<style scoped lang="scss">
.form {
    width: 100%;
}
</style>
