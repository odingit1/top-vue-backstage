import { App } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
} from 'echarts/components'
import CommonTable from './Components/CommonTable.vue'
import SearchForm from './Components/SearchForm.vue'
import Breadcrumb from './Layout/Breadcrumb.vue'
import CheckObjectKeyExist from './Components/CheckObjectKeyExist.vue'

// Manually introduce ECharts modules to reduce packing size

use([
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
])

export default {
  install(Vue: App) {
    Vue.component('Breadcrumb', Breadcrumb)
    Vue.component('CommonTable', CommonTable)
    Vue.component('SearchForm', SearchForm)
    Vue.component('CheckObjectKeyExist', CheckObjectKeyExist)
  },
}
