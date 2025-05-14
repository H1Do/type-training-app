<script setup lang="ts">
import { useUserStore } from '@/entities/user';
import { useLessonsStore } from '@/features/lessons';
import MainTile from '@/features/main/MainTile.vue';
import { useStatsStore } from '@/features/stats';
import { onMounted } from 'vue';

const lessonsStore = useLessonsStore();
const userStore = useUserStore();
const statsStore = useStatsStore();

onMounted(() => {
    if (!lessonsStore.lessons.length && userStore.isAuthenticated) {
        lessonsStore.fetchLessons();
        statsStore.fetchTopUsers();
    }
});
</script>

<template>
    <MainTile
        :earnedStars="lessonsStore.getEarnedStars"
        :totalStars="lessonsStore.getTotalStars"
        :topUsers="statsStore.topUsers"
    />
</template>

<style scoped lang="scss"></style>
