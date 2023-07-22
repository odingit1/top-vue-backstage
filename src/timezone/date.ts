import dayjs from 'dayjs'
import { getTimeZone, setTimeZone } from '@/utils/auth'
//  转换时间戳
const timeZone: string | null = getTimeZone()
export function timeStamp(date: string, type = 0) {
    if (!type) {
        return dayjs(dayjs.tz(date, timeZone)).unix() || 0
    } else {
        return dayjs(dayjs.tz(date, timeZone)).valueOf() //毫秒
    }
}

//转换日期string
export function timeDate(date: number, type = 0, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '-'
    if (!type) {
        console.log(dayjs.tz(date * 1000, timeZone).format(format))
        return dayjs.tz(date * 1000, timeZone).format(format)
    } else {
        return dayjs.tz(date, timeZone).format(format) //毫秒
    }
}

export function secondToHour(second: number, fixed = 2) {
    second = parseFloat(`${second}`) || 0
    return parseFloat((second / 3600).toFixed(fixed))
}
export function hourToSecond(hour: number, fixed = 0) {
    hour = parseFloat(`${hour}`) || 0
    return parseFloat((hour * 3600).toFixed(fixed))
}