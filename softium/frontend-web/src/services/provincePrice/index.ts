import request from '@/utils/request';

/**
 *
 * 列表
 */
export const getPriceList = (params?: any) => {
  return request({
    method: 'post',
    url: '/provincePrice/search',
    data: params,
  });
};

/**
 *
 * 详情
 */
export const getDetail = (params?: any) => {
  return request({
    method: 'get',
    url: '/provincePrice/detail',
    params,
  });
};
/**
 *
 * 删除
 */
export const deletePrice = (params?: any) => {
  return request({
    method: 'post',
    url: '/provincePrice/delete',
    data: params,
  });
};
/**
 *
 * 批量删除
 */
export const batchDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/provincePrice/batchDelete',
    data: params,
  });
};

/**
 *
 * @returns 导出
 */
export const getExport = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/provincePrice/export',
    data: params,
  });
};

/**
 * 模板下载
 */
export const downloadTemplate = () => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/provincePrice/template',
  });
};

/**
 * 单条添加
 * @param params
 */
export const addPrice = (params: any) =>
  request({
    method: 'post',
    url: '/provincePrice/add',
    data: params,
  });
