<script setup lang="ts">
import AppLink from '@/shared/ui/AppLink.vue';
import { Mail, Send } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <footer class="app-footer">
        <div>&copy; 2025 Type Training App.</div>
        <div>{{ t('footer.credits') }}</div>
        <AppLink class="link" type="external" to="mailto:hidouchiha@gmail.com">
            <Mail class="link-icon" /> hidouchiha@gmail.com
        </AppLink>
        <AppLink class="link" type="external" to="https://t.me/h1dio">
            <Send class="link-icon" /> @h1dio
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
    border-radius: $footer-border-radius;
    background-color: var(--footer-background-color);
    color: var(--footer-text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
}

.link {
    color: var(--footer-text-color);
    display: flex;
    align-items: center;
}

.link-icon {
    width: 16px;
    margin-right: 4px;
}
</style>
