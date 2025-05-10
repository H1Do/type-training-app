<script setup lang="ts">
import { computed } from 'vue';
import { useStatsStore } from '../model/statsStore';
import { useUserStore } from '@/entities/user';
import { useI18n } from 'vue-i18n';
import { HFlex, VFlex } from '@/shared/ui';

const { t } = useI18n();

const statsStore = useStatsStore();
const user = useUserStore();

const userEntry = computed(() => {
    if (!statsStore.stats || !statsStore.stats.userBestResult) return null;
    const isInTop = (statsStore.stats?.leaderboard ?? []).some(
        (e) => e.isCurrentUser,
    );
    return isInTop
        ? null
        : {
              ...statsStore.stats.userBestResult,
              isCurrentUser: true,
          };
});
</script>

<template>
    <VFlex class="leaderboard" gap="0.75rem">
        <h2 class="leaderboard__title">{{ t('stats.leaderboard.title') }}</h2>

        <VFlex class="leaderboard__list" gap="0.75rem" align="stretch">
            <HFlex
                v-for="(entry, index) in statsStore.stats?.leaderboard ?? []"
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
                <span class="leaderboard__info leaderboard__info-username">{{
                    entry.username
                }}</span>
                <span class="leaderboard__info"
                    >{{ entry.cpm }} {{ t('stats.metrics.cpm') }}</span
                >
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
                <span class="leaderboard__rank"
                    >#{{ statsStore.stats?.position }}</span
                >
                <span class="leaderboard__info leaderboard__info-username">{{
                    user.username
                }}</span>
                <span class="leaderboard__info"
                    >{{ statsStore.stats?.userBestResult?.cpm }}
                    {{ t('stats.metrics.cpm') }}</span
                >
                <span class="leaderboard__info"
                    >{{ statsStore.stats?.userBestResult?.accuracy }}%</span
                >
            </HFlex>
        </VFlex>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.leaderboard {
    width: $leaderboard-width;

    &__list {
        width: 100%;
    }

    &__title {
        font-size: $leaderboard-title-font-size;
        font-weight: 700;
        margin: 0;
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
