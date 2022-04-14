import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth' // 目的是实现数据的持久化
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  // 设置token为共享状态，初始化vuex的时候，先从缓存中读取token
  token: getToken(),
  userInfo: {} // 这里定义一个空对象
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token // 将数组给vuex
    // 同步给缓存
    setToken(token)
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 将vuex的数据置空
    removeToken() // 同步到缓存
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token之后代表登录成功
    // axios默认加了一层data 只要执行到这里说明已经成功了在request响应拦截中data一层已经去掉
    /* if (result.data.success) {*/
    // 如果为true，表示登录成功 actions要修改state 必须通过mutations
    context.commit('setToken', result) // 设置token
    /* }*/
    setTimeStamp() // 设置当前的时间戳
  },
  // 封装获取用户资料
  async getUserInfo(context) {
    // 获取返回值
    const result = await getUserInfo()
    // 获取用户详情
    const baseInfo = await getUserDetailById(result.userId) // 为了获取对象
    // 将两个接口的结果进行合并
    const baseResult = { ...result, ...baseInfo }
    // 将整个个人信息设置到用户的vuex数据中
    context.commit('setUserInfo', baseResult) // 提交到mutations
    // 用于做权限
    return result
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除缓存
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  // 状态
  state,
  // 修改状态
  mutations,
  // 执行异步
  actions
}
