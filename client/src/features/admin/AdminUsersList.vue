<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import {
    AppButton,
    AppInput,
    AppLoader,
    AppText,
    VFlex,
    HFlex,
    AppIcon,
    AppHint,
} from '@/shared/ui';
import { useI18n } from 'vue-i18n';
import { useAdminStore } from './model/admin';
import { useRouter } from 'vue-router';
import { RouteNames } from '@/app/router';

const { t } = useI18n();
const router = useRouter();

const adminStore = useAdminStore();
const { users, isLoading, searchQuery, totalUsers, limit, offset } =
    storeToRefs(adminStore);

const totalPages = computed(() => Math.ceil(totalUsers.value / limit.value));
const currentPage = computed(() => offset.value / limit.value);

onMounted(() => {
    adminStore.fetchUsers();
});

const onSearch = () => {
    adminStore.setQuery(searchQuery.value);
};

const goToPage = (page: number) => {
    adminStore.setPage(page);
};

const onViewStats = (userId: string) => {
    router.push({
        name: RouteNames.ADMIN_USER_STATS,
        params: { userId },
    });
};

const onBlockToggle = (userId: string, isBlocked: boolean) => {
    if (isBlocked) {
        adminStore.unblockUser(userId);
    } else {
        adminStore.blockUser(userId);
    }
};
</script>

<template>
    <VFlex gap="1rem" align="center">
        <AppText size="2rem" :weight="600">{{ t('admin.users') }}</AppText>

        <AppInput
            v-model="searchQuery"
            :placeholder="t('admin.searchPlaceholder')"
            @keyup.enter="onSearch"
        />

        <AppLoader v-if="isLoading" />

        <div v-else>
            <VFlex gap="0.5rem">
                <HFlex
                    v-for="user in users"
                    :key="user.id"
                    align="center"
                    class="user-row"
                    gap="1rem"
                >
                    <HFlex gap="1rem" class="data">
                        <AppText
                            :weight="600"
                            class="username"
                            :style="{
                                banned: user.isBlocked,
                            }"
                            :decoration="
                                user.isBlocked ? 'line-through' : undefined
                            "
                            >{{ user.username }}</AppText
                        >
                        <AppText
                            :decoration="
                                user.isBlocked ? 'line-through' : undefined
                            "
                            >{{ user.email }}</AppText
                        >
                    </HFlex>

                    <HFlex gap="0.5rem" justify="between">
                        <AppHint :hint="t('admin.actions.view_stats')">
                            <AppButton @click="onViewStats(user.id)">
                                <AppIcon name="Eye" />
                            </AppButton>
                        </AppHint>

                        <AppHint
                            :hint="
                                user.isBlocked
                                    ? t('admin.actions.unblock')
                                    : t('admin.actions.block')
                            "
                            ><AppButton
                                @click="onBlockToggle(user.id, user.isBlocked)"
                            >
                                <AppIcon
                                    name="LockOpen"
                                    v-if="user.isBlocked"
                                />
                                <AppIcon name="Lock" v-else /> </AppButton
                        ></AppHint>
                    </HFlex>
                </HFlex>
            </VFlex>

            <HFlex
                gap="0.5rem"
                justify="center"
                class="pagination"
                v-if="totalPages > 1"
            >
                <AppButton
                    v-for="page in totalPages"
                    :key="page"
                    :tone="currentPage === page - 1 ? 'primary' : 'default'"
                    @click="goToPage(page - 1)"
                >
                    {{ page }}
                </AppButton>
            </HFlex>
        </div>
    </VFlex>
</template>

<style scoped lang="scss">
.user-row {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    width: 100%;
}

.data {
    margin-right: auto;
}

.username {
    margin-right: auto;
}

.pagination {
    margin-top: 1rem;
}
</style>
