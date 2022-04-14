<template>
  <!--作用域插槽 slot-scopt="obj" 接收传递给插槽的数据 data每个节点的数据对象 -->
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <!--左侧内容-->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!--右侧内容-->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!--放置下拉菜单-->
          <el-dropdown @command="operateDepts">
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!--具名插槽-->
            <el-dropdown-menu slot="dropdown">
              <!--下拉选项-->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
// 该组件需要对外开放属性， 外部需要提供一个对象，对象里需要有name manage
import { delDepartments } from '@/api/departments'

export default {
  // props 可以用数组来接收数据，也可以用对象来接收
  props: {
    // 定义一个传入的属性
    treeNode: {
      require: true, // 要求对象使用组件的时候必须传入treeNode属性，如果不传就会报错
      type: Object // 对象类型
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      // 点击编辑 删除 新增时触发
      if (type === 'add') {
        // 添加
        // 添加子部门 当前点击的部门下添加子部门 = this.treeNode
        this.$emit('addDepts', this.treeNode) // 触发一个自定义事件
      } else if (type === 'edit') {
        // 编辑 触发自定义事件 ，点击谁编辑谁
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除
        // alert('删除')
        this.$confirm('您确定要删除该组织架构吗').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 等到成功的时候调用接口删除了，后端数据变化 但是前端数据没有变 重新获取
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
