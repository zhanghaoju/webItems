import { TheoreticalInventory } from '@/pages/dataManagement/inventory/inventoryAnalysis/data';
import request from '@/utils/request';

//列表
export async function getInventoryAnalysisList(
  query: TheoreticalInventory & Sort,
) {
  return request({
    method: 'POST',
    data: query,
    url: '/saleBalance/search',
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
}

//导出
export async function exportFile(query: TheoreticalInventory) {
  return request({
    method: 'POST',
    responseType: 'blob',
    data: query,
    url: '/saleBalance/export',
  });
}
