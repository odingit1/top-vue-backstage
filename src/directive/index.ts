import { App } from 'vue'
import role from './permission/index'

export default {
  install(Vue: App) {
    Vue.directive('permission', role)
  },
}
