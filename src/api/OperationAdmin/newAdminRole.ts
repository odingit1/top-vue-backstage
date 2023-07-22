import axios from 'axios'
import { timeStamp, timeDate } from '@/timezone/date'
export interface roleParams {
    button_list?: number[]
    description: string
    is_prefab: number
    menus?: number[]
    name: string
    role_id: number
    status: number
}
export function oproleupdate(data: roleParams) {
    const params = {
        _param: {
            app_id: 0,
            plat_id: 0,
            ...data
        }
    }
    return axios.post('oprole/update', params)
}
export function oprolelist() {
    const params = {
        _param: {
            plat_id: 0
        }
    }
    return axios.post('oprole/list', params)
}
export function oproledel(id: number) {
    const params = {
        _param: {
            plat_id: 0,
            role_id: id
        }
    }
    return axios.post('oprole/del', params)
}
export interface oprolerolebuttonsParams {
    role_id: number
    menu_id: number
    buttons?: number[]

}
export function oprolerolebuttons(data: oprolerolebuttonsParams) {
    const params = {
        _param: {
            plat_id: 0,
            role_id: data.role_id,
            menu_id: data.menu_id,
        }
    }
    return axios.post('oprole/rolebuttons', params)
}
export function oprolerolebuttonsupdate(data: oprolerolebuttonsParams) {
    const params = {
        _param: {
            plat_id: 0,
            role_id: data.role_id,
            menu_id: data.menu_id,
            buttons: data.buttons
        }
    }
    return axios.post('oprole/rolebuttonsupdate', params)
}
export function oprolebuttondel(button_id: number) {
    const params = {
        _param: {
            plat_id: 0,
            button_id: button_id,
        }
    }
    return axios.post('oprole/buttondel', params)
}
export interface oprolebuttonupdateParams {
    role_id: number
    menu_id: number
    client_tag: string
    desc: string
    func: string
    id: number

}
export function oprolebuttonupdate(data: oprolebuttonupdateParams) {
    const params = {
        _param: {
            plat_id: 0,
            ...data
        }
    }
    return axios.post('oprole/buttonupdate', params)
}
