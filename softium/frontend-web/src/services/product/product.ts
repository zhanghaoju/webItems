import request from '@/utils/request';

/**
 * 产品列表
 * @param params
 */

export const getList = (params?: any) => {
  return request({
    method: 'post',
    url: '/product/list',
    data: params,
  });
};

/**
 * 二级产品列表
 * @param params
 */

export const getListDetail = (params?: any) => {
  return (
    params?.expanded &&
    request({
      method: 'get',
      url: '/product/listDetail',
      params,
    })
  );
};

/**
 * 产品详情
 * @param params
 */

export const getDetail = (params?: any) => {
  return request({
    method: 'get',
    url: '/product/detail',
    params,
  });
};

/**
 * 产品别名
 * @param params
 */

export const getAlias = (params?: any) => {
  return request({
    method: 'get',
    url: '/product/alias',
    data: params,
  });
};

/**
 * 产品别名添加
 * @param params
 */
export const addAlias = (params?: any) => {
  return request({
    method: 'post',
    url: '/product/addAlias',
    data: params,
  });
};

/**
 * 产品编辑
 * @param params
 */
export const insertEdit = (params?: any) => {
  return request({
    method: 'post',
    url: '/product/edit',
    data: params,
  });
};

/**
 * 产品添加
 * @param params
 */
export const getParentNames = (params?: any) => {
  console.log(params);
  return request({
    method: 'get',
    url: 'product/fuzzyQuery',
    params,
  });
};

/**
 * 产品导出
 * @param params
 */
export const getExport = () => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/product/export',
  });
};

/**
 * 产品状态修改
 * @param params
 */
export const updateStatus = (params?: any) => {
  return request({
    method: 'post',
    url: 'product/switchStatus',
    data: params,
  });
};

/**
 * 获取产品树
 */
export const getTree = () => {
  return request({
    method: 'get',
    url: 'product/tree',
  });
};

/**
 * 获取sku
 */
export const getSkuLevel = () =>
  request({
    method: 'get',
    url: '/productLevel/getSkuLevel',
  });

/**
 * 产品模板下载
 */
export const downloadTemplate = () => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/product/template',
  });
};

/**
 * 删除产品
 */
export const deleteProduct = (params: any) => {
  return request({
    method: 'get',
    url: '/product/delete',
    params,
  });
};
