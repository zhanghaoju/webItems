import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// 引入过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]) // 注册自定义的过滤器
})
// 引入自定义组件
import Components from '@/components'
// 引入自定义指令
import * as directives from '@/directive'
// 遍历对象 将所有对象转换为数组
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]) // 注册自定义指令
})
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 注册自定义组件
Vue.use(Components)
Vue.config.productionTip = false
// 实例化Vue
new Vue({
  el: '#app',
  router, // 路由
  store, // vuex
  render: h => h(App)
})
