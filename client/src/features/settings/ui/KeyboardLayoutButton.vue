<script setup lang="ts">
import type { Layout } from '@/shared/types';
import { AppButton } from '@/shared/ui';
import AppIcon from '@/shared/ui/AppIcon.vue';
import AppText from '@/shared/ui/AppText.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { layoutNameMap, useSettingsStore } from '../model/settings';

defineProps<{
    layout: Layout;
}>();

const settingsStore = useSettingsStore();
</script>

<template>
    <AppButton
        @click="settingsStore.setLayout(layout)"
        :buttonStyle="
            settingsStore.layout === layout ? 'highlighted' : 'primary'
        "
        class="layout"
    >
        <VFlex align="center" gap="0.25rem">
            <AppIcon name="Keyboard" size="2.25rem" />
            <AppText :weight="600">{{ layoutNameMap[layout] }}</AppText>
        </VFlex>
    </AppButton>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.layout {
    width: $settings-buttons-width;
}
</style>
