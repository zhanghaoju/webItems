// 负责管理所有的自定义指令
export const imgerror = {
  // 指令对象 inserted在当前dom元素插入到节点之后执行
  inserted(dom, options) {
    // dom 表示当前指令作用的dom对象 dom认为此时就是图片
    dom.src = dom.src || options.value // 初始化的时候如果有值则赋值 如果没值则需要进行默认值
    // 当图片有地址但是没有加载成功的时候会报错，触发图片的事件 => onerror
    // options是指令中变量的解释 其中有一个属性叫做value，是传给的变量的值
    dom.onerror = function() {
      // dom可以注册error事件
      // 当图片出现异常的时候 会将指令配置的默认图片设置该图片的内容
      dom.src = options.value // 这里不能写死
    }
  },
  // 该函数同Insert一样也是一个钩子函数
  componentUpdated(dom, options) {
    // 该钩子函数会在当前指令作用的组件完成之后执行
    // inserted只会执行一次
    // 组件初始化后一旦更新就不会再进入inserted函数 会进入componentUpdated中
    dom.src = dom.src || options.value
  }
}

