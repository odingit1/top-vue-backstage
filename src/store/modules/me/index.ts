import { defineStore } from 'pinia'
import { RouteRecordRaw, useRouter } from 'vue-router'
import {
    login as userLogin,
    LoginData,
    CheckGoogleBind,
    googleBindData,
    MenuGetUserMenu,
} from '@/api/me'
import { setUserData, clearUserData, clearAppid, setAppid } from '@/utils/auth'
import { removeRouteListener } from '@/utils/routeListener'
import { UserState, menu } from './types'
import { isEmpty } from 'lodash'
const useMeStore = defineStore('user', {
    state: (): UserState => ({
        app_id: 0,
        google_status: 0,
        id: 0,
        login_time: 0,
        status: 0,
        token: '',
        user_name: '',
        allConfMenu: [],
        mid: 0,
    }),

    getters: {
        permissionsArray(state: UserState): string[] {

            return []
        },
        setUserMenu() {
            const array = [] as RouteRecordRaw[]
            return array
        },


        userInfo(state: UserState): UserState {
            return { ...state }
        },
    },

    actions: {
        setInfo(partial: Partial<UserState>) {
            this.$patch(partial)
        },
        resetInfo() {
            this.$reset()
        },

        //CheckGoogleBind
        async googleBind(loginForm: LoginData) {
            try {
                const res = await CheckGoogleBind(loginForm)
                return res as unknown as googleBindData
            } catch (err) {
                throw err
            }
        },

        async login(loginForm: LoginData) {
            try {
                const res = await userLogin(loginForm)
                if (res.data.token) {
                    setUserData(JSON.stringify(res.data))
                    this.setInfo(res.data)
                }
                return res as unknown as UserState
            } catch (err) {
                clearUserData()
                clearAppid()
                throw err
            }
        },
        // async getAPPList() {
        //     try {
        //         const res = await AccountAppList(this.app_id)
        //         return res
        //     } catch (err) {
        //         clearUserData()
        //         clearAppid()
        //         throw err
        //     }
        // },

        async menuInfo() {
            const res = await MenuGetUserMenu()
            const router = useRouter()
            const list = res.data.list[0].children || []
            this.allConfMenu = []
            if (list.length) {
                this.mid = list[0].children[0].menu_id || 0
            }
            list.map((item: menu) => {
                if (item.is_old) {
                    let obj = {
                        path: `/${item.url}`,
                        name: item.classname,
                        title: item.title,
                        id: item.menu_id,
                        key: item.menu_id,
                        meta: {
                            locale: item.title,
                            order: item.sort,
                            ispage: item.ispage,
                            mid: item.menu_id,
                            icon: 'icon-file',
                        },
                        children: [],
                    }

                    if (item.children.length) {
                        item.children.map((item1: menu) => {
                            let obj1 = {
                                path: `/${item1.url}`,
                                name: item1.classname,
                                id: item1.menu_id,
                                key: item1.menu_id,
                                parent: item.classname,
                                title: item1.title,
                                meta: {
                                    locale: item1.title,
                                    order: item1.sort,
                                    parent: item.classname,
                                    ispage: item1.ispage,
                                    mid: item1.menu_id,
                                },
                                children: [],
                            }
                            obj.children.push(obj1)


                        })

                    }
                    this.allConfMenu.push(obj)
                }

            })

        },

        // Logout
        async logout() {
            this.resetInfo()
            clearUserData()
            clearAppid()
            removeRouteListener()
        },
    },
})

export default useMeStore
