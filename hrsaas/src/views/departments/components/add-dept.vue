<template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!--表单数据 label-width设置所有标题的宽度 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%;" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 80%;" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native修饰符 可以找到原生元素的事件 -->
        <el-select v-model="formData.manager" style="width: 80%;" placeholder="请选择" @focus="getEmployeeSimple">
          <!--遍历选项-->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!--确定和取消-->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value是部门名称，要去和同级部门下的部门去比较，有没有相同的，有相同的不能过
      // 解构出里面的depts
      const { depts } = await getDepartments()
      // 去找同级部门下 有没有和value相同的数据
      // 找到所有的子部门 然后判断名字是否有一样的
      /* debugger*/
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑的数据 在数据库里有 同级部门下我的名字不能和其他的名字进行重复
        // 首先要找到我的同级部门 this.formData.id就是当前id 我的pid是this.formData.pid 排除自己之后进行判断
        isRepeat = depts.filter(item => item.pid === this.formData.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 没有id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果返回true 重复
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }
    // 检查code在全部门否重复
    const checkCodeRepeat = async(rule, value, callback) => {
      let isReapt = false
      const { depts } = await getDepartments()
      // 要求编码 和所有部门编码都不能重复 由于历史数据有可能没有code，所以加一个强制性条件 value不能为空
      if (this.formData.id) {
      // 不能有一样的code
        isReapt = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        isReapt = depts.some(item => item.code === value && value)
      }
      isReapt ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 校验规则
      rules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '部门名称字符长度为1-50',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkNameRepeat // 自定义函数的形式校验
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '部门编码字符长度为1-50',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager:
            [
              {
                required: true,
                message: '部门负责人不能为空',
                trigger: 'blur'
              },
              {
                min: 1,
                max: 50,
                message: '部门负责人字符长度为1-50',
                trigger: 'blur'
              }
            ],
        introduce:
            [
              {
                required: true,
                message: '部门介绍不能为空',
                trigger: 'blur'
              },
              {
                min: 1,
                max: 300,
                message: '部门字符长度为1-300',
                trigger: 'blur'
              }
            ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      // 调用接口
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id) // 不可以直接拿接口，props是异步的
    },
    btnOK() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOK => {
        // 说明表单校验通过
        if (isOK) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            await addDepartments({
              ...this.formData,
              pid: this.treeNode.id
            })
          }

          // 告诉父组件更新数据
          this.$emit('addDepts') // 触发一个自定义事件
          // 改变showDialog值
          this.$emit('update:showDialog', false)
          // 关闭dialog的时候会触发 el-dialog的close事件 这里不需要单独的重置数据
        }
      })
    },
    btnCancel() {
      // 重置数据 因为resetFilelds 只能重置表单上的数据，非表单上的数据比如编辑中的id不能重置
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验 可以重置数据 只能重置定义在data中的数据
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style>

</style>
