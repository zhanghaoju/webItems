import request from '@/utils/request';
import {
  DictionaryQuery,
  TerminalListQuery,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/data';

export async function getOptions() {
  return request({
    method: 'GET',
    url: '/options/sales-complain',
  });
}

/**
 * 通过字典code获取字典
 * @param codes
 */
export async function getDictionaries(codes: any[]) {
  return request({
    method: 'POST',
    url: '/dictionary/listByDictionary',
    data: codes,
    baseURL: process.env.CONFIG_CENTER_URL,
  });
}
/**
 * 下游|上游销量底表查询
 * @param query
 */
export async function queryList(query: TerminalListQuery) {
  return request({
    method: 'POST',
    url: '/inspect-sales/sales-query',
    data: query,
  });
}

/**
 * 根据模板下载销量底表数据
 * @param query
 */

export async function downloadData(query: TerminalListQuery) {
  return request({
    method: 'POST',
    // responseType: 'blob',
    url: '/new-template/download-data',
    data: query,
  });
}
