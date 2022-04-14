import request from '@/utils/request';

/**
 * 获取DCR列表
 * @param params
 */
export const getNewApplyList = (params?: any) => {
  return request({
    method: 'post',
    url: '/dcr/institution/list',
    data: params,
  });
};

/**
 * 批量添加
 * @param params
 */
export const batchAddInstitutionDcr = (params: any) =>
  request.post('/dcr/institution/batchAdd', params);

/**
 * 一键添加全部机构
 */
export const addAll = () => request.post('/dcr/institution/batchAddAll');

/**
 * 获取全部待处理数量
 */
export const getAllCount = () => request.get('/dcr/institution/getAllCount');
