<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
    type: {
        type: String as PropType<'text' | 'email' | 'password'>,
        default: 'text',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);
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
        @input="
            (event) => {
				const target = event.target as HTMLInputElement | null;
				if (target) emit('update:modelValue', target.value);
			}
        "
        class="input"
    />
</template>

<style scoped lang="scss">
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
