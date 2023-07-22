import Router from '@/router'
import { Message } from '@arco-design/web-vue'
import i18n from '@/locale/index'

import { useMeStore } from '@/store'

const { t } = i18n.global
export default function useUser() {
  const meStore = useMeStore()
  const logout = async (logoutTo?: string) => {
    const currentRoute = Router.currentRoute.value
    Message.success(t('messageBox.logout.success'))
    Router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
      query: {
        ...Router.currentRoute.value.query,
        redirect: currentRoute.name as string,
      },
    })
    await meStore.logout()
  }
  return {
    logout,
  }
}
