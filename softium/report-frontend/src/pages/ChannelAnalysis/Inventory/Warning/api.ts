import request from '@/utils/request';
import { InventoryWarningQuery } from '@/pages/ChannelAnalysis/Inventory/Warning/data';

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
