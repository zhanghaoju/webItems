import request from '@/utils/request';
import { AllocationQuery } from './data';

/**
 * 调拨导入-列表
 * @param query
 */
export async function fetch(query: AllocationQuery) {
  return request({
    method: 'POST',
    data: query,
    url: '/allocation/list',
  });
}

/**
 * 下载模板
 */
export async function downTemplate() {
  return request({
    method: 'GET',
    responseType: 'blob',
    url: '/allocation/download-template',
  });
}

/**
 * 导出-列表
 * @param query
 */
export async function exportList(query: AllocationQuery) {
  return request({
    method: 'POST',
    responseType: 'blob',
    url: '/allocation/export',
    data: query,
  });
}
