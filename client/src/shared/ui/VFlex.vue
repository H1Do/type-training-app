<script setup lang="ts">
withDefaults(
    defineProps<{
        align?: 'start' | 'center' | 'end' | 'stretch';
        justify?: 'start' | 'center' | 'between' | 'around' | 'evenly' | 'end';
        gap?: '0px' | '4px' | '8px' | '12px' | '16px';
    }>(),
    {
        align: 'start',
        justify: 'start',
        gap: '0px',
    },
);
</script>

<template>
    <div
        class="v-flex"
        :class="`align-${align} justify-${justify}`"
        :style="{ gap }"
    >
        <slot />
    </div>
</template>

<style scoped lang="scss">
.v-flex {
    display: flex;
    flex-direction: column;

    &.align-start {
        align-items: flex-start;
    }
    &.align-center {
        align-items: center;
    }
    &.align-end {
        align-items: flex-end;
    }
    &.align-stretch {
        align-items: stretch;
    }

    &.justify-start {
        justify-content: flex-start;
    }
    &.justify-center {
        justify-content: center;
    }
    &.justify-between {
        justify-content: space-between;
    }
    &.justify-around {
        justify-content: space-around;
    }
    &.justify-evenly {
        justify-content: space-evenly;
    }
    &.justify-end {
        justify-content: flex-end;
    }
}
</style>
