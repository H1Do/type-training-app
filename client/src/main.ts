import { createApp } from 'vue';
import App from './app/App.vue';
import { createPinia } from 'pinia';
import { HttpClient, UserApi } from './shared/api';
import { MessageService, ModalService } from './app/providers';
import { router } from './app/router';
import { useUserStore } from './entities/user';
import './shared/styles/style.scss';

const app = createApp(App);
const pinia = createPinia();

const httpClient = new HttpClient();
const userApi = new UserApi(httpClient);
const modalService = new ModalService();
const messageService = new MessageService();

pinia.use(({ store }) => {
    store.userApi = userApi;
    store.modalService = modalService;
    store.messageService = messageService;
});

app.use(pinia);
app.use(router);

app.provide('userApi', userApi);
app.provide('modalService', modalService);
app.provide('messageService', messageService);

// Check auth
const userStore = useUserStore();
await userStore.checkAuth();

app.mount('#app');
