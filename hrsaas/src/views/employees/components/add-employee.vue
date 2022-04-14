<template>
  <!--注册close事件 x关闭-->
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!--表单-->
    <el-form ref="addEmployee" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 50%;" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 50%;" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 50%;" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 50%;" placeholder="请选择聘用形式">
          <!--:value 存入的值是id 显示的值是value-->
          <el-option v-for="item in EmployeesEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 50%;" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width: 50%;" placeholder="请选择部门" @focus="getDepartments" />
        <!--想要弹出树形结构 需要使用el-tree-->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          :props="{label:'name'}"
          :default-expand-all="true"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width: 50%;" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!--footer插槽-->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 引入组织架构接口
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeesEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeesEnum,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '用户姓名不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
          },
          // pattern正则表达式 如果满足就通过校验不满足不通过
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [{
          required: true,
          message: '聘用形式不能为空',
          trigger: 'blur'
        }],
        workNumber: [{
          required: true,
          message: '工号不能为空',
          trigger: 'blur'
        }],
        // trigger设置change
        departmentName: [{
          required: true,
          message: '部门不能为空',
          trigger: 'change'
        }],
        timeOfEntry: [{
          required: true,
          message: '入职时间',
          trigger: 'blur'
        }]
      },
      // 定义一个数组来接收树形结构
      treeData: [],
      // 定义一个属性显示和隐藏树形结构
      showTree: false, // 默认不显示
      loading: false
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      // 解构拿到接口中depts数组
      const { depts } = await getDepartments()
      // depts是一个数组，需要转换为树形结构才可以被el-tree显示
      // 第二个参数是节点 所有pid为空字符串
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      /* console.log(arguments)*/
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOK() {
      try {
        // 校验表单
        await this.$refs.addEmployee.validate()
        // 校验成功之后执行下面的内容
        await addEmployee(this.formData) // 调用新增接口
        // 通知父组件更新数据
        // 正常 this.$emit
        this.$parent.getEmployeeList() && this.$parent.getEmployeeList() // $parent 取到实例 直接调用父组件的更新方法
        this.$parent.showDialog = false
        // 这里不用写重置 因为关闭弹层触发了close事件  close事件绑定了btncanel事件
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 清空表单
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 移除校验
      this.$refs.addEmployee.resetFields()
      // 关闭窗口 可以在父组件中的sync修饰符中直接处理
      this.$emit('update:showDialog',false)
    }
  }
}
</script>

<style scoped>

</style>
