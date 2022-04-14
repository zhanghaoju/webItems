import request from '@/utils/request';
import { ReportFormQuery } from '@/pages/PaymentCollection/ReportForm/data';
/**
 * 列表
 * @param query
 */
export async function list(query: ReportFormQuery) {
  const res = await request({
    method: 'POST',
    data: query,
    url: '/backToArticle/query',
  });
  return {
    data: res?.data?.list,
    total: res?.data?.total,
  };
}

/**
 * 汇款报表导出
 * @param query
 */
export async function exportExcel(query: ReportFormQuery) {
  return request({
    method: 'POST',
    url: '/backToArticle/export',
    data: query,
    responseType: 'blob',
  });
}
