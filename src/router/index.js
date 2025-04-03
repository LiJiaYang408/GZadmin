import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import MitochondrialDetail from '../components/MitochondrialDetail';
import SiteInfo from '../components/SiteInfo';
import IndexView from "@/views/IndexView";
import FileUpload from "@/components/FileUploadComponent"
import Comparison from "@/components/ComparisonComponent"
import TwoComComponent from "@/components/TwoComComponent";
import oneComN from "@/components/OneComNComponent"
import RecordsComponent from "@/components/RecordsComponent"

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
            {
                path: '/twoComComponent',
                name: 'TwoComComponent',
                component: TwoComComponent,
            },
            {
                path: '/oneComN',
                name: 'oneComN',
                component: oneComN,
            },
            {
                path: '/recordsComponent',
                name: 'recordsComponent',
                component: RecordsComponent,
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;