import Mock from 'mockjs'
import setupMock, {
    successResponseWrap,
    failResponseWrap,
} from '@/utils/setupMock'

import { MockParams } from '@/types/mock'
import { isLogin } from '@/utils/auth'

setupMock({
    setup() {
        // Mock.XHR.prototype.withCredentials = true;

        // 用户信息
        Mock.mock(new RegExp('/v1/admins/me'), () => {
            if (isLogin()) {
                const role = window.localStorage.getItem('userRole') || 'admin'
                return successResponseWrap({
                    id: 0,
                    account: '',
                    email: 'email',
                    phone: 'phone',
                    timezone: 'timezone',
                    name: 'admin',
                    locale: 'locale',
                    country: 'country',
                    bankCode: 'bankCode',
                    bankAccount: 'bankAccount',
                    pictureUrl: 'pictureUrl',
                    isPhoneVerified: false,
                    isKycVerified: false,
                    isEmailVerified: false,
                    isLock: false,
                    promotionCode: 'promotionCode',
                    signupIp: 'signupIp',
                    signupPlaceAt: 'signupPlaceAt',
                    lastPlaceLoginedAt: 'lastPlaceLoginedAt',
                    lastLoginedAt: 'lastLoginedAt',
                    createdAt: 'createdAt',
                    updatedAt: 'updatedAt',
                    role,
                })
            }
            return failResponseWrap(null, '未登录', 50008)
        })

        // 登录
        Mock.mock(new RegExp('/v1/admins/login'), (params: MockParams) => {
            const { account, password } = JSON.parse(params.body)
            if (!account) {
                return failResponseWrap(null, '用户名不能为空', 50000)
            }
            if (!password) {
                return failResponseWrap(null, '密码不能为空', 50000)
            }

            if (account && password) {
                window.localStorage.setItem('userRole', 'admin')
                return successResponseWrap({
                    token: '12345',
                })
            }
            if (account === 'user' && password === 'user') {
                window.localStorage.setItem('userRole', 'user')
                return successResponseWrap({
                    token: '54321',
                })
            }
            return failResponseWrap(null, '账号或者密码错误', 50000)
        })
        // 登出
        Mock.mock(new RegExp('/api/admin/logout'), () => {
            return successResponseWrap(null)
        })

        // 登出
        Mock.mock(new RegExp('/api/admin/menu'), () => {
            const menuList = [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    meta: {
                        locale: 'menu.server.dashboard',
                        requiresAuth: true,
                        icon: 'icon-dashboard',
                        order: 1,
                    },
                    children: [
                        {
                            path: 'workplace',
                            name: 'Workplace',
                            meta: {
                                locale: 'menu.server.workplace',
                                requiresAuth: true,
                            },
                        },
                        {
                            path: 'monitor',
                            name: 'Monitor',
                            meta: {
                                locale: 'menu.server.monitor',
                                requiresAuth: true,
                                roles: ['admin'],
                            },
                        },
                    ],
                },
            ]
            return successResponseWrap(menuList)
        })
    },
})
