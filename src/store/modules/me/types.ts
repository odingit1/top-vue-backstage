export type RoleType = '' | '*' | 'admin' | 'user'
export interface UserState {
    code?: number
    app_id: number
    google_status: number
    id: number
    login_time: number
    status: number
    token: string
    user_name: string
    allConfMenu: menu[]
    msg?: string
    data?: any
    mid?: number
}

export interface menu {
    buttons: object
    children: menu[]
    classname: string
    icon: string
    ispage: number
    menu_id: number
    pid: number
    sort: number
    status: number
    title: string
    url: string
}

export interface Role {
    id: number
    name: string
    count: number
}

export interface Department {
    id: number
    name: string
    adminsCount: number
    createdAt: string
}
