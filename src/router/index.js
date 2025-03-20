import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import Chart from '../components/ChartComponent';
import MitochondrialDetail from '../components/MitochondrialDetail';
import SiteInfo from '../components/SiteInfo';
import IndexView from "@/views/IndexView";
import FileUpload from "@/components/FileUploadComponent"
import Comparison from "@/components/ComparisonComponent"

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
                path: '/chart',
                name: 'Chart',
                component: Chart,
            },
            {
                path: '/mitochondrialDetail',
                name: 'MitochondrialDetail',
                component: MitochondrialDetail,
            },
            {
                path: '/siteInfo',
                name: 'SiteInfo',
                component: SiteInfo,
            },
            {
                path: '/fileUpload',
                name: 'FileUpload',
                component: FileUpload,
            },
            {
                path: '/comparison',
                name: 'Comparison',
                component: Comparison,
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;