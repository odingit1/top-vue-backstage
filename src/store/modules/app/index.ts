import { defineStore } from 'pinia'
import { Notification } from '@arco-design/web-vue'
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface'
import type { RouteRecordNormalized } from 'vue-router'
import defaultSettings from '@/config/settings.json'
import { AppState } from './types'

const useAppStore = defineStore('app', {
    state: (): AppState => ({ ...defaultSettings }),

    getters: {
        appCurrentSetting(state: AppState): AppState {
            return { ...state }
        },
        appDevice(state: AppState) {
            return state.device
        },
        appServerMenuConfig(state: AppState): RouteRecordNormalized[] {
            return state.serverMenu as unknown as RouteRecordNormalized[]
        },
        formTopHeight(state: AppState) {
            return Number(state.searchFormHeight) + 340
        }
    },

    actions: {
        setHideHeader(val: Boolean) {
            this.hideHeader = val
        },
        // Update app settings
        updateSettings(partial: Partial<AppState>) {
            // @ts-ignore-next-line
            this.$patch(partial)
        },

        // Change theme color
        toggleTheme(dark: boolean) {
            if (dark) {
                this.theme = 'dark'
                document.body.setAttribute('arco-theme', 'dark')
            } else {
                this.theme = 'light'
                document.body.removeAttribute('arco-theme')
            }
        },
        toggleDevice(device: string) {

            if (device === 'mobile') {
                this.hideHeader = false
            }
            this.device = device
        },
        toggleMenu(value: boolean) {
            this.hideMenu = value
        },
        setSearchFormHeight(height: number) {
            this.searchFormHeight = height
        },
        async fetchServerMenuConfig() {
            let notifiInstance: NotificationReturn | null = null
            try {
                notifiInstance = Notification.info({
                    id: 'menuNotice', // Keep the instance id the same
                    content: 'loading',
                    closable: true
                })
                this.serverMenu = null
                notifiInstance = Notification.success({
                    id: 'menuNotice',
                    content: 'success',
                    closable: true
                })
            } catch (error) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                notifiInstance = Notification.error({
                    id: 'menuNotice',
                    content: 'error',
                    closable: true
                })
            }
        }
    }
})

export default useAppStore
