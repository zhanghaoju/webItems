import request from '@/utils/request';
import { ImportReportQuery } from './data';

/**
 * 回款导入列表
 * @param query
 */
export async function fetch(query: ImportReportQuery) {
  return request({
    method: 'POST',
    data: query,
    url: '/backToArticle/original-query',
  });
}

/**
 * 下载模板
 */
export async function downTemplate() {
  return request({
    method: 'GET',
    responseType: 'blob',
    url: '/backToArticle/download-template',
  });
}
