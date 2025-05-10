<script setup lang="ts">
withDefaults(
    defineProps<{
        modelValue?: string | number;
        type?: 'text' | 'email' | 'password' | 'number';
        disabled?: boolean;
        placeholder?: string;
        name?: string;
        id?: string;
        required?: boolean;
        error?: boolean;
        min?: number;
        max?: number;
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

const onInput = (event: Event) => {
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
        @input="onInput"
        class="input"
        :class="{ error }"
        :min="min"
        :max="max"
    />
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.input {
    background-color: var(--background-color);
    color: var(--primary-color);
    border: $border-width solid var(--primary-color);
    border-radius: $border-radius;
    padding: $input-padding;
    font-size: $input-font-size;
    transition: background-color $transition-duration,
        color $transition-duration, border-color $transition-duration;
    outline: none;
    width: 100%;

    &[type='number'] {
        -moz-appearance: textfield;
    }
    &[type='number']::-webkit-outer-spin-button,
    &[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &.error {
        border-color: $error;

        &::placeholder {
            color: $error;
        }

        &:hover,
        &:focus {
            background-color: $error;
            color: $white;
            border-color: $error;

            &::placeholder {
                color: $white;
            }
        }
    }

    &::placeholder {
        color: var(--secondary-color);
        opacity: 0.6;
        transition: opacity $transition-duration;
    }

    &:hover,
    &:focus {
        background-color: var(--primary-color);
        color: var(--background-color);
        border-color: var(--primary-color);
    }

    &:disabled {
        opacity: $input-disabled-opacity;
        cursor: not-allowed;
        background-color: var(--background-color);
    }
}
</style>
