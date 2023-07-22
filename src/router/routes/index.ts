import type { RouteRecordRaw } from 'vue-router'
import { DEFAULT_LAYOUT } from '@/router/constans'

const modules = import.meta.globEager('./modules/*.ts')
const appConfigurationRoutes: RouteRecordRaw[] = []

Object.keys(modules).forEach((key) => {
    const defaultModule = modules[key].default
    if (!defaultModule) return
    const moduleList = Array.isArray(defaultModule)
        ? [...defaultModule]
        : [defaultModule]
    appConfigurationRoutes.push(...moduleList)
})

const pageAccount = {
    path: '/me',
    name: 'Me',
    component: DEFAULT_LAYOUT,
    children: [
        {
            path: 'info',
            name: 'MeInfo',
            component: () => import('@/pages/Configuration/Me.vue'),
            meta: {
                locale: 'me.account',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
}

appConfigurationRoutes.push(pageAccount)
export default appConfigurationRoutes
