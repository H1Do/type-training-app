<script setup lang="ts">
import AppButton from '@/shared/ui/AppButton.vue';
import HFlex from '@/shared/ui/HFlex.vue';
import AppTable from '@/shared/ui/table/AppTable.vue';
import AppTableCell from '@/shared/ui/table/AppTableCell.vue';
import AppTableRow from '@/shared/ui/table/AppTableRow.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { User2Icon } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import {
    getExpForLevel,
    useConfirmDialog,
    useModal,
    useModalService,
} from '@/shared/utils';
import { useUserStore } from '@/entities/user';
import ChangePasswordForm from './ui/ChangePasswordForm.vue';
import { useI18n } from 'vue-i18n';
import LevelProgress from '@/widgets/LevelProgress.vue';

const { t } = useI18n();
const userStore = useUserStore();
const modalService = useModalService();

const { email, username, createdAt } = storeToRefs(userStore);
const { logout } = userStore;

const date = new Date(createdAt.value);

const onLogout = async () => {
    const acceptStatus = await useConfirmDialog(modalService, {
        title: t('header.logout'),
        message: t('header.logoutConfirm'),
        cancelText: t('header.cancel'),
        confirmText: t('header.logout'),
    });

    if (acceptStatus) {
        logout();
    }
};

const onChangePassword = async () => {
    useModal(modalService, ChangePasswordForm);
};
</script>

<template>
    <VFlex gap="1rem">
        <h2 class="title"><User2Icon />{{ t('profile.profileData') }}</h2>
        <LevelProgress
            :level="userStore.level"
            :exp="userStore.exp"
            :required="getExpForLevel(userStore.level)"
        />
        <AppTable>
            <AppTableRow>
                <AppTableCell>{{ t('profile.username') }}:</AppTableCell>
                <AppTableCell class="data">{{ username }}</AppTableCell>
            </AppTableRow>
            <AppTableRow>
                <AppTableCell>{{ t('profile.email') }}:</AppTableCell>
                <AppTableCell class="data">{{ email }}</AppTableCell>
            </AppTableRow>
            <AppTableRow>
                <AppTableCell>{{ t('profile.registeredAt') }}:</AppTableCell>
                <AppTableCell class="data">{{
                    date.toLocaleString('ru-RU')
                }}</AppTableCell>
            </AppTableRow>
        </AppTable>
        <HFlex justify="between" gap="0.5rem" class="buttons">
            <AppButton class="changePassword" @click="onChangePassword">
                {{ t('profile.changePassword') }}
            </AppButton>
            <AppButton class="logout" @click="onLogout">{{
                t('profile.logout')
            }}</AppButton>
        </HFlex>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.title {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    gap: $gap-sm;
    margin-inline: auto;
}

.data {
    padding-left: $gap;
}

.buttons {
    width: 100%;

    .changePassword {
        color: var(--blue-adaptive-color);
        border-color: var(--blue-adaptive-color);

        &:hover {
            background-color: var(--blue-adaptive-color);
            color: $white;
            border-color: var(--blue-adaptive-color);
        }
    }

    .logout {
        color: var(--red-adaptive-color);
        border-color: var(--red-adaptive-color);

        &:hover {
            background-color: var(--red-adaptive-color);
            color: $white;
            border-color: var(--red-adaptive-color);
        }
    }
}
</style>
