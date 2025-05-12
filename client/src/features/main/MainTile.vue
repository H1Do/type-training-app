<script setup lang="ts">
import { useUserStore } from '@/entities/user';

const userStore = useUserStore();
</script>

<template>
    <div v-if="userStore.isAuthenticated">Авторизован</div>
    <div v-else>Не авторизован</div>
</template>

<style scoped lang="scss"></style>
