import { DEFAULT_LAYOUT } from '@/router/constans'

export default {
    path: '/userManager',
    name: 'userManager',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'TOP后台管理',
        requiresAuth: true,
        order: 1,
    },
    children: [
        {
            path: 'adminMenuTop',
            name: 'userManager_adminMenuTop',
            component: () =>
                import('@/pages/UserManager/AdminMenuTop.vue'), //TOP菜单管理
            meta: {
                locale: 'TOP菜单管理',
                requiresAuth: true,
            },
        },

        {
            path: 'adminRole',
            name: 'userManager_adminRole',
            component: () =>
                import('@/pages/UserManager/AdminRole.vue'), //角色管理
            meta: {
                locale: '角色管理',
                requiresAuth: true,
            },
        },
        {
            path: 'accountTop',
            name: 'userManager_accountTop',
            component: () =>
                import('@/pages/UserManager/AccountTop.vue'), //角色管理
            meta: {
                locale: '用户管理中心',
                requiresAuth: true,
            },
        },
    ],
}
