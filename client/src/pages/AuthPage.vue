<template>
    <div>AuthPage</div>
    <ToggleThemeButton />
    <CInput
        v-model="email"
        type="email"
        placeholder="Email"
        name="email"
        id="email"
        required
    />
</template>

<script setup lang="ts">
import { CInput, ToggleThemeButton } from '@ui';
import { ref } from 'vue';
const email = ref('');
</script>

<style scoped lang="scss"></style>
