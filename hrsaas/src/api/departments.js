// 导入request方法
import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 删除组织架构的部门
export function delDepartments(id) {
  return request({
    method: 'DELETE', // 接口满足restful接口规范 同样的地址不同的方法执行不同的业务
    url: `/company/department/${id}`
  })
}

// 新增部门
export function addDepartments(data) {
  return request({
    method: 'POST',
    url: '/company/department', // 遵循restful接口规范
    data // axios的body参数 data
  })
}

// 获取某一个部门详情
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 保存编辑的数据
export function updateDepartments(data) {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}

