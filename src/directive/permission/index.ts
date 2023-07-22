import { DirectiveBinding } from 'vue'
import { useMeStore } from '@/store'

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const meStore = useMeStore()
    const permissionsArray = JSON.parse(
        JSON.stringify(meStore.permissionsArray || [])
    )
    const isAdmin = meStore.isAdmin

    if (Array.isArray(value)) {
        if (value.length > 0) {
            const permissionNeeds = value
            if (isAdmin) return
            const hasPermission = permissionNeeds.filter((r) =>
                permissionsArray.includes(r)
            ).length
            if (!hasPermission && el.parentNode) {
                el.parentNode.removeChild(el)
            }
        }
    } else {
        throw new Error(
            "need permissions! Like v-permission=\"['User.read','BetReport.read']\""
        )
    }
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding)
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding)
    },
}
