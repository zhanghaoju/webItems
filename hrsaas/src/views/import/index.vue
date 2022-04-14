<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  methods: {
    // 定义一个方法 绑定onsuccess
    async success({ header, results }) {
      // header中的数据是中文 result中的数据也是中文
      // 新增员工数据属性是一致的
      /* this.formData = {
        username: '', 姓名
        mobile: '', 手机号
        formOfEmployment: '',
        workNumber: '', 工号
        departmentName: '',
        timeOfEntry: '', 入职日期
        correctionTime: '' 转正日期
      }*/
      /* debugger*/
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      /* const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })*/
      var newArr = results.map(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 后端接口限制了不能是字符串 要求转换为时间类型
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样才能入库
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })
      console.log(newArr)
      await importEmployee(newArr) // 接收一个数组
      this.$message.success('导入数据成功')
      this.$router.back() // 回到上一个页面
    },
    // 转化Excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped>

</style>
