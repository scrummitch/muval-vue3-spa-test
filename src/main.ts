import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initializeCsrf } from './services/api';

import App from './App.vue';
import router from './router';

// Initialize CSRF protection
initializeCsrf();

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
