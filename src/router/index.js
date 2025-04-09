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
        meta: {
            title: 'FIMTA法庭科学二代测序线粒体分析比对软件'
        }
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
                meta: {
                    title: '样本信息'
                }
            },
            {
                path: '/siteInfo',
                name: 'SiteInfo',
                component: SiteInfo,
                meta: {
                    title: '样本详情'
                }
            },
            {
                path: '/fileUpload',
                name: 'FileUpload',
                component: FileUpload,
                meta: {
                    title: '数据入库'
                }
            },
            {
                path: '/comparison',
                name: 'Comparison',
                component: Comparison,
                meta: {
                    title: '比对（1/1）'
                }
            },
            {
                path: '/twoComComponent',
                name: 'TwoComComponent',
                component: TwoComComponent,
                meta: {
                    title: '比对详情'
                }
            },
            {
                path: '/oneComN',
                name: 'oneComN',
                component: oneComN,
                meta: {
                    title: '比对（1/N）'
                }
            },
            {
                path: '/recordsComponent',
                name: 'recordsComponent',
                component: RecordsComponent,
                meta: {
                    title: '比对记录'
                }
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

export default router;