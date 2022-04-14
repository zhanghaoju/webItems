import request from '@/utils/request';

export async function getOptions() {
  return request({
    method: 'GET',
    url: '/options/sales-complain',
  });
}

export async function getCurrentQuery() {
  return request({
    method: 'GET',
    url: '/backToArticle/query-condition',
  });
}
