import axios from 'axios'

export interface RoleData {
  id: number
  account: string
  accountCount: number
}
export interface RoleRes {
  roles: []
  meta: {
    total: number
    perPage: number
    currentPage: number
  }
}

export interface RoleParams extends Partial<RoleData> {
  current: number
  pageSize: number
}

export function queryRoles(params: { isCache?: boolean }) {
  return axios.get<RoleRes>('/v1/admin/roles', {
    isCache: params.isCache,
  })
}
export function getRole(params: RoleParams) {
  return axios.get<RoleRes>(`/v1/admin/roles/${params.id}`)
}
export function queryPermissions() {
  return axios.get('/v1/admin/permissions', {
    isCache: true,
  })
}
export function queryPermissionGroups() {
  return axios.get('/v1/admin/permission_groups', {
    isCache: true,
  })
}

export interface CreateEditRoleParams {
  id?: number
  permissionIds: []
  roleName: string
  adminPassword: string
  defaultRole?: []
}

export function createRole(data: CreateEditRoleParams) {
  return axios.post('/v1/admin/roles', {
    role_name: data.roleName,
    permission_ids: data.permissionIds,
    admin_password: data.adminPassword,
  })
}
export function updateRole(params: CreateEditRoleParams) {
  return axios.patch(`/v1/admin/roles/${params.id}`, {
    role_name: params.roleName,
    permission_ids: params.permissionIds,
    admin_password: params.adminPassword,
  })
}

export function deleteRole(params: { id: number; adminPassword: string }) {
  return axios.delete(`/v1/admin/roles/${params.id}`, {
    data: { admin_password: params.adminPassword },
  })
}
