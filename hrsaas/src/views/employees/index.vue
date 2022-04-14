<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!--左侧显示记录数-->
        <!--<span slot="before">共16条记录</span>-->
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条记录</span>
        </template>
        <!--右侧显示按钮  Excel导入 Excel导出 新增员工-->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <!--表格组件 sortable可排序 -->
      <el-card>
        <el-table v-loading="loading" :data="list">
          <!--在表格中显示序号使用type=index-->
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column width="120px" label="头像" align="center">
            <!--插槽-->
            <template v-slot="{ row }">
              <img
                v-imgerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" sortable="" />
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column :formatter="formatEmployment" prop="formOfEmployment" label="聘用形式" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <!--使用作用域插槽和作用域进行处理-->
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <template v-slot="{row}">
              <!--格式化入职时间-->
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template v-slot="{row}">
              <el-switch :value="row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <!--通过作用域插槽获取id-->
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--放置分页组件-->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!--sync修饰符 目的：子组件去改变父组件数据的一个语法糖-->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!--放置分配组件-->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
// 将接口引过来
import { getEmployeeList, delEmployee } from '@/api/employees'
// 引入员工的枚举对象
import ElployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'

// 引入时间过滤器方法
import { formatDate } from '@/filters'

import QrCode from 'qrcode'
import AssignRole from './components/assign-role'

export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      list: [], // 接收数组
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false, // 显示遮罩层
      showDialog: false, // 默认是关闭的弹层
      showCodeDialog: false,
      showRoleDialog: false, // 显示分配角色的弹层
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const {
        total,
        rows
      } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // newPage最新页码
    changePage(newPage) {
      this.page.page = newPage // 赋值
      this.getEmployeeList() // 重新拉取数据
    },
    // 格式化聘用形式 row行数据 column列数据 cellValue单元格值
    formatEmployment(row, column, cellValue, index) {
      // 要去找1所对应的值
      const obj = ElployeeEnum.hireType.find(item => item.id === cellValue)
      // 如果obj不为空 返回结果
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗？')
        // 如果点击了确定会进入下方
        await delEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList()
      } catch (error) {
        console.log('删除失败')
      }
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出Excel
      import('@/vendor/Export2Excel').then(async excel => {
        // excel是引入文件的导出对象
        // 导出 header哪里来
        // data从哪里取 获取所有数据
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total
        })
        const data = this.formatJson(headers, rows) // 返回data 导出结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: '员工信息表',
          multiHeader: multiHeader,
          merges: merges
        })
      })
    },
    // 将表头数据和数据进行对应
    formatJson(headers, rows) {
      return rows.map(item => {
        // item格式 [mobile:1232132, username:'张三']
        // item 是一个对象 ["手机号","姓名"....]
        return Object.keys(headers).map(key => {
          // 需要判断字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = ElployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]] // ["123","张三"...]
        })
      })
    },
    showQrCode(url) {
      // url存在的情况下弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新 页面的渲染是异步的
        // 第一个参数 canvas的dom对象 第二个参数 将地址转换为二维码链接
        // 上一次数据更新完毕，页面渲染之后执行
        this.$nextTick(() => {
          // 此时可以确认有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id) {
      // 弹出层
      this.userId = id // props赋值 props赋值渲染是异步的
      await this.$refs.assignRole.getUserDetailById(id) // 会调用子组件方法传入id 异步方法
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>

