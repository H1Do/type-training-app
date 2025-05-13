<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/entities/user';
import {
    AppText,
    AppIcon,
    VFlex,
    LogoIcon,
    AppButton,
    HFlex,
} from '@/shared/ui';
import { useI18n } from 'vue-i18n';
import { LevelProgress } from '@/widgets';
import { getExpForLevel } from '@/shared/utils';
import type { TopUsersByLevelResponse } from '@/shared/types';
import LeaderboardByLevel from '@/widgets/LeaderboardByLevel.vue';

defineProps<{
    earnedStars: number;
    totalStars: number;
    topUsers: TopUsersByLevelResponse | null;
}>();

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const goToLogin = () => router.push('/auth');
const goToStats = () => router.push('/stats');
const goToLessons = () => router.push('/lessons');
const goToTraining = () => router.push('/training');
</script>

<template>
    <div v-if="userStore.isAuthenticated">
        <VFlex align="center" gap="2rem">
            <LogoIcon :invertedColors="true" width="12.8rem" height="4rem" />

            <AppText align="center" class="description" size="2rem">
                {{ t('main.welcome') }},
                <AppText :weight="600" size="2rem">{{
                    userStore.username
                }}</AppText
                >!
            </AppText>

            <LevelProgress
                :level="userStore.level"
                :exp="userStore.exp"
                :required="getExpForLevel(userStore.level)"
                class="level-progress"
            />

            <HFlex gap="1rem">
                <VFlex class="card-grid" gap="1rem">
                    <VFlex
                        class="card"
                        @click="goToLessons"
                        align="center"
                        justify="center"
                        gap="0.5rem"
                    >
                        <AppIcon name="Star" size="2rem" />
                        <AppText :weight="600">{{
                            t('main.cards.starsTitle')
                        }}</AppText>
                        <AppText size="sm" align="center">
                            {{
                                t('main.cards.starsDescription') +
                                ' ' +
                                earnedStars +
                                ' / ' +
                                totalStars
                            }}
                        </AppText>
                    </VFlex>

                    <VFlex
                        class="card"
                        @click="goToStats"
                        align="center"
                        justify="center"
                        gap="0.5rem"
                    >
                        <AppIcon name="BarChart3" size="2rem" />
                        <AppText :weight="600">{{
                            t('main.cards.statsTitle')
                        }}</AppText>
                        <AppText size="sm" align="center">
                            {{ t('main.cards.statsDescription') }}
                        </AppText>
                    </VFlex>

                    <VFlex
                        class="card"
                        @click="goToTraining"
                        align="center"
                        justify="center"
                        gap="0.5rem"
                    >
                        <AppIcon name="Keyboard" size="2rem" />
                        <AppText :weight="600">{{
                            t('main.cards.training')
                        }}</AppText>
                        <AppText size="sm" align="center">
                            {{ t('main.cards.trainingDescription') }}
                        </AppText>
                    </VFlex>
                </VFlex>
                <LeaderboardByLevel :topUsers="topUsers" class="leaderboard" />
            </HFlex>
        </VFlex>
    </div>
    <div v-else>
        <VFlex align="center" justify="center" gap="1.5rem">
            <LogoIcon :invertedColors="true" width="12.8rem" height="4rem" />

            <AppText class="description" align="center">
                <AppText :weight="600">KeySpark</AppText> —
                {{ t('main.description') }}
            </AppText>

            <VFlex class="benefits" gap="0.5rem">
                <span class="benefits__item">
                    <AppIcon name="Keyboard" /> {{ t('main.benefits.stats') }}
                </span>
                <span class="benefits__item">
                    <AppIcon name="BookCheck" />
                    {{ t('main.benefits.lessons') }}
                </span>
                <span class="benefits__item">
                    <AppIcon name="ChartSpline" />
                    {{ t('main.benefits.leveling') }}
                </span>
                <span class="benefits__item">
                    <AppIcon name="EyeOff" />
                    {{ t('main.benefits.difficulty') }}
                </span>
                <span class="benefits__item">
                    <AppIcon name="CodeXml" /> {{ t('main.benefits.syntax') }}
                </span>
            </VFlex>

            <AppText align="center">
                {{ t('main.callToAction') }}
            </AppText>

            <AppButton @click="goToLogin" class="button-with-icon">
                <AppIcon name="KeyRound" /> {{ t('main.login') }}
            </AppButton>

            <AppText align="center">
                {{ t('main.tryWithoutAuth') }}
            </AppText>

            <AppButton class="button-with-icon" @click="goToTraining">
                <AppIcon name="Keyboard" /> {{ t('main.startTraining') }}
            </AppButton>
        </VFlex>
    </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.leaderboard {
    width: 16rem;
    padding: 1rem;
    border: var(--primary-color) solid $border-width-big;
    border-radius: 1rem;
}

.description {
    max-width: 30rem;
}

.card-grid {
    gap: 1rem;
    align-items: center;
}

.card {
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
    border: var(--primary-color) solid $border-width-big;
    cursor: pointer;
    width: 16rem;
    height: 10rem;
    gap: 0.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    transition: $transition-duration color,
        $transition-duration background-color;

    &:hover {
        color: var(--background-color);
        background-color: var(--primary-color);
    }
}

.benefits {
    max-width: 30rem;

    &__item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
}

.button-with-icon {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
