import request from '@/utils/request';

export async function getReportUrl(tablePath: string) {
  return request({
    url: '/tableau/get-trusted-url',
    method: 'GET',
    params: {
      tablePath,
    },
    baseURL: process.env.TABLEAU_SERVER,
  });
}
