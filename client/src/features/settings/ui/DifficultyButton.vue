<script setup lang="ts">
import { Difficulty } from '@/shared/types';
import { AppButton, AppHint } from '@/shared/ui';
import AppIcon from '@/shared/ui/AppIcon.vue';
import AppText from '@/shared/ui/AppText.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { useSettingsStore } from '../model/settings';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

defineProps<{
    difficulty: Difficulty;
}>();

const { t } = useI18n();

const settingsStore = useSettingsStore();

const difficultyNameMap = computed(() => ({
    [Difficulty.Easy]: t('settings.difficulties.easy'),
    [Difficulty.Medium]: t('settings.difficulties.medium'),
    [Difficulty.Hard]: t('settings.difficulties.hard'),
    [Difficulty.Expert]: t('settings.difficulties.expert'),
}));

const difficultyIconMap: Record<Difficulty, string> = {
    [Difficulty.Easy]: 'Hand',
    [Difficulty.Medium]: 'Lightbulb',
    [Difficulty.Hard]: 'Keyboard',
    [Difficulty.Expert]: 'EyeOff',
};

const difficultyColorClassMap: Record<Difficulty, string> = {
    [Difficulty.Easy]: 'difficulty--easy',
    [Difficulty.Medium]: 'difficulty--medium',
    [Difficulty.Hard]: 'difficulty--hard',
    [Difficulty.Expert]: 'difficulty--extreme',
};

const difficultyHintMap = computed(() => ({
    [Difficulty.Easy]: t('settings.difficulties.hints.easy'),
    [Difficulty.Medium]: t('settings.difficulties.hints.medium'),
    [Difficulty.Hard]: t('settings.difficulties.hints.hard'),
    [Difficulty.Expert]: t('settings.difficulties.hints.expert'),
}));
</script>

<template>
    <AppHint :hint="difficultyHintMap[difficulty]">
        <AppButton
            @click="settingsStore.setDifficulty(difficulty)"
            :buttonStyle="
                settingsStore.difficulty === difficulty
                    ? 'highlighted'
                    : 'primary'
            "
            class="difficulty"
            :class="difficultyColorClassMap[difficulty]"
        >
            <VFlex align="center" gap="0.25rem">
                <AppIcon :name="difficultyIconMap[difficulty]" size="2.25rem" />
                <AppText :weight="600">{{
                    difficultyNameMap[difficulty]
                }}</AppText>
            </VFlex>
        </AppButton>
    </AppHint>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.difficulty {
    width: $settings-buttons-width;
}

.difficulty--easy {
    color: var(--easy-color);
    background-color: var(--easy-background-color);
    border-color: var(--easy-color);

    &:hover {
        background-color: var(--easy-color);
        color: var(--easy-background-color);
        border-color: var(--easy-color);
    }
}

.difficulty--medium {
    color: var(--medium-color);
    background-color: var(--medium-background-color);
    border-color: var(--medium-color);

    &:hover {
        background-color: var(--medium-color);
        color: var(--medium-background-color);
        border-color: var(--medium-color);
    }
}

.difficulty--hard {
    color: var(--hard-color);
    background-color: var(--hard-background-color);
    border-color: var(--hard-color);

    &:hover {
        background-color: var(--hard-color);
        color: var(--hard-background-color);
        border-color: var(--hard-color);
    }
}

.difficulty--extreme {
    color: var(--extreme-color);
    background-color: var(--extreme-background-color);
    border-color: var(--extreme-color);

    &:hover {
        background-color: var(--extreme-color);
        color: var(--extreme-background-color);
        border-color: var(--extreme-color);
    }
}
</style>
