import { createApp } from 'vue';
import App from './App';
import router from './router'; // 导入路由配置
import axios from 'axios'; // 导入 axios
import './css/styles.css'; // 引入全局 CSS 文件
import store from '@/store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 设置 axios 的全局配置
axios.defaults.baseURL = 'http://localhost:5028'; // 后端 API 地址


// 创建 Vue 应用
const app = createApp(App);
app.use(store)
// 配置路由
app.use(router);
//启用element-plus
app.use(ElementPlus)
// 挂载到 DOM
app.mount('#app');