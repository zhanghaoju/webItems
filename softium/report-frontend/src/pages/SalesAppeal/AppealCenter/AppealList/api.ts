import request from '@/utils/request';
import {
  AppealDetail,
  AppealQuery,
} from '@/pages/SalesAppeal/AppealCenter/data';

/**
 * 申诉列表
 * @param query
 */
export async function fetch(query: AppealQuery) {
  return request({
    method: 'POST',
    url: '/sales-complain/person/list',
    data: query,
  });
}
