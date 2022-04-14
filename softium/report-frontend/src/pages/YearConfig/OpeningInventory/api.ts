import request from '@/utils/request';
import { OpeningInventoryQuery } from './data';

/**
 * 理论期初库存列表
 * @param query
 */
export async function fetch(query: OpeningInventoryQuery) {
  return request({
    method: 'POST',
    data: query,
    url: '/beginInventroy/list',
    // baseURL: process.env.REPORT_URL,
  });
}

/**
 * 导出
 * @param data
 */
export async function exportFile(data: OpeningInventoryQuery) {
  return request({
    method: 'POST',
    responseType: 'blob',
    data,
    url: '/beginInventroy/export',
    // baseURL: process.env.REPORT_URL,
  });
}

/**
 * 下载模板
 */
export async function downloadTemplate() {
  return request({
    method: 'GET',
    responseType: 'blob',
    url: '/beginInventroy/download-template',
    // baseURL: process.env.REPORT_URL,
  });
}
/**
 * 获取所有时间窗
 */
export async function fetchAll() {
  console.log('+++++++++++++++获取所有时间窗+++++++++++++++++++');
  return request({
    url: '/period/listAll',
    method: 'GET',
    baseURL: process.env.CONFIG_CENTER_URL,
  });
}
