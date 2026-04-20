import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';

const app = createApp(App);

// 注册路由
app.use(router);

// 注册状态管理
app.use(pinia);

app.mount('#root');

