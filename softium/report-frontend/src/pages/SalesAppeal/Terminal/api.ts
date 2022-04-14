import request from '@/utils/request';
import { AppealDetail } from '@/pages/SalesAppeal/AppealCenter/data';
import {
  TerminalQuery,
  TerminalSalesQuery,
  TerminalSalesDetailQuery,
} from '@/pages/SalesAppeal/Terminal/data';
import { SalesDetailQuery } from '@/pages/SalesAppeal/data';
import { ChannelQuery } from '@/pages/SalesAppeal/Channel/data';

/**
 * 批量添加申诉
 * @param data
 */
export async function batchAdd(data: AppealDetail[]) {
  return request({
    method: 'POST',
    url: '/terminal-sales/batch-add',
    data,
  });
}

/**
 * 列表查询
 * @param data
 */
export async function fetch(data: TerminalQuery) {
  return request({
    method: 'POST',
    url: '/terminal-sales/sales-query',
    data,
  });
}

/**
 * 导出
 * @param data
 */
export async function exp(data?: TerminalQuery) {
  return request({
    method: 'POST',
    url: '/terminal-sales/export',
    data,
    responseType: 'blob',
  });
}

/**
 * 销量详情
 * @param id
 */
export async function getSalesDetail(query: TerminalSalesDetailQuery) {
  return request({
    method: 'POST',
    data: query,
    url: `/terminal-sales/sales-detail`,
  });
}

/**
 * 添加申诉时 获取 流向数量总计 和 查看明细
 * @param data
 */
export async function getSalesDetailQuery(data: TerminalSalesQuery) {
  return request({
    method: 'POST',
    url: '/terminal-sales/sale-detail-complaints',
    data,
  });
}

/**
 * 机构产品销量详情  查看明细
 * @param data
 */
export async function saleItem(data: TerminalSalesQuery) {
  return request({
    method: 'POST',
    url: '/terminal-sales/sales-item',
    data,
  });
}
