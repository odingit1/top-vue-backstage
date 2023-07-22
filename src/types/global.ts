export interface AnyObject {
  [key: string]: unknown
}

export interface Options {
  value: unknown
  label: string
}

export interface NodeOptions extends Options {
  children?: NodeOptions[]
}

export interface GetParams {
  body: null
  type: string
  url: string
}

export interface PostData {
  body: string
  type: string
  url: string
}

export interface Pagination {
  current: number
  pageSize: number
  total?: number
  pageSizeOptions?: number[]
}
export interface ExportParams {
  isExport: {
    apiName: string
    emailContent: object
  }
}
export type TimeRanger = [string, string]

export interface GeneralChart {
  xAxis: string[]
  data: Array<{ name: string; value: number[] }>
}

export interface mapFace {
  [symbol: string | number]: any
}

export interface httpCallback<T> {
  _param: T
}

export interface httpList<T> {
  list: T[]
  total?: number
}

export interface httpData<T> {
  data: T[]
  total?: number
}

export interface paginationReq {
  page: number
  limit: number
}