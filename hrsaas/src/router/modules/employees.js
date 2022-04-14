// 导入路由规则配置
import Layout from '@/layout'
// 子路由采用动态按需加载
export default {
  // 路由规则
  path: '/employees',
  name: 'employees', // 给模块的一级路由加一个name属性 后续做权限的时候会用到
  component: Layout, // 组件
  children: [
    {
      // 二级路由的path什么都不用写的时候，此时它表示二级路由的默认路由
      path: '', // 这里不用写 如果为空表示 /employees不但有布局layout还有下面的员工的主页
      component: () => import('@/views/employees'),
      // 路由元信息，就是一个存储数据的地方，可以放任何数据
      meta: {
        title: '员工管理', // 左侧导航读取了这里的title属性
        icon: 'people'
      }
    },
    {
      path: 'detail/:id?', // 动态路由参数 /employes/detail/123 设置不管是否有id都可以访问页面 + ?
      component: () => import('@/views/employees/detail'),
      // 有两个子节点路由 不能同时显示 需要隐藏当前路由
      hidden: true,
      meta: {
        title: '员工详情'
      }
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/print'),
      hidden: true,
      meta: {
        title: '员工打印'
      }
    }
  ]
}
