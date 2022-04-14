import request from '@/utils/request';

/**
 * 列表
 * @param query
 */
export async function list(query: DefectInsProd.Query) {
  const res = await request({
    method: 'POST',
    data: query,
    url: '/defectInstProd/list',
    // baseURL: process.env.REPORT_URL,
  });
  return {
    data: res?.data?.list,
    total: res?.data?.total,
  };
}

/**
 * 新增
 * @param data
 */
export async function add(data: DefectInsProd.ListItem) {
  return request({
    data,
    method: 'POST',
    url: '/defectInstProd/add',
    // baseURL: process.env.REPORT_URL,
  });
}

/**
 * 删除
 * @param data
 */
export async function del(data: DefectInsProd.ListItem) {
  return request({
    data,
    method: 'POST',
    url: '/defectInstProd/del',
    // baseURL: process.env.REPORT_URL,
  });
}

/**
 * 波动规则设置
 * @param data
 */
export async function waveConfig(data: DefectInsProd.DefectInstProdConfig) {
  return request({
    data,
    method: 'POST',
    url: '/defectInstProd/waveConfig',
    // baseURL: process.env.REPORT_URL,
  });
}

/**
 * 获取波动规则
 */
export async function getWaveConfig() {
  return request({
    method: 'GET',
    url: '/defectInstProd/getWaveConfig',
    // baseURL: process.env.REPORT_URL,
  });
}

/**
 * 下载模板
 */
export async function downloadTemplate() {
  return request({
    method: 'GET',
    url: 'defectInstProd/download-template',
    // baseURL: process.env.REPORT_URL,
    responseType: 'blob',
  });
}

/**
 * 批量删除
 * @param ids
 */
export async function batchDelete(ids: string[] = []) {
  return request({
    method: 'POST',
    url: 'defectInstProd/batch-del',
    // baseURL: process.env.REPORT_URL,
  });
}

/**
 * 缺品缺规名单导出
 * @param query
 */
export async function exportExcel(query: DefectInsProd.Query) {
  return request({
    method: 'POST',
    url: 'defectInstProd/export',
    // baseURL: process.env.REPORT_URL,
    data: query,
    responseType: 'blob',
  });
}
