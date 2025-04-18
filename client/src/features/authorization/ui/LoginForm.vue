<script setup lang="ts">
import { useUserStore } from '@/shared/models/user';
import AppButton from '@/shared/ui/AppButton.vue';
import AppInput from '@/shared/ui/AppInput.vue';
import AppText from '@/shared/ui/AppText.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { computed } from 'vue';

export type LoginModelValueType = {
    email: string;
    password: string;
};

const props = defineProps<{
    modelValue: LoginModelValueType;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: LoginModelValueType): void;
    (e: 'update:error', value: string): void;
    (e: 'submit', value: LoginModelValueType): void;
}>();

const userStore = useUserStore();

const canSubmit = computed(() => {
    const { email, password } = props.modelValue;
    return !!email.trim() && !!password.trim();
});

const updateField = (field: keyof LoginModelValueType, event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: target.value,
    });
    userStore.setError('');
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
