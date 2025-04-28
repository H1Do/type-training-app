<script setup lang="ts">
import { AppButton } from '@/shared/ui';
import AppIcon from '@/shared/ui/AppIcon.vue';
import AppText from '@/shared/ui/AppText.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import {
    layoutNameMap,
    useSettingsStore,
    type Layout,
} from '../model/settings';

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
    >
        <VFlex align="center" gap="4px">
            <AppIcon name="Keyboard" :size="36" />
            <AppText :weight="600">{{ layoutNameMap[layout] }}</AppText>
        </VFlex>
    </AppButton>
</template>

<style scoped lang="scss"></style>
