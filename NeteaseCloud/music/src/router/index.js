// 路由模块
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout'
import Home from '@/views/Home'
import Search from '@/views/Search'
import Play from '@/views/Play'
// 注册路由
Vue.use(VueRouter)
// 配置规则
const routes = [
    {
        path: '/',
        // 强制重定向到layout
        redirect: 'layout'
    },
    {
        path: '/layout',
        component: Layout,
        // 重定向到/layout/home下
        redirect: '/layout/home',
        children: [
            
            {
                path: 'home',
                component: Home,
                meta: { // meta是保存路由对象额外信息的
                    title: '首页'
                },
            },
            {
                path: 'search',
                component: Search,
                meta: {
                    title: '搜索'
                },
            }
        ]
    },
    {
        path: '/play',
        component: Play
    }
]
// 生成路由对象
const router = new VueRouter({
    routes
});
// 导出路由对象
export default router
