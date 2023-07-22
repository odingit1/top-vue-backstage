import { Message } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import { ref } from 'vue'
import i18n from '@/locale/index'
import UAParser from 'ua-parser-js'
import { isObject } from 'lodash'

const parser = new UAParser()
const { t } = i18n.global
const i18nCheckCache = {}

export function parserUserAgent(
    userAgent: string,
    type: string,
    subType?: string
) {
    switch (type) {
        case 'browser':
            const result = parser.getBrowser(userAgent)
            return result[subType]
        case 'engine':
            return parser.getEngine(userAgent).name
        case 'os':
            return parser.getOS(userAgent).name
        default:
            return '-'
    }
}

export function formatDate(dateString: string, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!dateString) return '-'
    const date = dayjs(dateString).tz()
    return dateString ? date.format(format) : '-'
}
export function axiosFormatDate(dateString: string, type = '') {
    if (!dateString) return null
    switch (type) {
        case 'start':
            return dayjs.tz(dateString).startOf('date').utc()
        case 'end':
            return dayjs.tz(dateString).endOf('date').utc()
        default:
            return dayjs.tz(dateString).utc()
    }
}
export function setTodayDate() {
    return dayjs.tz(new Date())
}
export function setDateRange(day = 1) {
    const today = dayjs.tz(dayjs())
    return [today.subtract(day - 1, 'day').startOf('date'), today.endOf('date')]
}
export function setExportDateRange(date: string[], format = 'YYYY-MM-DD') {
    if (!date) return null
    return dayjs(date[0]).format(format) + ' ~ ' + dayjs(date[1]).format(format)
}

export function cloneObject(object: object) {
    return JSON.parse(JSON.stringify(object))
}

export function formatThousandsSeparator(
    number: number | string,
    isPrice = true
) {
    if (!number && number !== 0) return '-'
    if (number === '-') return '-'
    return String(Number(number).toFixed(isPrice ? 3 : 0)).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
    )
}

export function isI18nKeyValid(key: string) {
    if (!(key in i18nCheckCache)) {
        i18nCheckCache[key] = t(key).indexOf(key) === Number(-1)
    }
    return i18nCheckCache[key]
}
export function tHandleMissingKey(name: string) {
    if (!name) {
        return t('label.noGroup')
    }
    if (isI18nKeyValid(name)) {
        return t(name)
    } else {
        const stringArray = name.split('.')[1]
            ? name.split('.')[1].replaceAll('_', ' ')
            : name.replaceAll('_', ' ')
        return stringArray
            .toLowerCase()
            .replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    }
}

export function sortNumberArray(array: []) {
    return array.sort((a, b) => a - b)
}
export function hasSameValueOnArray(a: [], b: []) {
    return (
        JSON.stringify(sortNumberArray(a)) === JSON.stringify(sortNumberArray(b))
    )
}
export function subtractAmount(a: number | string = 0, b: number | string = 0) {
    return (Number(a) - Number(b)).toFixed(3) || (0).toFixed(3)
}

export function requestHandler(fn, isLoading?: ref<boolean> = ref(false)) {
    return async function () {
        if (isLoading.value) return
        isLoading.value = true
        try {
            await fn()
        } catch (err) {
            if (err.response) {
                if (err.response.data.errors) {
                    const errors = err.response.data.errors
                    if (isObject(errors)) {
                        Object.keys(errors).forEach((errorKey) => {
                            const errorType = errorKey
                            const errorText = errors[errorKey][0]
                            Message.error({
                                content: t(errorType) + ' ' + t(errorText) || 'Request Error'
                            })
                        })
                    } else if (typeof errors === 'string') {
                        Message.error({
                            content: t(errors) || 'Request Error'
                        })
                    }
                }
                if (err.response.data.error) {
                    Message.error({
                        content: t(err.response.data.error) || 'Request Error'
                    })
                }
            } else {
                console.error(err)
            }
        } finally {
            isLoading.value = false
        }
    }
}

export async function exportParamsValue(fn, params, dataName, id) {
    const response = await fn(params)
    let data = null
    if (dataName) {
        data = response.data[dataName].find((x) => x.id === id)
    } else {
        data = Object.keys(response.data).find((x) => {
            return response.data[x] === id
        })
    }
    return data
}

export function exportParamsArrayValue(fn, params, dataName, ids) {
    return Promise.all(
        ids.map((id) => exportParamsValue(fn, params, dataName, id))
    )
}

export function exportAppIdRouter({ routeObj }) {
    const AppId = import.meta.env.VITE_APP_ID
    return AppId ? {} : routeObj
}
