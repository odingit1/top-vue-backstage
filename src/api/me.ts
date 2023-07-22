import axios from 'axios'
import md5 from 'js-md5'

export interface ResetMePasswordParams {
    newPassword: string
    oldPassword: string
    confirmPassword?: string
    otpCode?: string
}

export function resetMePassword(params: ResetMePasswordParams) {
    return axios.post('/op/Account/ChangePwd', {
        old_pwd: md5(params.oldPassword),
        new_pwd: md5(params.newPassword),
        code: params.otpCode,
    })
}

export interface LoginData {
    username: string
    password: string
    code: string
}
export interface LoginRes {
    appId: number
    googleStatus: number
    id: number
    loginTime: number
    randNum: number
    sessId: number
    status: number
    token: string
    userName: string
}
export interface googleBindData {
    data: any
    [x: string]: any
    _param: any
    code_bind_name: string
    code_qr_url: string
    code_secret: string
}

export function login(data: LoginData) {
    const params = {
        user_name: data.username,
        pwd: md5(data.password),
        code: data.code || '',
    }
    return axios.post('login/login', params)
}

export function CheckGoogleBind(data: LoginData) {
    const params = {
        user_name: data.username,
        pwd: md5(data.password),
        code: data.code || '',
    }
    return axios.post('/login/checkgooglebind', params)
}

export interface appid {
    appid: number
}
// export function AccountAppList(data: appid) {
//     return axios.post('/op/Account/AppList', {})
// }

export function MenuGetUserMenu() {
    return axios.post('AdminMenu/GetSelfAllMenu', {})
}


export function rootadminplatform() {
    return axios.post('rootadmin/platform', {})
}
export function appallapp() {
    return axios.post('app/allapp', {})
}