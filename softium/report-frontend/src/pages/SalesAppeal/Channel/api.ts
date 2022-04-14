import request from '@/utils/request';
import { AppealDetail } from '@/pages/SalesAppeal/AppealCenter/data';
import {
  ChannelQuery,
  ChannelSalesQuery,
} from '@/pages/SalesAppeal/Channel/data';
import { SalesDetailQuery } from '@/pages/SalesAppeal/data';

export async function batchAdd(data: AppealDetail[]) {
  return request({
    method: 'POST',
    url: '/channel-sales/batch-add',
    data,
  });
}

/**
 * 列表搜索
 * @param data
 */
export async function fetch(data: ChannelQuery) {
  return request({
    method: 'POST',
    url: '/channel-sales/sales-query',
    data,
  });
}

/**
 * 导出
 * @param data
 */
export async function exp(data?: ChannelQuery) {
  return request({
    method: 'POST',
    url: '/channel-sales/export',
    data,
    responseType: 'blob',
  });
}

/**
 * [getSalesDetail 查看详情]
 * @param  query [id pagesize current]
 * @return       [description]
 */
export async function getSalesDetail(query: SalesDetailQuery) {
  return request({
    method: 'POST',
    data: query,
    url: `/channel-sales/sales-detail`,
  });
}

/**
 * 添加申诉时中的 流向数量总计 查看明细
 * @param data
 */
export async function getSalesDetailQuery(data: ChannelSalesQuery) {
  return request({
    method: 'POST',
    url: '/channel-sales/sale-detail-complaints',
    data,
  });
}

export async function saleItem(query: ChannelSalesQuery) {
  return request({
    method: 'POST',
    url: '/channel-sales/sales-item',
    data: query,
  });
}
