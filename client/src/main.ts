import { createApp } from 'vue';
import App from './app/App.vue';
import { createPinia } from 'pinia';
import { HttpClient, TrainingApi, UserApi } from './shared/api';
import { MessageService, ModalService } from './app/providers';
import { router } from './app/router';
import { useUserStore } from './entities/user';
import './shared/styles/style.scss';

const app = createApp(App);
const pinia = createPinia();

const httpClient = new HttpClient();
const userApi = new UserApi(httpClient);
const trainingApi = new TrainingApi(httpClient);
const modalService = new ModalService();
const messageService = new MessageService();

pinia.use(({ store }) => {
    store.userApi = userApi;
    store.trainingApi = trainingApi;
    store.modalService = modalService;
    store.messageService = messageService;
    store.router = router;
});

app.use(pinia);

const userStore = useUserStore();
await userStore.checkAuth();

app.provide('userApi', userApi);
app.provide('modalService', modalService);
app.provide('messageService', messageService);

app.use(router);

app.mount('#app');
