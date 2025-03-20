import { createApp } from 'vue';
import App from './App';
import router from './router'; // 导入路由配置
import axios from 'axios'; // 导入 axios


// 设置 axios 的全局配置
axios.defaults.baseURL = 'http://localhost:8088'; // 后端 API 地址
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// 创建 Vue 应用
const app = createApp(App);

// 配置路由
app.use(router);

// 挂载到 DOM
app.mount('#app');