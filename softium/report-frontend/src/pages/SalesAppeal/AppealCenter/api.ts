import request from '@/utils/request';

export async function detail(id: string) {
  return request({
    url: `/sales-complain/detail/${id}`,
    method: 'GET',
  });
}
