// vuex的权限模块
import { constantRoutes, asyncRoutes } from '@/router'

// 用来存放当前的静态路由和当前用户的权限路由
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  // newRoutes可以认为是用户登录通过权限所得到的动态路由部门
  setRoutes(state, newRoutes) {
    // 每次在更新的时候都应该在静态路由基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由，第二个参数为当前用户的所拥有的的菜单权限 asyncRoutes是所有的动态路由
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出 动态路由和menus中能够对上的路由
    menus.forEach(key => {
      // 查找有没有对象中的name属于等于key的，如果找不到就没权限，如果找到了就筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组 有可能有元素，也有可能是空数组
    })
    // 得到的routes是所有模块中满足权限要求的路由数组，routes就是当前用户所拥有的动态路由的权限
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // state数据是用来显示左侧菜单用的 return是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

