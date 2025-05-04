<script setup lang="ts">
import { RouteNames } from '@/app/router/router';
import AppButton from '@/shared/ui/AppButton.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const onClick = () => {
    router.push(RouteNames.MAIN);
};
</script>

<template>
    <VFlex align="center" class="not-found">
        <h1 class="not-found__title">404</h1>
        <div>{{ t('notFound.thereIsNothingHere') }}</div>
        <AppButton class="not-found__button" @click="onClick">
            {{ t('notFound.goToMain') }}
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
