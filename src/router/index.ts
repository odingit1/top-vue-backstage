import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { getLoginAppId, setLoginAppId } from '@/utils/auth'

import routerMunu from './routes'
import createRouteGuard from './guard'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: 'login',
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'login',
            component: () => import('@/pages/Login.vue'),
            meta: {
                requiresAuth: false,
            },
        },
        ...routerMunu,
        {
            path: '/:pathMatch(.*)*',
            name: 'notFound',
            component: () => import('@/pages/NotFound.vue'),
        },
    ],
    scrollBehavior() {
        return { top: 0 }
    },
})
createRouteGuard(router)
export default router
