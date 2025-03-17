import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import Home from '../views/HomeView.vue';
import About from '../views/AboutView.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/',
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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next({ name: 'Login' }); // 未登录则跳转到登录页面
    } else {
        next();
    }
});

export default router;