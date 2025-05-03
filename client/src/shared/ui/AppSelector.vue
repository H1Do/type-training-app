<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type Component, computed } from 'vue';

export type Option<T> = {
    label: string;
    value: T;
    content?: string | Component;
};

const props = defineProps<{
    modelValue: string;
    cls?: string;
    options: Option<string>[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const isOpen = ref(false);
const root = ref<HTMLElement | null>(null);

const toggle = () => {
    isOpen.value = !isOpen.value;
};

const select = (value: string) => {
    emit('update:modelValue', value);
    isOpen.value = false;
};

const onClickGlobal = (e: MouseEvent) => {
    if (root.value && !root.value.contains(e.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    window.addEventListener('click', onClickGlobal);
});

onBeforeUnmount(() => {
    window.removeEventListener('click', onClickGlobal);
});

const selectedOption = computed(() =>
    props.options.find((o) => o.value === props.modelValue),
);
</script>

<template>
    <div class="selector" ref="root">
        <button class="selector__button" @click="toggle">
            <component
                :is="selectedOption?.content ?? 'span'"
                v-if="selectedOption?.content"
            />
            <span v-else>{{ selectedOption?.label || 'Select' }}</span>
        </button>

        <div v-if="isOpen" class="selector__dropdown">
            <button
                v-for="option in props.options"
                :key="option.value"
                class="selector__option"
                @click="select(option.value)"
            >
                <component
                    :is="option.content ?? 'span'"
                    v-if="option.content"
                />
                <span v-else>{{ option.label }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.selector {
    position: relative;
    display: inline-block;

    &__button {
        background-color: var(--background-color);
        color: var(--primary-color);
        border: $border-width solid var(--primary-color);
        border-radius: $border-radius;
        padding: 6px 12px;
        font-size: 16px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
        transition: background-color $transition-duration,
            color $transition-duration;

        &:hover {
            background-color: var(--primary-color);
            color: var(--background-color);
            border-color: var(--primary-color);
        }

        &:active {
            background-color: var(--secondary-color);
            color: var(--background-color);
        }
    }

    &__dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        background: var(--background-color);
        border: $border-width solid var(--primary-color);
        border-radius: $border-radius;
        padding: 4px 0;
        z-index: 10;
        min-width: 100%;
    }

    &__option {
        padding: 6px 12px;
        font-size: 16px;
        cursor: pointer;
        color: var(--primary-color);
        background: transparent;
        border: none;
        width: 100%;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;

        &:hover {
            background-color: var(--primary-color);
            color: var(--background-color);
        }
    }
}
</style>
