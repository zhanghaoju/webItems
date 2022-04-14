import request from '@/utils/request';
import {
  AppealDetail,
  AppealQuery,
} from '@/pages/SalesAppeal/AppealCenter/data';
import storage from '@/utils/storage';

/**
 * 申诉列表
 * @param query
 */
export async function fetch(query: AppealQuery) {
  return request({
    method: 'POST',
    url: '/sales-complain/list',
    data: query,
  });
}

export async function feedback(data: AppealDetail) {
  return request({
    method: 'PUT',
    url: '/sales-complain/feedback',
    data,
  });
}
