<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, watch } from 'vue';
import { LessonTile, useLessonsStore } from '@/features/lessons';

const lessonsStore = useLessonsStore();
const route = useRoute();

onMounted(() => {
    const id = route.params.id as string;
    lessonsStore.setLessonId(id);
    lessonsStore.fetchLesson();
});

watch(
    () => route.params.id,
    (lesson) => {
        if (lesson) {
            lessonsStore.setLessonId(route.params.id as string);
            lessonsStore.fetchLesson();
        }
    },
);
</script>

<template>
    <LessonTile />
</template>
