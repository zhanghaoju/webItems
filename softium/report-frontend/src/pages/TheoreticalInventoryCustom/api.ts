import {
  AdjustParams,
  LogListQuery,
  TheoreticalInventoryQuery,
} from '@/pages/TheoreticalInventoryCustom/data';
import request from '@/utils/request';
import { APPID } from '@/constant';

/**
 * 理论初期库存列表
 * @param query
 */
export async function fetch(query: TheoreticalInventoryQuery & Sort) {
  return request({
    method: 'POST',
    data: query,
    url: '/adjust/list',
  });
}

/**
 * 调整理论期初库存
 * @param data
 */
export async function adjust(data: AdjustParams) {
  return request({
    method: 'POST',
    url: '/adjust/updateTheoryInventory',
    data,
  });
}

/**
 * 调整日志
 * @param query
 */
export async function logList(query: LogListQuery) {
  return request({
    method: 'POST',
    data: query,
    url: '/adjust/logList',
  });
}

/**
 * 导出
 * @param query
 */
export async function exportFile(query: TheoreticalInventoryQuery) {
  return request({
    method: 'POST',
    responseType: 'blob',
    data: query,
    url: '/adjust/export',
  });
}

/**
 * 获取时间窗列表
 */
export async function periodList() {
  return request({
    method: 'GET',
    url: '/adjust/periodList',
  });
}

/**
 * 获取默认时间窗（下一个需要封版的时间窗）
 */
export async function getNextAchivePeriod() {
  return request({
    method: 'GET',
    url: '/adjust/getNextAchivePeriod',
  });
}

/**s
 * 获取动态表格
 */
export async function getDynamicTable(data: {
  tenantId: string;
  code: string;
}) {
  return request({
    method: 'GET',
    url:
      '/ext/load?appId=' +
      APPID +
      '&tableName=' +
      data.code +
      '&tenantId=' +
      data.tenantId,
    data: data,
  });
}
