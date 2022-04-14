<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--组织架构的内容 - 头部-->
      <el-card class="tree-card">
        <!--放置里面的内容-->
        <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!--放置一个el-tree-->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!--传入内容 插槽内容 会循环多次 有多少节点就循环多少次-->
          <!--作用域插槽 slot-scopt="obj" 接收传递给插槽的数据 data每个节点的数据对象 -->
          <tree-tools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!--放置新增弹层组件-->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
// 导入封装的组件
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'

import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  // 注册组件
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      // 组织架构
      departs: [],
      defaultProps: {
        label: 'name', // 从这个属性显示内容
        children: 'children' // 从这个属性去找子节点
      },
      showDialog: false, // 显示窗体
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = {
        name: result.companyName,
        manager: '负责人',
        id: ''
      }
      // 将数组转换为树形结构
      this.departs = tranListToTreeData(result.depts, '')
      console.log(result)
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    // node 当前点击的部门
    addDepts(node) {
      this.showDialog = true // 弹出层
      this.node = node
    },
    /* test(value) {
     this.showDialog = value
     },*/
    editDepts(node) {
      // 进入当前的编辑节点
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

