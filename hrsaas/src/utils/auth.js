import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token-hj' // 设置一个唯一的key

const timeKey = 'hrsass-timestamp-key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取时间戳
export function getTimeStamp() {
  return Cookies.set(timeKey)
}
// 读取时间戳
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}
