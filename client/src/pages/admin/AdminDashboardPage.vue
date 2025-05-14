<script setup lang="ts">
import { AdminDashboardTile } from '@/features/admin';
import { useAdminStore } from '@/features/admin/model/adminStore';
import { onMounted } from 'vue';

const adminStore = useAdminStore();

onMounted(() => {
    adminStore.fetchStats();
});
</script>

<template>
    <AdminDashboardTile />
</template>

<style scoped lang="scss"></style>
