<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TopUsersByLevelResponse } from '@/shared/types/stats';
import { AppIcon, AppText, HFlex, VFlex } from '@/shared/ui';

const { t } = useI18n();

const props = defineProps<{
    topUsers: TopUsersByLevelResponse | null;
}>();

const userEntry = computed(() => {
    if (!props.topUsers) return null;

    const { topUsers, userPosition } = props.topUsers;

    const isInTop = topUsers.some((u) => u.isCurrentUser);
    if (isInTop || userPosition == null) return null;

    return {
        position: userPosition,
        username: '',
        level: 0,
        exp: 0,
    };
});
</script>

<template>
    <VFlex class="leaderboard" gap="0.75rem">
        <VFlex class="leaderboard__list" gap="0.75rem" align="stretch">
            <HFlex justify="center" gap="1rem">
                <AppIcon name="Trophy" />
                <AppText :weight="600" align="center">{{
                    t('stats.bestUsers')
                }}</AppText>
            </HFlex>
            <HFlex
                v-for="(entry, index) in topUsers?.topUsers"
                :key="entry.userId + '-' + entry.level"
                :class="[
                    'leaderboard__item',
                    { 'leaderboard__item--me': entry.isCurrentUser },
                ]"
                justify="between"
                align="center"
                gap="0.5rem"
            >
                <span class="leaderboard__info leaderboard__rank"
                    >#{{ index + 1 }}</span
                >
                <span class="leaderboard__info leaderboard__info-username">
                    {{ entry.username }}
                </span>
                <span class="leaderboard__info">
                    {{ t('level.level') }} {{ entry.level }}
                </span>
                <span class="leaderboard__info">{{ entry.exp }} XP</span>
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
                <span class="leaderboard__rank">#{{ userEntry.position }}</span>
                <span class="leaderboard__info leaderboard__info-username">
                    {{ userEntry.username || 'You' }}
                </span>
                <span class="leaderboard__info">
                    {{ t('stats.level') }} {{ userEntry.level }}
                </span>
                <span class="leaderboard__info">{{ userEntry.exp }} XP</span>
            </HFlex>
        </VFlex>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.leaderboard {
    width: 100%;
    max-width: 30rem;
    gap: 0.75rem;
}

.leaderboard__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
}

.leaderboard__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: $leaderboard-item-padding;
    border: $border-width-big solid var(--primary-color);
    border-radius: $border-radius-sm;
    background-color: var(--background-tertiary);
    color: var(--primary-color);
    font-size: $leaderboard-item-font-size;
    width: 100%;

    &--me {
        font-weight: 600;
        background-color: var(--blue-adaptive-color);
        color: $white;
    }

    &--me-separate {
        background: none;
        justify-content: center;
        padding: 0;
        border: none;
    }
}

.leaderboard__dots {
    color: var(--hint-color);
    font-size: $leaderboard-item-font-size;
}

.leaderboard__info {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: $leaderboard-info-max-width;

    &-username {
        margin-right: auto;
    }
}

.leaderboard__rank {
    font-weight: 600;
    flex-shrink: 0;
}
</style>
