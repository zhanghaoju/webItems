import request from '@/utils/request';

/**
 * 获取批号列表
 * @param params
 */
export const getProductBatchNoList = (params: any) =>
  request({
    method: 'post',
    url: '/product/batchNo/list',
    data: params,
  });

/**
 * 新增批号
 * @param params
 */
export const addProductBatchNo = (params: any) =>
  request({
    method: 'post',
    url: '/product/batchNo/add',
    data: params,
  });

/**
 * 编辑批号
 * @param params
 */
export const editProductBatchNo = (params: any) =>
  request({
    method: 'post',
    url: '/product/batchNo/edit',
    data: params,
  });

/**
 * 删除批号
 * @param params
 */
export const deleteProductBatchNo = (params: any) =>
  request({
    method: 'get',
    url: '/product/batchNo/delete',
    params,
  });

/**
 * 批量删除
 * @param params
 */
export const batchDeleteProductBatchNo = (params: any) =>
  request({
    method: 'post',
    url: '/product/batchNo/batch/delete',
    data: params,
  });

/**
 * 产品批号导出
 */
export const exportProductBatchNo = () => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/product/batchNo/export',
  });
};

/**
 * 产品批号模板下载
 */
export const downloadBatchNoTemplate = () => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/product/batchNo/template',
  });
};
