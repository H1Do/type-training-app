<script setup lang="ts">
import { RouteNames } from '@/app/router/router';
import AppButton from '@/shared/ui/AppButton.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const onClick = () => {
    router.push(RouteNames.MAIN);
};
</script>

<template>
    <VFlex align="center" class="not-found">
        <h1 class="not-found__title">404</h1>
        <div>There is nothing here...</div>
        <AppButton class="not-found__button" @click="onClick">
            Go to main page
        </AppButton>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.not-found {
    font-size: 2rem;
    color: $red;

    &__title {
        font-size: 6rem;
        line-height: 1;
        color: $red;
    }

    &__button {
        color: $red;
        border-color: $red;
        margin-top: 1rem;

        &:hover {
            color: $white;
            background-color: $red;
            border-color: $red;
        }
    }
}
</style>
