import request from '@/utils/request';
import { PurchaseSaleAnalysis } from '@/pages/TerminalAnalysis/Sales/PurchaseSaleAnalysis/data';
import { ChannelQuery } from '@/pages/SalesAppeal/Channel/data';

/**
 * 购销倒挂分析
 * @param query
 */
export async function fetch(query: PurchaseSaleAnalysis) {
  return await request({
    url: 'UnusualWarning/list',
    method: 'POST',
    data: query,
  });
}

/**
 * 导出
 * @param data
 */
export async function exp(data?: PurchaseSaleAnalysis) {
  return request({
    method: 'POST',
    url: '/UnusualWarning/export',
    data,
    responseType: 'blob',
  });
}
