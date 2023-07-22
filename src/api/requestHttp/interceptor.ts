import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Modal, Message } from '@arco-design/web-vue'
import { getUserData, getAppid, getLoginAppId } from '@/utils/auth'
import { setupCache } from 'axios-cache-adapter'
import useUser from '@/hooks/user'
import i18n from '@/locale'
import { showMessage } from './errorStatus'
import { useMeStore } from '@/store'
export interface HttpResponse<T = unknown> {
    status: number
    msg: string
    code: number
    data: T
}
export interface responseParams<T = unknown> {
    data: any
    msg: string
    code: number
    _errno: number
    _errstr: string
    ret: number


}
if (import.meta.env.VITE_API_BASE_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}

const cache = setupCache({
    invalidate: async (config, request) => {
        // if (!request.isCache) {
        //     await config.store.removeItem(config.uuid)
        // }
    },
    maxAge: 15 * 60 * 1000
})
axios.defaults.adapter = cache.adapter

axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        config.headers['Content-Type'] = 'text/plain'
        let url: string = config.url as string
        if (getUserData()?.token) {
            if (!config.headers) {
                config.headers = {}
            }
            config.url = `${url}?token=${getUserData().token}&uid=${getUserData().id}`
        } else {
            config.url = url
        }
        const obj = config.data
        config.data = JSON.stringify({
            mid: useMeStore().mid || 0,
            ...obj
        })

        if (config.params && Object.hasOwnProperty.call(config.params, 'q')) {
            const param = {}
            Object.keys(config.params.q).forEach((key) => {
                if (
                    config.params.q[key] ||
                    config.params.q[key] === 0 ||
                    config.params.q[key] === false
                ) {
                    param[`q[${key}]`] = config.params.q[key]
                }
            })
            delete config.params.q
            config.params = {
                ...config.params,
                ...param
            }
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
// add response interceptors
axios.interceptors.response.use(
    (response: AxiosResponse<responseParams>) => {
        const res = response.data as any
        if (res._errno) {
            Message.error({
                content: `${res._errstr}(${res._errno})`,
                duration: 2000
            })
            return Promise.reject(res);
        }
        if (res.hasOwnProperty('_param') || res.hasOwnProperty('Params')) {
            if (res.data?._errno || res.data?.ret) {
                if (res.data.ret == 401) {
                    Modal.error({
                        title: res.data.msg,
                        content: '用户信息已失效，请重新登录',
                        okText: '返回',
                        modalClass: 'text-center',
                        async onOk() {
                            const { logout } = useUser()
                            logout()
                        }
                    })
                    return Promise.reject(res);
                } else {
                    Message.error({
                        content: `${res.msg}(${res.code})!`,
                        duration: 2000
                    })
                    return Promise.reject(res);
                }

            } else {
                return res._param
            }
        } else {

            if (res.code == 401) {
                Modal.error({
                    title: res.msg,
                    content: '用户信息已失效，请重新登录',
                    okText: '返回',
                    modalClass: 'text-center',
                    async onOk() {
                        const { logout } = useUser()
                        logout()
                    }
                })
                return Promise.reject(res);
            } else if (res.code == 502) {
                Message.error({
                    content: '请求超时，请重新操作(502)',
                    duration: 2000
                })
                return Promise.reject(res);
            } else if (res.code != 200) {
                if (res.code != 1067) {
                    Message.error({
                        content: `${res.msg}(${res.code})!`,
                        duration: 2000
                    })
                    return Promise.reject(res);
                }

            }
            return res
        }

    },
    (error) => {
        if (error.message === 'Network Error') {
            Modal.error({
                title: 'Network Error',
                content: '',
                okText: i18n.global.t('exception.result.403.back'),
                modalClass: 'text-center',
                async onOk() {
                    window.location.reload()
                }
            })
        } else if (error.response) {
            showMessage(error.response.status)
            const err = error.response.data.error || null
            const isErr401 = error.response.status === 401
            if ((err && err.includes('unauthorized')) || isErr401) {
                Modal.error({
                    title: i18n.global.t('menu.exception.403'),
                    content: i18n.global.t('exception.result.403.description'),
                    okText: i18n.global.t('exception.result.403.back'),
                    modalClass: 'text-center',
                    async onOk() {
                        const { logout } = useUser()
                        logout()
                    }
                })
            }
        }
        return Promise.reject(error)
    }
)
