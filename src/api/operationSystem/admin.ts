import axios from 'axios'
import { stringify } from 'query-string'

export interface AdminsParams {
  current: number
  pageSize: number
  id: number
  account: string
  departmentId: number
  roles: [string]
}

export function queryAdmins(params?: AdminsParams) {
  return axios.get<AdminsParams>('/v1/admin/admins', {
    params: {
      page: params?.current,
      per_page: params?.pageSize,
      q: {
        id_eq: params?.id,
        account_eq: params?.account,
        departments_id_eq: params?.roles ? null : params?.departmentId,
        roles_name_in: params?.roles,
      },
    },
    paramsSerializer: (obj) => {
      return stringify(obj, { arrayFormat: 'bracket' })
    },
  })
}

export interface DropDownAdminsParams {
  current?: number
  pageSize?: number
  searchValue?: string
}
export function queryAdminsWithoutAgent(params: DropDownAdminsParams) {
  const q = {
    account_cont: params?.searchValue,
  }
  return axios.get<AdminsParams>('/v1/agents/drop_down/admins', {
    params: {
      page: params?.current,
      per_page: params?.pageSize,
      q,
    },
    paramsSerializer: (obj) => {
      return stringify(obj, { arrayFormat: 'bracket' })
    },
  })
}
export function getAdmin(params: AdminsParams) {
  return axios.get(`/v1/admin/admins/${params.id}`)
}

export interface EditUserParams {
  id?: number
  account: string
  roles?: string[]
  email?: string
  adminPassword?: string
  isOtpEnable: boolean
}

export function createAdmin(params: EditUserParams) {
  return axios.post('/v1/admin/admins', {
    account: params.account,
    admin_password: params.adminPassword,
    email: params.email,
    roles: params.roles,
    is_otp_enable: params.isOtpEnable,
  })
}

export function updateAdmin(params: EditUserParams) {
  return axios.patch(`/v1/admin/admins/${params.id}`, {
    admin_password: params.adminPassword,
    roles: params.roles,
    email: params.email,
    is_otp_enable: params.isOtpEnable,
  })
}

export function freezeAdmin(params: { id: number; adminPassword: string }) {
  return axios.delete(`/v1/admin/admins/${params.id}`, {
    data: { admin_password: params.adminPassword },
  })
}
export function restoreAdmin(params: { id: number; adminPassword: string }) {
  return axios.post(`/v1/admin/admins/${params.id}/restore`, {
    admin_password: params.adminPassword,
  })
}

export function delete2FA(params: { id: number; adminPassword: string }) {
  return axios.delete(`/v1/admin/admins/${params.id}/delete_2fa`, {
    data: { admin_password: params.adminPassword },
  })
}

export function resetAdminPassword(params: {
  id: number
  adminPassword: string
}) {
  return axios.put(
    `/v1/admin/admins/${params.id}/repassword
  `,
    {
      admin_password: params.adminPassword,
    }
  )
}
