import axios from 'axios'
import { timeStamp, timeDate } from '@/timezone/date'
export interface menuParams {
    classname: string
    icon?: string
    ispage: number
    menu_id: number
    mid: number
    name: string
    pid: number
    sort: number
    status: number
    url: string
}

export function AdminMenuSaveMenu(data: menuParams) {
    const params = {
        icon: '',
        status: 1,
        ...data
    }
    return axios.post('AdminMenu/SaveMenu', params)
}
export function AdminMenuAllMenu() {

    return axios.post('AdminMenu/AllMenu')
}


export interface menuParams {
    classname: string
    ispage: number
    id: number
    pid: number
    index: string
    sort: number
    is_old: number
}

export function opmenuupdate(data: menuParams) {
    const params = {
        _param: {
            ...data,
            status: 1,
            plat_id: 0,
            open_services: [],
            icon: '',
            pid: Number(data.pid)
        }
    }
    return axios.post('opmenu/update', params)
}
export function AdminMenuDelMenu(id: number) {
    const params = {
        menu_id: [id],
    }
    return axios.post('AdminMenu/DelMenu', params)
}


