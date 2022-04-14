// 权限配置 权限拦截，在路由跳转，路由守卫
// 引入router
import router from '@/router'
// 引入store实例和组件中的this.$store一样 拿到token
import store from '@/store'
// 引入进度条
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

// 定义白名单 所有不受权限控制的页面
const whiteList = ['/login', '/404']

// 不需要导出 因为只需要让代码执行即可
// 导航的前置守卫 to 到哪里去，from 从哪里来，next是前置守卫必须执行的钩子，如果不执行页面无法使用
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  nprogress.start()
  if (store.getters.token) {
    // 如果有token 判断是否有登录页 有token的情况下才能获取资料
    if (to.path === '/login') {
      // 如果访问的是/login登录页
      next('/') // 跳到主页
    } else {
      // 只有放行的时候采取获取资料
      // 如果当前vuex有用户资料的id，表示已经有资料了，不需要获取了，如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id才表示当前用户资料没有获取过来
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果后续需要根据用户资料获取数据的话这里必须改成同步
        // 筛选用户的可用路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是筛选得到的动态路由 添加到路由表中，默认的路由表只有静态路由没有动态路由
        // addRoutes必须用next(地址) 不能用next()
        routes.addRoutes([...routes, { path: '*', redirect: '404', hidden: true }])
        // 添加完动态路由之后，
        next({ ...to, replace: true }) // 相当于跳到对应的地址，多做一次跳转？进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        next()
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果大于-1表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  // 手动强制关闭一次，为了解决切换地址时进度条不关闭的问题
  nprogress.done()
})
// 后置守卫
router.afterEach(() => {
  // 关闭进度条
  nprogress.done()
})
