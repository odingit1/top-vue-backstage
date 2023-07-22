import { defineStore } from 'pinia'
import { AppInfo } from './types'
const appInfoStore = defineStore('appInfo', {
    state: (): AppInfo => ({
        app: '',
        app_id: 0,
        appname: '',
        point_ratio: 0,
        platform_data: [],
        allapp_data: [],
        mid: 0
    }),
    getters: {

    },
    actions: {


    }
})
export default appInfoStore
