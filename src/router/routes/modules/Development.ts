import { DEFAULT_LAYOUT } from '@/router/constans'

export default {
    path: '/development',
    name: 'development',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: '配置管理',
        requiresAuth: true,
        order: 1,
    },
    children: [
        {
            path: 'generalConfig',
            name: 'development_generalConfig',
            component: () =>
                import('@/pages/Development/GeneralConfig.vue'), //通用配置
            meta: {
                locale: '通用配置',
                requiresAuth: true,
            },
        },
    ],
}
