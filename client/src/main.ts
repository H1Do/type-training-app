import 'reflect-metadata';
import { createApp } from 'vue';
import './shared/styles/style.scss';
import App from './app/App.vue';
import { createPinia } from 'pinia';
import { router } from './app/router/router';
import { HttpApi } from './shared/services/httpApi';
import { UserApi } from './shared/services/userApi';

const app = createApp(App);
const pinia = createPinia();

const httpApi = new HttpApi();
const userApi = new UserApi(httpApi);

app.provide('httpApi', httpApi);
app.provide('userApi', userApi);

app.use(router);
app.use(pinia);
app.mount('#app');
