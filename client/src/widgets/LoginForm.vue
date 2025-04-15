<script setup lang="ts">
import AppButton from '@/shared/ui/AppButton.vue';
import AppInput from '@/shared/ui/AppInput.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import type { PropType } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object as PropType<{
            email: string;
            password: string;
        }>,
        default: () => ({
            email: '',
            password: '',
        }),
    },
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: { email: string; password: string }): void;
    (e: 'submit', value: { email: string; password: string }): void;
}>();

const updateEmail = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', { ...props.modelValue, email: target.value });
};

const updatePassword = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', { ...props.modelValue, password: target.value });
};

const submitForm = (event: Event) => {
    event.preventDefault();
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
                @input="updateEmail"
                placeholder="Email"
                required
            />
            <AppInput
                type="password"
                name="password"
                id="password"
                :value="modelValue.password"
                @input="updatePassword"
                placeholder="Password"
                required
            />
            <AppButton type="submit">Login</AppButton>
        </VFlex>
    </form>
</template>

<style scoped lang="scss"></style>
