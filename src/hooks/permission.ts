import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useMeStore } from '@/store'

export default function usePermission() {
    const meStore = useMeStore()
    const permissionsArray = JSON.parse(JSON.stringify(meStore.permissionsArray))
    const isAdmin = meStore.isAdmin

    return {
        accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
            const permissions = (route.meta?.permissions || []) as string[]

            const permissionsValidLength = permissions.filter((p) =>
                permissionsArray.includes(p)
            ).length

            if (
                route.meta?.roles?.length ||
                (route.meta?.permissions as string[])?.length
            ) {
                return (
                    !route.meta?.requiresAuth ||
                    route.meta?.roles?.includes('*') ||
                    isAdmin ||
                    Boolean(permissionsValidLength)
                )
            } else {
                return true
            }
        },
        // You can add any rules you want
    }
}
