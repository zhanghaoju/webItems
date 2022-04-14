import request from '@/utils/request';

/**
 * 获取机构备案列表
 * @param params
 */
export const getInstitutionRecordList = (params: any) =>
  request.post('/institution/record/list', params);

/**
 * 新增机构备案
 * @param params
 */
export const addInstitutionRecord = (params: any) =>
  request.post('/institution/record/add', params);

/**
 * 删除机构备案
 * @param params
 */
export const deleteInstitutionRecord = (params: any) =>
  request({
    url: '/institution/record/delete',
    method: 'GET',
    params,
  });

/**
 * 编辑机构备案
 * @param params
 */
export const editInstitutionRecord = (params: any) =>
  request.post('/institution/record/edit', params);

/**
 * 批量删除
 * @param params
 */
export const batchDeleteRecord = (params: any) =>
  request.post('/institution/record/batchDelete', params);

/**
 * 下载模板
 */
export const recordTemplate = () =>
  request({
    method: 'GET',
    responseType: 'blob',
    url: '/institution/record/template',
  });

/**
 * 导出机构备案
 * @param params
 */
export const exportRecord = (params: any) =>
  request({
    method: 'POST',
    responseType: 'blob',
    url: '/institution/record/export',
    data: params,
  });
