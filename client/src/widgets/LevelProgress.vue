<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    level: number;
    exp: number;
    required: number;
    earned?: number;
    isLevelUp?: boolean;
}>();

const progress = computed(() =>
    Math.min(100, Math.floor((props.exp / props.required) * 100)),
);

const previousProgress = computed(() =>
    Math.max(
        0,
        Math.floor(((props.exp - (props.earned ?? 0)) / props.required) * 100),
    ),
);

const earnedProgress = computed(() =>
    Math.min(progress.value - previousProgress.value, 100),
);
</script>

<template>
    <div class="level-progress">
        <div class="level-info">
            <span class="level">{{ t('level.level') }} {{ level }}</span>
            <span class="exp">
                {{ exp }} / {{ required }} XP
                <template v-if="earned">
                    &nbsp;
                    <span class="earned">+{{ earned }} XP</span>
                </template>
            </span>
        </div>

        <div class="progress-bar">
            <div
                class="progress-fill"
                :style="{
                    width: `${progress}%`,
                    backgroundColor: `var(--level-color-${level})`,
                }"
            ></div>

            <div
                v-if="earned && earnedProgress > 0"
                class="progress-earned"
                :style="{
                    left: `${previousProgress}%`,
                    width: `${earnedProgress}%`,
                }"
            ></div>
        </div>

        <div v-if="isLevelUp" class="level-up">
            {{ $t('level.levelUp') || 'Level up!' }}
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.level-progress {
    display: flex;
    flex-direction: column;
    gap: $gap-xs;
    width: 100%;
}

.level-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 0.9rem;

    .earned {
        color: var(--earned-progress-color);
        font-weight: 600;
    }
}

.progress-bar {
    position: relative;
    height: 0.75rem;
    width: 100%;
    background: var(--progress-bg);
    border-radius: $border-radius-bigger;
    overflow: hidden;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08);
}

.progress-fill {
    height: 100%;
    transition: width $transition-duration ease;
    position: relative;
}

.progress-earned {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: var(--earned-progress-bg);
    pointer-events: none;
    transition: width $transition-duration ease, left $transition-duration ease;
    border-left: 1px solid rgba(255, 255, 255, 0.3);
}

.level-up {
    margin-top: $gap-xs;
    text-align: center;
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--level-up-color);
}
</style>
