import request from '@/utils/request';

/**
 * 医生列表
 * @param params
 */
export const getList = (params?: any) => {
  return request({
    method: 'post',
    url: '/doctor/list',
    data: params,
  });
};
/**
 * 医生详情
 * @param params
 */
export const getDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/doctor/detail',
    params,
  });
};
