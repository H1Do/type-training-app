<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useUserStore } from '@/entities/user';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
    const token = route.query.token as string;
    if (!token) {
        router.push('/');
    }
    if (token) {
        await userStore.verifyEmail(token);
        router.push('/');
    }
});
</script>

<template>
    <div class="tile">
        <p>{{ t('auth.emailVerifying') }}...</p>
    </div>
</template>
