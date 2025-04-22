import 'reflect-metadata';
import { createApp } from 'vue';
import './shared/styles/style.scss';
import App from './app/App.vue';
import { createPinia } from 'pinia';
import { router } from './app/router/router';
import { HttpClient } from './shared/domains/httpClient';
import { UserApi } from './shared/domains/userApi';
import { useUserStore } from './shared/models/user';
import { ModalService } from './shared/services/ModalService';
import { MessageService } from './shared/services/MessageService';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Domains
const httpClient = new HttpClient();
const userApi = new UserApi(httpClient);

app.provide('userApi', userApi);

// Services
const modalService = new ModalService();
const messageService = new MessageService();

app.provide('modalService', modalService);
app.provide('messageService', messageService);

// Check auth
const userStore = useUserStore();
await userStore.checkAuth(userApi, messageService);

app.use(router);
app.mount('#app');
