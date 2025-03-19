import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import Home from '../components/HomeComponent';
import About from '../components/AboutView.vue';
import IndexView from "@/views/IndexView";

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },

    {
        path: '/index',
        name: 'Index',
        component: IndexView,
        children:[
            {
                path: '/home',
                name: 'Home',
                component: Home,
                meta: { requiresAuth: true }, // 需要登录
            },
            {
                path: '/about',
                name: 'About',
                component: About,
                meta: { requiresAuth: true }, // 需要登录
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;