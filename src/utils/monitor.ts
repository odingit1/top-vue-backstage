import { App, ComponentPublicInstance } from 'vue'
import axios from 'axios'

export default function handleError(Vue: App, baseUrl: string) {
    if (!baseUrl) {
        return
    }
    Vue.config.errorHandler = (
        err: unknown,
        instance: ComponentPublicInstance | null,
        info: string
    ) => {
        // send Error Info
        axios.post(`${baseUrl}/report-error`, {
            err,
            instance,
            info,
            // location: window.location.href,
            // message: err.message,
            // stack: err.stack,
            // browserInfo: getBrowserInfo(),
            // Admin Info
            // dom Info
            // url Info
            // ...
        })
    }
}
