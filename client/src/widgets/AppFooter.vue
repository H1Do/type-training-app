<script setup lang="ts">
import { AppIcon } from '@/shared/ui';
import AppLink from '@/shared/ui/AppLink.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <footer class="app-footer">
        <div>&copy; 2025 Type Training App.</div>
        <div>{{ t('footer.credits') }}</div>
        <AppLink class="link" type="external" to="mailto:hidouchiha@gmail.com">
            <AppIcon name="Mail" class="link-icon" size="1rem" />
            hidouchiha@gmail.com
        </AppLink>

        <AppLink class="link" type="external" to="https://t.me/h1dio">
            <AppIcon name="Send" class="link-icon" size="1rem" /> @h1dio
        </AppLink>
    </footer>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.app-footer {
    width: 100%;
    font-size: $footer-font-size;
    height: $footer-height;
    padding-inline: $footer-padding;
    background-color: var(--footer-background-color);
    color: var(--footer-text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $gap-xl;
}

.link {
    color: var(--footer-text-color);
    display: flex;
    align-items: center;
}

.link-icon {
    margin-right: 0.25rem;
}
</style>
