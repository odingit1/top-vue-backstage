import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import globalComponents from '@/components'
import router from './router'
import store from './store'
import i18n from './locale'
import directive from './directive'
import './mock'
import Vue from "vue";
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.css'
import '@/assets/style/global.less'
import '@/assets/style/tool.less'
import '@/api/requestHttp/interceptor'
import './style.css'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import JsonViewer from "vue3-json-viewer"
import "vue3-json-viewer/dist/index.css";
import rollbar from './rollbar'
import VueForm from '@lljj/vue3-form-ant'
// 全局注册 或者可以在组件内注册

import { getTimeZone, setTimeZone } from '@/utils/auth'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(getTimeZone() || 'America/Sao_Paulo')

const app = createApp(App)
app.component('VueForm', VueForm)
app.use(ArcoVue, {})
app.use(ArcoVueIcon)
app.use(JsonViewer)
app.config.globalProperties.$rollbar = rollbar
app.config.errorHandler = (err) => {
    rollbar.error(err)
    throw err
}

app.use(router)
app.use(store)
app.use(i18n)
app.use(globalComponents)
app.use(directive)

app.mount('#app')
