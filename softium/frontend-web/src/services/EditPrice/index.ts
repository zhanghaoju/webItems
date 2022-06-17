import request from '@/utils/request';

/**
 * 查询经销商发货价列表
 * @ params`
 */
export const getPriceList = (params: any) => {
  return request({
    method: 'get',
    url: '/distributor/delivery/list',
    params,
  });
};
/**
 * 修改经销商发货价
 * @ params`
 */
export const updatePrice = (params: any) => {
  return request({
    method: 'post',
    url: '/distributor/delivery/update',
    data: params,
  });
};
/**
 * 经销商发货价修改记录
 * @ params`
 */
export const getEditRecord = (params: any) => {
  return request({
    method: 'post',
    url: '/distributor/delivery/log/list',
    data: params,
  });
};
