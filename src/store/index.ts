import { createPinia } from 'pinia'
import useAppStore from './modules/app'
import useMeStore from './modules/me'
import useTabBarStore from './modules/tabBar'
import appInfoStore from './modules/appInfo'

const pinia = createPinia()

export { useAppStore, useMeStore, useTabBarStore, appInfoStore }
export default pinia
