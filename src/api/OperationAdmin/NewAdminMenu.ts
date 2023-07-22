import axios from 'axios'
import { timeStamp, timeDate } from '@/timezone/date'
// export interface menuParams {
//     classname: string
//     icon: string
//     ispage: number
//     menu_id: number
//     mid: number
//     name: string
//     pid: number
//     sort: number
//     status: number
//     url: string
// }

// export function AdminMenuSaveMenu(data: menuParams) {
//     const params = {
//         ...data
//     }
//     return axios.post('AdminMenu/SaveMenu', params)
// }
export function opmenulist() {
    const params = {
        _param: {
            plat_id: 0
        }
    }
    return axios.post('opmenu/list', params)
}


export interface menuParams {
    classname: string
    ispage: number
    id: number
    pid: number
    index: string
    sort: number
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
export function opmenudel(id: number) {
    const params = {
        _param: {
            menu_ids: [id],
            plat_id: 0
        }
    }
    return axios.post('opmenu/del', params)
}


