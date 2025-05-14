<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { HFlex, VFlex } from '@/shared/ui';
import type { LeaderboardEntry, UserBestResult } from '@/shared/types/stats';

const props = defineProps<{
    leaderboard: LeaderboardEntry[];
    userBestResult: UserBestResult | null;
    userPosition: number | null;
    currentUsername: string;
}>();

const { t } = useI18n();

const userEntry = computed(() => {
    if (!props.userBestResult) return null;
    const isInTop = props.leaderboard.some((e) => e.isCurrentUser);
    return isInTop
        ? null
        : {
              ...props.userBestResult,
              isCurrentUser: true,
          };
});
</script>

<template>
    <VFlex class="leaderboard" gap="0.75rem">
        <VFlex class="leaderboard__list" gap="0.75rem" align="stretch">
            <HFlex
                v-for="(entry, index) in leaderboard"
                :key="entry.userId + '-' + entry.cpm"
                :class="[
                    'leaderboard__item',
                    { 'leaderboard__item--me': entry.isCurrentUser },
                ]"
                justify="between"
                align="center"
                gap="0.5rem"
            >
                <span class="leaderboard__info">#{{ index + 1 }}</span>
                <span class="leaderboard__info leaderboard__info-username">
                    {{ entry.username }}
                </span>
                <span class="leaderboard__info">
                    {{ entry.cpm }} {{ t('stats.metrics.cpm') }}
                </span>
                <span class="leaderboard__info">{{ entry.accuracy }}%</span>
            </HFlex>

            <li
                v-if="userEntry"
                class="leaderboard__item leaderboard__item--me-separate"
            >
                <span class="leaderboard__dots">...</span>
            </li>

            <HFlex
                v-if="userEntry"
                class="leaderboard__item leaderboard__item--me"
                justify="between"
                align="center"
                gap="0.5rem"
            >
                <span class="leaderboard__rank">#{{ userPosition }}</span>
                <span class="leaderboard__info leaderboard__info-username">
                    {{ currentUsername }}
                </span>
                <span class="leaderboard__info">
                    {{ userBestResult?.cpm }} {{ t('stats.metrics.cpm') }}
                </span>
                <span class="leaderboard__info">
                    {{ userBestResult?.accuracy }}%
                </span>
            </HFlex>
        </VFlex>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.leaderboard {
    width: $leaderboard-width;

    &__rank {
        flex-shrink: 0;
    }

    &__list {
        width: 100%;
    }

    &__item {
        display: flex;
        gap: $leaderboard-item-gap;
        align-items: center;
        font-size: $leaderboard-item-font-size;
        padding: $leaderboard-item-padding;
        border: $border-width solid var(--primary-color);
        border-radius: $border-radius-sm;
        background-color: var(--background-tertiary);
        color: var(--primary-color);
        justify-content: space-between;

        &--me {
            font-weight: 600;
            background-color: var(--blue-adaptive-color);
            color: $white;
        }

        &--me-separate {
            background: none;
            justify-content: center;
            padding: 0;
        }
    }

    &__dots {
        color: var(--hint-color);
        font-size: $leaderboard-item-font-size;
    }

    &__info {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: $leaderboard-info-max-width;

        &-username {
            margin-right: auto;
        }
    }
}
</style>
