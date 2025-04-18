import 'reflect-metadata';
import { createApp } from 'vue';
import './shared/styles/style.scss';
import App from './app/App.vue';
import { createPinia } from 'pinia';
import { router } from './app/router/router';
import { HttpClient } from './shared/services/httpClient';
import { UserApi } from './shared/services/userApi';

const app = createApp(App);
const pinia = createPinia();

const httpClient = new HttpClient();
const userApi = new UserApi(httpClient);

app.provide('httpClient', httpClient);
app.provide('userApi', userApi);

app.use(router);
app.use(pinia);
app.mount('#app');
