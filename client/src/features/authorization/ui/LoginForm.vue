<script setup lang="ts">
import { computed } from 'vue';
import { AppButton, AppInput, AppText, VFlex } from '@/shared/ui';
import { useUserStore } from '@/entities/user';
import type { LoginForm } from '../model/authorization';

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
        userStore.setError('All fields are required');
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
                type="password"
                name="password"
                id="password"
                :value="modelValue.password"
                @input="updateField('password', $event)"
                placeholder="Password"
            />
            <VFlex align="stretch" gap="4px">
                <AppButton type="submit">Login</AppButton>
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
