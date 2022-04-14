// 工资 导入路由规则配置
import Layout from '@/layout'
// 子路由采用动态按需加载
export default {
  // 路由规则
  path: '/salarys',
  name: 'salarys', // 给模块的一级路由加一个name属性 后续做权限的时候会用到
  component: Layout,
  children: [
    {
      // 二级路由的path什么都不用写的时候，此时它表示二级路由的默认路由
      path: '', // 这里不用写 如果为空表示 /employees不但有布局layout还有下面的员工的主页
      component: () => import('@/views/salarys'),
      // 路由元信息，就是一个存储数据的地方，可以放任何数据
      meta: {
        title: '工资', // 左侧导航读取了这里的title属性
        icon: 'money'
      }
    }
  ]
}
