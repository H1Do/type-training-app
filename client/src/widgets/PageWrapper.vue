<script setup lang="ts"></script>

<template>
    <main class="page-wrapper">
        <slot />
    </main>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.page-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - #{$header-height} - #{$footer-height});
    background-color: var(--background-color);
}
</style>
