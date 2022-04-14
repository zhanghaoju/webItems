<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--放置卡片-->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!--左侧内容-->
            <el-row style="height: 60px;">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="showDialog=true"
              >新增角色
              </el-button>
            </el-row>
            <!--给表格绑定数据-->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120px" />
              <el-table-column align="center" prop="name" label="名称" width="240px" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column label="操作">
                <!--作用域插槽-->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!--放置分页组件-->
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert type="info" :show-icon="true" :closable="false" title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" />
            <!--右侧内容-->
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" style="width: 400px;" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" style="width: 400px;" disabled />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" style="width: 400px;" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" style="width: 400px;" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :row="3" style="width: 400px;" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!--放置一个弹层组件 visible控制显示-->
    <!--close事件在点击确定的时候会触发-->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!--放置footer插槽-->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!--给角色分配权限弹出层-->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!--权限是一棵树 将数据绑定到组件上 check-strictly 如果为true 那表示父子勾选时，不互相关联你，如果为false就是互联关联 id作为唯一标识-->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入接口
import { getRoleList, getCompanyInfo, deleteRole, assignPerm, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permisson'

export default {
  data() {
    return {
      showPermDialog: false, // 控制分配权限弹层的显示后隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限的数据 树形数据
      selectCheck: [], // 定义一个数组来接收
      roleId: null,
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1, // 页码
        pagesize: 3, // 条数
        total: 0 // 默认总数
      },
      formData: {
        // 公司信息
      },
      showDialog: false, // 控制弹层显示
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const {
        total,
        rows
      } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      // 直接赋值给formData
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      // newPage当前点击的页码
      this.page.page = newPage
      // 重新执行获取页码
      this.getRoleList()
    },
    async deleteRole(id) {
      // 提示
      try {
        await this.$confirm('确认删除该角色吗？')
        // 只有点击了确定才能进入到下方
        // 调用删除接口
        await deleteRole(id)
        // 重新加载数据
        this.getRoleList()
        // 提示
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 实现数据的回写
      this.showDialog = true// 显示弹层
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过之后才会执行await下方内容
        // roleForm有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功')
        // 弹层关闭
        this.showDialog = false // 调用关闭弹层的时候会触发el-dialog的close事件
      } catch (error) {
        console.log('校验失败')
      }
    },
    btnCancel() {
      // 弹层关闭
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验规则
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async assignPerm(id) {
      // 0 表示找到所有的节点 true
      this.permData = tranListToTreeData(await getPermissionList(), '0') // 转换list到树形数据
      this.roleId = id
      // 应该取这个id的权限点，有id就可以 id先记录下来
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    },
    async btnPermOK() {
      // 调用el-tree的方法 getCheckedKeys若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }
}
</script>

<style>

</style>

