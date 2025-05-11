import { createApp, watch } from 'vue';
import App from './app/App.vue';
import { createPinia } from 'pinia';
import {
    HttpClient,
    LessonsApi,
    StatsApi,
    TrainingApi,
    UserApi,
} from './shared/api';
import { MessageService, ModalService } from './app/providers';
import { router } from './app/router';
import { useUserStore } from './entities/user';
import './shared/styles/style.scss';
import { createI18n } from 'vue-i18n';
import { useSettingsStore } from './features/settings';
import { Localization } from './shared/types';
import { en, ru } from './shared/locales';

const app = createApp(App);
const pinia = createPinia();

const httpClient = new HttpClient();
const userApi = new UserApi(httpClient);
const trainingApi = new TrainingApi(httpClient);
const statsApi = new StatsApi(httpClient);
const lessonsApi = new LessonsApi(httpClient);
const modalService = new ModalService();
const messageService = new MessageService();

app.use(pinia);

const settings = useSettingsStore();

const i18n = createI18n({
    legacy: false,
    locale: settings.localization,
    fallbackLocale: Localization.EN,
    messages: {
        en,
        ru,
    },
});

app.use(i18n);

watch(
    () => settings.localization,
    (newLocale) => {
        i18n.global.locale.value = newLocale;
    },
    { immediate: true },
);

pinia.use(({ store }) => {
    store.userApi = userApi;
    store.trainingApi = trainingApi;
    store.statsApi = statsApi;
    store.lessonsApi = lessonsApi;
    store.modalService = modalService;
    store.messageService = messageService;
    store.router = router;
    store.t = i18n.global.t;
});

const userStore = useUserStore();
await userStore.checkAuth();

app.provide('userApi', userApi);
app.provide('modalService', modalService);
app.provide('messageService', messageService);

app.use(router);

app.mount('#app');
