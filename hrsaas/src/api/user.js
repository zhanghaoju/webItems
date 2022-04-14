import request from '@/utils/request'

/**
 * @param data
 * @returns {*}
 * 登录接口的封装
 */
export function login(data) {
  // 通过return的方式返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 获取用户资料的接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 获取用户的基本信息 根据用户id 目的：显示头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {
}

