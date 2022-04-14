import request from '@/utils/request';

/**
 * 获取协议列表
 * @param params
 */
export const getContractList = (params: any) =>
  request({
    method: 'post',
    url: '/distributor/contract/list',
    data: params,
  });

/**
 * 新增协议
 * @param params
 */
export const addContract = (params: any) =>
  request({
    method: 'post',
    url: '/distributor/contract/add',
    data: params,
  });

/**
 * 删除协议
 * @param params
 */
export const deleteContract = (params: any) =>
  request({
    method: 'get',
    url: '/distributor/contract/delete',
    params,
  });

/**
 * 根据id获取协议详情
 * @param params
 */
export const getDetailById = (params: any) =>
  request({
    method: 'get',
    url: '/distributor/contract/detail',
    params,
  });

/**
 * 编辑协议
 * @param params
 */
export const editContractApi = (params: any) =>
  request({
    method: 'post',
    url: '/distributor/contract/edit',
    data: params,
  });

/**
 * 获取协议明细列表
 * @param params
 */
export const getContractDetailList = (params: any) =>
  request({
    method: 'POST',
    url: '/distributor/contract/info/list',
    data: params,
  });

/**
 * 添加协议明细
 * @param params
 */
export const addContractDetail = (params: any) =>
  request({
    method: 'POST',
    url: '/distributor/contract/info/add',
    data: params,
  });

/**
 * 编辑协议明细
 * @param params
 */
export const editContractDetail = (params: any) =>
  request({
    method: 'POST',
    url: '/distributor/contract/info/edit',
    data: params,
  });

/**
 * 删除协议明细
 * @param params
 */
export const deleteContractDetail = (params: any) =>
  request({
    method: 'get',
    url: '/distributor/contract/info/delete',
    params,
  });
