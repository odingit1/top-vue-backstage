import { computed } from 'vue'
import { useRouter, RouteRecordRaw, RouteRecordNormalized } from 'vue-router'
import usePermission from '@/hooks/permission'
import { useAppStore, useMeStore } from '@/store'
import { cloneObject } from '@/utils/tool'

export default function useMenuTree() {
    const router = useRouter()
    const role = usePermission()
    const appStore = useAppStore()
    const meStore = useMeStore()
    const appRoute = computed(() => {
        // return meStore.setUserMenu
        if (appStore.menuFromServer) {
            return appStore.appServerMenuConfig

        }
        // console.error()
        return router.options.routes[2]
        // return router.getRoutes().filter((el) => el.meta.requiresAuth && el.meta.order !== undefined)
    })
    // const copyRouter = computed(() => {
    //     const routeArray = [] as object[]

    //     appRoute.value.forEach((route) => {
    //         const data = {
    //             meta: route.meta,
    //             name: route.name,
    //             children: route.children,
    //         }
    //         // if (route.children?.length) {
    //         //     route.children.forEach((subRoute) => {
    //         //         data.children = {
    //         //             meta: subRoute.meta,
    //         //             name: subRoute.name,
    //         //             children: subRoute.children,
    //         //         }

    //         //     })
    //         // }
    //         routeArray.push(data)
    //     })
    //     console.error(routeArray)
    //     return cloneObject(routeArray)
    // })
    // const menuTree = computed(() => {
    //     copyRouter.value.sort(
    //         (a: RouteRecordNormalized, b: RouteRecordNormalized) => {
    //             return (a.meta.order || 0) - (b.meta.order || 0)
    //         }
    //     )
    //     function travel(_routes: RouteRecordRaw[], layer: number) {
    //         if (!_routes) return null
    //         console.error(_routes)

    //         const collector = _routes.map((element) => {
    //             // no access
    //             if (!role.accessRouter(element)) {
    //                 return null
    //             }

    //             // leaf node
    //             if (element.meta?.hideChildrenInMenu || !element.children) {
    //                 element.children = []
    //                 return element
    //             }

    //             // route filter hideInMenu true
    //             element.children = element.children.filter(
    //                 (x) => x.meta?.hideInMenu !== true
    //             )
    //             // Associated child node
    //             const subItem: RouteRecordRaw[] = travel(element.children, layer + 1)

    //             if (subItem.length) {
    //                 element.children = subItem
    //                 return element
    //             }
    //             // the else logic
    //             // if (layer > 1) {
    //             //     element.children = subItem
    //             //     return element
    //             // }

    //             // if (element.meta?.hideInMenu === false) {
    //             //     return element
    //             // }

    //             return null
    //         })
    //         return collector.filter(Boolean)
    //     }

    //     return travel(copyRouter.value, 0)
    // })

    return {
        appRoute,
    }
}
