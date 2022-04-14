import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
// 定义超时时间
const TimeOut = 3600 // 定义超时时间 1个小时
const service = axios.create(
  {
    // 当执行npm run dev的时候 会读取 .evn.development 会触发跨域
    baseURL: process.env.VUE_APP_BASE_API, // /dev-api /prod-api
    // 设置超时时间
    timeout: 5000
  }
)
// 请求拦截器 进行注入token
service.interceptors.request.use(config => {
  // config是请求的配置信息
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下，才有必要检查时间戳是否超时
    if (CheckTimeOut()) {
      // 如果为true表示过期
      // token超时之后删除token删除用户资料
      store.dispatch('user/logout')
      // 跳转登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // config必须要返回的
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const {
    success,
    message,
    data
  } = response.data
  // 要根据success的成功与否，决定下面的操作
  if (success) {
    return data
  } else {
    // 业务错误 直接进入catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error信息里面的response的对象是否等于10002状态码(代表token失效)
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 后端告诉我token超时
    store.dispatch('user/logout') // 掉登出操作
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入catch
})
// 是否超时 当前时间-缓存中的时间 是否大于时间差
function CheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存的时间戳
  // date时间默认是毫秒需要获得秒数
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
