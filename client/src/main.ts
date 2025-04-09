import { createApp } from 'vue';
import '@styles/style.scss';
import App from './app/App.vue';
import { createPinia } from 'pinia';
import { router } from './app/router/router';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount('#app');
