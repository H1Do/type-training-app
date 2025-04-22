<script setup lang="ts">
import { useUserApi } from '@/shared/domains/userApi';
import { useConfirmDialog, useModalService } from '@/shared/hooks/modal';
import { useUserStore } from '@/shared/models/user';
import { useMessageService } from '@/shared/services/MessageService';
import AppButton from '@/shared/ui/AppButton.vue';
import HFlex from '@/shared/ui/HFlex.vue';
import AppTable from '@/shared/ui/table/AppTable.vue';
import AppTableCell from '@/shared/ui/table/AppTableCell.vue';
import AppTableRow from '@/shared/ui/table/AppTableRow.vue';
import VFlex from '@/shared/ui/VFlex.vue';
import { User2Icon } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const modalService = useModalService();
const userApi = useUserApi();
const messageService = useMessageService();

const { email, username, createdAt } = storeToRefs(userStore);
const { changePassword, logout } = userStore;

const date = new Date(createdAt.value);

const onLogout = async () => {
    const acceptStatus = await useConfirmDialog(modalService, {
        title: 'Logout',
        message: 'Are you sure want to logout?',
    });

    if (acceptStatus) {
        logout(userApi, messageService);
    }
};
</script>

<template>
    <VFlex gap="16px">
        <h2 class="title"><User2Icon /> Profile data</h2>
        <AppTable>
            <AppTableRow>
                <AppTableCell>Username:</AppTableCell>
                <AppTableCell class="data">{{ username }}</AppTableCell>
            </AppTableRow>
            <AppTableRow>
                <AppTableCell>Email:</AppTableCell>
                <AppTableCell class="data">{{ email }}</AppTableCell>
            </AppTableRow>
            <AppTableRow>
                <AppTableCell>Registered at:</AppTableCell>
                <AppTableCell class="data">{{
                    date.toLocaleString('ru-RU')
                }}</AppTableCell>
            </AppTableRow>
        </AppTable>
        <HFlex justify="between" gap="8px" class="buttons">
            <AppButton class="changePassword" @click="changePassword"
                >Change password</AppButton
            >
            <AppButton class="logout" @click="onLogout">Logout</AppButton>
        </HFlex>
    </VFlex>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables' as *;

.title {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    gap: 8px;
    margin-inline: auto;
}

.data {
    padding-left: 16px;
}

.buttons {
    width: 100%;

    .changePassword {
        color: $dark-blue;
        border-color: $dark-blue;

        &:hover {
            background-color: $dark-blue;
            color: $white;
            border-color: $dark-blue;
        }
    }

    .logout {
        color: $dark-red;
        border-color: $dark-red;

        &:hover {
            background-color: $dark-red;
            color: $white;
            border-color: $dark-red;
        }
    }
}
</style>
