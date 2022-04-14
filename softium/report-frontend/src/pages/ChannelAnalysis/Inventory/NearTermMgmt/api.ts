import request from '@/utils/request';
import {
  NearTermMgmt,
  NearTermMgmtQuery,
} from '@/pages/ChannelAnalysis/Inventory/NearTermMgmt/data';

/**
 * 购销倒挂分析
 * @param query
 */
export async function fetch(query: NearTermMgmtQuery) {
  return await request({
    url: '/InventoryExpirationEnquiry/query',
    method: 'POST',
    data: query,
  });
}

/**
 * 导出
 * @param data
 */
export async function exp(data?: NearTermMgmt) {
  return request({
    method: 'POST',
    url: '/InventoryExpirationEnquiry/export',
    data,
    responseType: 'blob',
  });
}
