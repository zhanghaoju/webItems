<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </page-tools>
      <!--表格-->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button type="text" @click="addPermission(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--放置弹层-->
    <el-dialog :title="showText" :visible="showDialog" @close="btnCancel">
      <!--表单-->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" style="width:90%" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, getPermissionDetail, delPermission, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 不需要显示 点击添加的时候已经知道类型了 当type=1时为访问权限，当type为2时为功能权限
        pid: '', // 需要知道添加的是哪个节点
        enVisible: '0' // 开启
      },
      rules: {
        name: [{
          required: true,
          message: '权限名称不能为空',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '权限标识不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      // 将数据转换为树形结构
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    // 删除
    delPermission(id) {
      this.$confirm('确认删除该权限点吗').then(() => {
        return delPermission(id)
      }).then(() => {
        this.$message.success('删除成功')
        // 重新拉取数据
        this.getPermissionList()
      })
    },
    // 新增
    addPermission(pid, type) {
      // 访问权的type=1 按钮操作的权限type =2
      // pid表示当前数据的父节点的标识
      // 记录当前添加的类型和父标识
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    // 确定按钮
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        if (!this.formData.id) {
          // 提示信息
          this.$message.success('新增成功')
        } else if (this.formData.id) {
          // 提示信息
          this.$message.success('编辑成功')
        }
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    // 编辑
    async editPermission(id) {
      // 根据id获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }

  }
}
</script>

<style>

</style>

