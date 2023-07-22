import axios from 'axios'
export interface commoncfglistParams {
    current: number
    pageSize: number
    tab_name: string
    query: string
    filter: [],
    sort_field: string
    app_id: number
    plat_id: number
}
export function commoncfglist(data: commoncfglistParams) {
    const params = {
        _param: {
            limit: data.pageSize,
            page: data.current,
            tab_name: data.tab_name,
            filter: data.filter,
            sort_field: data.sort_field,
            query: data.query,
            app_id: data.app_id,
            plat_id: data.plat_id,
        }
    }
    return axios.post('commoncfg/list', params)
}
export function commoncfgnamelist() {
    const params = {
        _param: {
            app_id: -1,
            plat_id: -1,
        }
    }
    return axios.post('commoncfg/namelist', params)
}
export interface syncParams {
    tab_names: any[]
    plat_ids: any[]
}
export function commoncfgbatchsync(data: syncParams) {
    const params = {
        _param: {
            app_id: -1,
            plat_ids: data.plat_ids,
            tab_names: data.tab_names,
        }
    }
    return axios.post('commoncfg/batchsync', params)
}

export interface uploadschemaParams {
    data: string
    all_rpc_modify: number
}
export function commoncfguploadschema(data: uploadschemaParams) {
    const params = {
        _param: {
            plat_id: -1,
            data: data.data,
            all_rpc_modify: data.all_rpc_modify,
        }
    }
    return axios.post('commoncfg/uploadschema', params)
}
export interface commoncfgdelParams {
    tab_name: string
    _id: string
}

export function commoncfgdel(data: commoncfgdelParams) {
    const params = {
        _param: {
            plat_id: -1,
            app_id: -1,
            _id: data._id,
            tab_name: data.tab_name,
        }
    }
    return axios.post('commoncfg/del', params)
}
