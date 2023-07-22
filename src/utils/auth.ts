const TIME_ZONE_KEY = 'America/Sao_Paulo'
const USER_DATA_KEY = 'userdata'
const APPID_KEY = 'app_id'
const LOGIN_APPID_KEY = 'login_app_id'
const isLogin = () => {
    return !!sessionStorage.getItem(USER_DATA_KEY)
}

const getUserData = () => {
    return JSON.parse(sessionStorage.getItem(USER_DATA_KEY))
}

const setUserData = (userinfo: string) => {
    sessionStorage.setItem(USER_DATA_KEY, userinfo)
}

const clearUserData = () => {
    sessionStorage.removeItem(USER_DATA_KEY)
}

const getAppid = () => {
    return Number(sessionStorage.getItem(APPID_KEY))
}

const setAppid = (appid: string) => {
    sessionStorage.setItem(APPID_KEY, appid)
}

const clearAppid = () => {
    sessionStorage.removeItem(APPID_KEY)
}
const getTimeZone = () => {
    return sessionStorage.getItem(TIME_ZONE_KEY)
}
const setTimeZone = (timeZone: string) => {
    sessionStorage.setItem(TIME_ZONE_KEY, timeZone)
}
const clearLoginAppId = () => {
    sessionStorage.removeItem(LOGIN_APPID_KEY)
}
const getLoginAppId = () => {
    return sessionStorage.getItem(LOGIN_APPID_KEY)
}
const setLoginAppId = (loginAppId: string) => {
    sessionStorage.setItem(LOGIN_APPID_KEY, loginAppId)
}
LOGIN_APPID_KEY
export {
    isLogin,
    getUserData,
    setUserData,
    clearUserData,
    setAppid,
    getAppid,
    clearAppid,
    getTimeZone,
    setTimeZone,
    clearLoginAppId,
    getLoginAppId,
    setLoginAppId,
}
