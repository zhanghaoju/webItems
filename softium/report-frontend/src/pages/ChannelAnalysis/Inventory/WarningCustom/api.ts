import request from '@/utils/request';
import {
  InventoryWarningQuery,
  InventoryWarningDetailQuery,
} from '@/pages/ChannelAnalysis/Inventory/WarningCustom/data';
import { APPID } from '@/constant';
/**
 * 导出
 * @param data
 */
export async function exp(data?: InventoryWarningQuery) {
  return request({
    method: 'POST',
    url: '/inventroyWarning/export',
    data,
    responseType: 'blob',
  });
}
/**
 * 库存预警报表
 * @param query
 */
export async function fetch(query: InventoryWarningQuery) {
  const res = await request({
    url: '/inventroyWarning/list',
    method: 'POST',
    data: query,
  });
  return {
    data: res?.data?.list,
    total: res?.data?.total,
  };
}

/**
 * 获取财年时间窗树
 */
export async function getFinancialPeriodsTree() {
  return request({
    url: '/inventroyWarning/getFinancialPeriodsTree',
    method: 'GET',
  });
}

export async function getWarinDetail(params: InventoryWarningDetailQuery) {
  return request({
    url: '/inventroyWarning/inventroyQueryByBatch',
    method: 'POST',
    data: params,
  });
}

/**
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
