<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!--多选框组 双向绑定 -->
    <el-checkbox-group v-model="roleIds">
      <!--要循环的选项-->
      <!--要显示角色的名称 存储角色id-->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!--定义footer插槽-->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用来查询当前用户的角色信息
    userId: {
      // 用户的id 当前要处理的哪个用户
      type: String,
      default: null
      /* required: true*/ // 要求必须传该id
    }
  },
  data() {
    return {
      list: [], // 负责存储当前所有角色id
      roleIds: [] // 这个数组负责存储 当前用户所拥有的角色id
    }
  },
  created() {
    // 获取所有角色
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      // 调用接口
      const { rows } = await getRoleList({
        page: 1,
        pagesize: 20
      }) // 默认只取10条数据
      // rows是要循环的记录
      this.list = rows
    },
    // 获取用户当前角色 props传值是一个异步的 这里不能使用this.userId
    // 这个方法是给父组件调用的
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 将用户所拥有的角色赋值给当前用户的对象
    },
    async btnOK() {
      await assignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      // 关闭弹层
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = [] // 清空原来的数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style scoped>

</style>
