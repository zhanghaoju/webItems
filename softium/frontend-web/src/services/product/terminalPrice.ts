import request from '@/utils/request';

/**
 * 终端价格列表
 * @param params
 */

export const getList = (params?: any) => {
  return request({
    method: 'post',
    url: '/terminal/price/list',
    data: params,
  });
};

/**
 * 终端价格详情
 * @param params
 */

export const getDetail = (params: any) => {
  return request({
    method: 'post',
    url: `/terminal/price/detail`,
    data: params,
  });
};

/**
 * 产品价格编辑
 * @param params
 */
export const edit = (params?: any) => {
  return request({
    method: 'post',
    url: '/terminal/price/edit/one',
    data: params,
  });
};

/**
 * 产品价格导出
 * @param params
 */
export const getExport = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/terminal/price/export',
    data: params,
  });
};

/**
 * 产品价格模板下载
 */
export const downloadTemplate = () => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/terminal/price/template',
  });
};

/**
 * 删除产品价格
 * @param params
 */
export const deleteTerminal = (params: any[]) => {
  return request({
    method: 'post',
    url: `/terminal/price/delete`,
    data: params,
  });
};

/**
 * 单条添加
 * @param params
 */
export const addTerminalPrice = (params: any) =>
  request({
    method: 'post',
    url: '/terminal/price/add',
    data: params,
  });
