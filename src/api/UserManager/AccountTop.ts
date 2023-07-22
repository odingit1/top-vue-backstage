import axios from 'axios'
import md5 from 'js-md5'
export interface AdminManagerParams {
    current: number
    pageSize: number
    user: string
    role_id: number
}
export function AdminManagerGetManagerList(data: AdminManagerParams) {
    const params = {
        app_id: [],
        page: data.current,
        limit: data.pageSize,
        user: data.user,
        role_id: Number(data.role_id)
    }
    return axios.post('AdminManager/GetManagerList', params)
}

export interface AdminManagerSaveManagerParams {
    role_id: number
    nickname: string
    password: string
    google_status: number
    status: number
    username: string
    user_id: number
    password2: string
}
export function AdminManagerSaveManager(data: AdminManagerSaveManagerParams) {
    const params = {
        ip_list: [],
        plat_list: [],
        region_list: [],
        area_code: '',
        google_code: '',
        code_phone: '',
        is_top_user: 2,
        phone_status: 2,
        role_name: '',
        ...data,
        password: data.password === '******' ? '' : md5(data.password),
        password2: data.password === '******' ? '' : md5(data.password2),
    }
    return axios.post('AdminManager/SaveManager', params)
}
export function AdminManagerDelManager(user_id: number) {
    const params = {
        user_id: user_id
    }
    return axios.post('AdminManager/DelManager', params)
}
export function AdminManagerResetGoogleCode(user_id: number) {
    const params = {
        user_id: user_id
    }
    return axios.post('AdminManagerResetGoogleCode', params)
}
