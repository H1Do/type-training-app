<script setup lang="ts">
withDefaults(
    defineProps<{
        modelValue?: string;
        disabled?: boolean;
        placeholder?: string;
        name?: string;
        id?: string;
        required?: boolean;
        error?: boolean;
        rows?: number;
        cols?: number;
    }>(),
    {
        disabled: false,
        placeholder: '',
        name: '',
        id: '',
        required: false,
        rows: 6,
        cols: 50,
    },
);

const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit('update:modelValue', target.value);
};
</script>

<template>
    <textarea
        :disabled="disabled"
        :placeholder="placeholder"
        :name="name"
        :id="id"
        :required="required"
        :rows="rows"
        :cols="cols"
        :value="modelValue"
        @input="onInput"
        class="input"
        :class="{ error }"
    ></textarea>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.input {
    background-color: var(--background-color);
    color: var(--primary-color);
    border: $border-width solid var(--primary-color);
    border-radius: $border-radius;
    padding: $app-textarea-input;
    font-size: $app-textarea-font-size;
    transition: background-color $transition-duration,
        color $transition-duration, border-color $transition-duration;
    outline: none;
    width: 100%;
    resize: vertical;

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
        opacity: $app-textarea-placeholder-opacity;
        transition: opacity $transition-duration;
    }

    &:hover,
    &:focus {
        background-color: var(--primary-color);
        color: var(--background-color);
        border-color: var(--primary-color);

        &::placeholder {
            color: var(--background-color);
        }
    }

    &:disabled {
        opacity: $app-textarea-disabled-opacity;
        cursor: not-allowed;
        background-color: var(--background-color);
    }
}
</style>
