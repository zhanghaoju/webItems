### 网易云音乐
#### 1. 前置安装
+ 初始化工程
+ 安装axios vant vue-router ： yarn add axios vant vue-router
+ 安装babel-plugin-import 按需加载 ：yarn add babel-plugin-import -D
+ 在babel.config.js配置
+ 引入相关包到main.js

### 2. 需求分析
### 3. 准备路由
+ 下载/引入/注册/规则/路由对象/注入/显示
+ 改变url的hash值路径，导致对应组件显示

### 4.tabbar导航
+ 使用vant组件 [位置](https://vant-contrib.gitee.io/vant/#/zh-CN/tabbar#yin-ru)
### 5. NavBar导航的使用
+ 引入，注册，在响应位置使用，选择属性使用 [位置](https://vant-contrib.gitee.io/vant/#/zh-CN/nav-bar)
### 6. 头部导航的切换显示
+ 当前路由信息对象里的meta中标题
+ 检测$route改变，提取当前路由对象信息里meta中标题

### 7. 网络请求的封装
+ 目标：网络请求，不散落在各个逻辑页面里，封装起来方便以后修改
+ utils/request.js -对axios进行二次封装，并且制定项目的根地址
+ api/Home.js 统一管理所有需要的url地址，封装网络请求的方法并导出
+ api/index.js -统一导出接口
+ 在main.js引入API方法请求测试
+ 为什么要封装api？
  + 代码分层，便于以后的修改，无需触碰逻辑页面

### 8.推荐歌单
+ 布局使用van-row和van-col
+ van-image显示图片，p标签显示歌名
+ 引入api里的网络请求方法，把数据请求回来，循环铺设
### 9.最新音乐
+ 目标：完成最新音乐单元格列铺设
+ 引入注册使用van-cell，并且设置一套标签和样式准备
+ 在api/Home.js 最新音乐的接口方法
+ 引入到Home/index.vue中，数据铺设到页面上

### 10.热搜关键字
+ 目标：完成搜索框和热搜关键字显示
+ 搜索框 - van-search组件
+ api/Search.js -热搜关键字 -接口方法
+ Search/index.vue引入 -获取热搜关键字 -铺设页面
+ 点击文字填充到输入框

### 11.搜索结果-点击获取
+ 目标：匹配结果显示
+ api/Search.js -搜索结果，接口方法
+ Search/index.vue -获取搜索结果-铺设页面
+ 和热搜关键字容器-互斥显示
+ 点击文字填充到输入框，请求搜索结果铺设
### 12.搜索结果-输入框
+ 目标：检测输入框改变
+ 观察van-search组件是否支持和实现input事件
+ 绑定@input事件和方法
+ 在事件处理方法中获取对应的值使用
  + input事件和change事件区别
    + input：只要内容改变实时触发
    + change：失去节点内容改变才触发
### 13.搜索结果-加载更多
+ 目标：触底后加载下一页数据
+ van-list组件检测触底执行onload事件
+ 配合后台接口，传递下一页的标识
+ 拿到下一页数据后追加到当前数组末尾即可
### 14. 防抖使用
+ 目标：修复输入框删除过快-效果错误
+ 接着快速删除：
  + 每次改变-马上发送网络请求
  + 网络请求异步耗时-数据回来后还是铺设到页面上
+ 什么是防抖？
  + 计时n秒，只执行最后一次，如果再次触发，重新计时
### 15. SongItem封装
+ 目标：搜索结果和首页使用相同标签结构
+ 首页的最新音乐和搜索结果的音乐
+ 标签样式功能相同
+ 封装SongItem.vue到这2处复用即可
### 16.跳转播放
+ 目标：组件SongItem里-点击事件
+ api/Play.js-提前准备好-接口方法
+ 跳转到Play页面-把歌曲id带过进去
### 17.Vant组件适配
+ postcss-配合webpack翻译css代码
+ postcss-pxtorem-配合webpack，自动把px转成rem
+ 新建postcss.config.js-设置相关配置

### 启动命令

```npm
npm run serve
```

