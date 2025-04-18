<script setup lang="ts">
withDefaults(
    defineProps<{
        modelValue?: string;
        type?: 'text' | 'email' | 'password';
        disabled?: boolean;
        placeholder?: string;
        name?: string;
        id?: string;
        required?: boolean;
    }>(),
    {
        type: 'text',
        disabled: false,
        placeholder: '',
        name: '',
        id: '',
        required: false,
    },
);

const emit = defineEmits(['update:modelValue']);

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};
</script>

<template>
    <input
        :type="type"
        :disabled="disabled"
        :placeholder="placeholder"
        :name="name"
        :id="id"
        :required="required"
        :value="modelValue"
        @input="handleInput"
        class="input"
    />
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.input {
    background-color: var(--background-color);
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 16px;
    transition: background-color $transition-duration,
        color $transition-duration, border-color $transition-duration;
    outline: none;
    width: 100%;

    &::placeholder {
        color: var(--secondary-color);
        opacity: 0.6;
        transition: opacity $transition-duration;
    }

    &:hover,
    &:focus {
        background-color: var(--primary-color);
        color: var(--background-color);
        border: 1px solid var(--primary-color);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background-color: var(--background-color);
    }
}
</style>
