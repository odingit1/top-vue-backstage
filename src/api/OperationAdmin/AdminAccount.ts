import axios from 'axios'
import md5 from 'js-md5'
export interface roleParams {
    current: number
    pageSize: number
    user_name: string
    user_id: string
    role_id: number
}
export function opmanagerList(data: roleParams) {
    const params = {
        _param: {
            app_id: [],
            plat_id: 0,
            page: data.current,
            limit: data.pageSize,
            user_name: data.user_name,
            user_id: Number(data.user_id),
            role_id: data.role_id
        }
    }
    return axios.post('opmanager/list', params)
}

export interface pmanagerupdateParams {
    day_point_limit: number
    point_limit: number
    nickname: string
    desc: string
    google_status: number
    password: string
    role_id: number
    status: number
    user_id: number
    username: string
    pwd?: string
}
export function pmanagerupdate(data: pmanagerupdateParams) {
    const params = {
        _param: {
            app_id: 0,
            plat_id: 0,
            ...data,
            point_limit: data.point_limit * 10000,
            day_point_limit: data.day_point_limit * 10000,
            password: data.password === '******' ? '' : md5(data.password),
        }
    }
    return axios.post('opmanager/update', params)
}

export function opmanagerdel(user_id: number) {
    const params = {
        _param: {
            user_id: user_id,
            plat_id: 0,
        }
    }
    return axios.post('opmanager/del', params)
}
export function opmanagerrefreshgooglecode(user_id: number) {
    const params = {
        _param: {
            user_id: user_id,
            plat_id: 0,
        }
    }
    return axios.post('opmanager/refreshgooglecode', params)
}

export function opmanagersync(plat_id: number) {
    const params = {
        _param: {
            plat_id: plat_id,
        }
    }
    return axios.post('opmanager/sync', params)
}
