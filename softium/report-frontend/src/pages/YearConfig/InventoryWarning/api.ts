import request from '@/utils/request';
import {
  InventoryWarningConfig,
  InventoryWarningConfigQuery,
} from '@/pages/YearConfig/InventoryWarning/data';

/**
 * 月度库存预警阈值列表查询
 * @param query
 */
export async function fetch(query: InventoryWarningConfigQuery) {
  const res = await request({
    method: 'POST',
    url: '/inventoryWarningConfig/list',
    // baseURL: process.env.REPORT_URL,
    data: query,
  });
  return {
    data: res?.data?.list,
    total: res?.data?.total,
  };
}

/**
 * 月度库存预警阈值更新
 * @param data
 */
export async function update(data: InventoryWarningConfig) {
  return request({
    method: 'POST',
    url: '/inventoryWarningConfig/update',
    // baseURL: process.env.REPORT_URL,
    data,
  });
}

/**
 * 月度库存预警阈值下载导入模版
 * @param
 */
export async function downloadTemplate() {
  return request({
    method: 'GET',
    url: '/inventoryWarningConfig/download-template',
    // baseURL: process.env.REPORT_URL,
    responseType: 'blob',
  });
}

/**
 * 月度库存预警阈值导出
 * @param query
 */
export async function exportExcel(query: InventoryWarningConfigQuery) {
  return request({
    method: 'POST',
    url: '/inventoryWarningConfig/export',
    // baseURL: process.env.REPORT_URL,
    data: query,
    responseType: 'blob',
  });
}
