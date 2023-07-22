import { DEFAULT_LAYOUT } from '@/router/constans'

export default {
    path: '/newOperationAdmin',
    name: 'newOperationAdmin',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: '运营后台管理',
        requiresAuth: true,
        order: 1,
    },
    children: [
        {
            path: 'newAdminMenu',
            name: 'newOperationAdmin_newAdminMenu',
            component: () =>
                import('@/pages/OperationAdmin/AdminMenu.vue'), //菜单管理
            meta: {
                locale: '菜单管理',
                requiresAuth: true,
            },
        },
        {
            path: 'newAdminRole',
            name: 'newOperationAdmin_newAdminRole',
            component: () =>
                import('@/pages/OperationAdmin/AdminRole.vue'), //角色管理
            meta: {
                locale: '角色管理',
                requiresAuth: true,
            },
        },

        {
            path: 'newAdminAccount',
            name: 'newOperationAdmin_newAdminAccount',
            component: () =>
                import('@/pages/OperationAdmin/AdminAccount.vue'), //角色管理
            meta: {
                locale: '用户管理中心',
                requiresAuth: true,
            },
        },
    ],
}
