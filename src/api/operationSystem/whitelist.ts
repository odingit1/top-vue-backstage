import axios from 'axios'
import { WhitelistData } from '@/store/modules/setting/types'
import qs from 'query-string'

export interface WhitelistRes {
  whitelists: WhitelistData[]
  meta: {
    totalCount: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
  }
}

export interface WhitelistParams extends Partial<WhitelistData> {
  current?: number
  pageSize?: number
  name?: string
  ip?: string
  adminPassword?: string
}

export function queryWhiteLists(params: WhitelistParams) {
  return axios.get<WhitelistRes>('/v1/whitelists', {
    params: {
      page: params.current,
      per_page: params.pageSize,
      q: {
        name_cont: params.name,
        ip_cont: params.ip,
      },
    },
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    },
    isCache: false,
  })
}

export interface CreateWhitelistParams {
  ip: string
  name: string
  adminPassword: string
}

export function createWhitelists(data: CreateWhitelistParams) {
  return axios.post('/v1/whitelists', {
    ip: data.ip,
    name: data.name,
    admin_password: data.adminPassword,
  })
}

export function deleteWhitelists(params: {
  id: number
  adminPassword: string
}) {
  return axios.delete(`/v1/whitelists/${params.id}`, {
    data: { admin_password: params.adminPassword },
  })
}
