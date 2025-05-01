<script setup lang="ts">
import { Difficulty } from '@/shared/types';
import { AppButton } from '@/shared/ui';
import AppIcon from '@/shared/ui/AppIcon.vue';
import AppText from '@/shared/ui/AppText.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { useSettingsStore } from '../model/settings';

defineProps<{
    difficulty: Difficulty;
}>();

const settingsStore = useSettingsStore();

const difficultyNameMap: Record<Difficulty, string> = {
    [Difficulty.ZONE_HINTS]: 'Zones',
    [Difficulty.KEY_HINTS]: 'Hints',
    [Difficulty.FULL_KEYBOARD]: 'Full',
    [Difficulty.BLIND]: 'Blind',
};

const difficultyIconMap: Record<Difficulty, string> = {
    [Difficulty.ZONE_HINTS]: 'Hand',
    [Difficulty.KEY_HINTS]: 'Lightbulb',
    [Difficulty.FULL_KEYBOARD]: 'Keyboard',
    [Difficulty.BLIND]: 'EyeOff',
};

const difficultyColorClassMap: Record<Difficulty, string> = {
    [Difficulty.ZONE_HINTS]: 'difficulty--easy',
    [Difficulty.KEY_HINTS]: 'difficulty--medium',
    [Difficulty.FULL_KEYBOARD]: 'difficulty--hard',
    [Difficulty.BLIND]: 'difficulty--extreme',
};
</script>

<template>
    <AppButton
        @click="settingsStore.setDifficulty(difficulty)"
        :buttonStyle="
            settingsStore.difficulty === difficulty ? 'highlighted' : 'primary'
        "
        class="difficulty"
        :class="difficultyColorClassMap[difficulty]"
    >
        <VFlex align="center" gap="4px">
            <AppIcon :name="difficultyIconMap[difficulty]" :size="36" />
            <AppText :weight="600">{{ difficultyNameMap[difficulty] }}</AppText>
        </VFlex>
    </AppButton>
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
