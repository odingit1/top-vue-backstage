import axios from 'axios'


export function AdminRoleGetRoleList() {
    return axios.post('AdminRole/GetRoleList')
}

export interface RoleParams {
    description: string
    name: string
    role_id: number
    sort: number
    status: number
    menus?: number[]
}

export function AdminRoleSaveRole(data: RoleParams) {
    const params = {
        buttons: [],
        role_type: 0,
        ...data
    }
    return axios.post('AdminRole/SaveRole', params)

}

export function AdminRoleDelRole(role_id: number) {
    const params = {
        role_id: role_id
    }
    return axios.post('AdminRole/DelRole', params)

}
