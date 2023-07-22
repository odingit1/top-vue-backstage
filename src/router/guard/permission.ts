import type { Router, LocationQueryRaw } from 'vue-router'
import NProgress from 'nprogress' // progress bar

import usePermission from '@/hooks/permission'
import { useMeStore } from '@/store'
import { isLogin, clearUserData } from '@/utils/auth'

export default function setupPermissionGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        NProgress.start()
        const meStore = useMeStore()
        async function crossroads() {
            const Permission = usePermission()
            if (to.name === 'login') {
                next({
                    name: 'MeInfo',
                    query: {
                        redirect: to.name,
                        ...to.query,
                    } as LocationQueryRaw,
                })
            } else if (Permission.accessRouter(to)) {
                next()
            } else {
                const destination = {
                    name: 'notFound',
                }
                next(destination)
            }
            NProgress.done()
        }
        // next()
        if (isLogin()) {
            try {
                // await meStore.info()

                crossroads()
            } catch (error) {
                clearUserData()
                next({
                    name: 'login',
                    query: {
                        redirect: to.name,
                        ...to.query,
                    } as LocationQueryRaw,
                })
                NProgress.done()
            }
        } else {
            if (to.name === 'login') {
                next()
                NProgress.done()
                return
            }
            next({
                name: 'login',
                query: {
                    redirect: to.name,
                    ...to.query,
                } as LocationQueryRaw,
            })
            NProgress.done()
        }
    })
}
