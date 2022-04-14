import request from '@/utils/request';

export async function getOptions() {
  return request({
    method: 'GET',
    url: '/options/sales-complain',
  });
}

export async function getCurrentPeriod(type: 0 | 1) {
  return request({
    method: 'GET',
    url: '/options/current-period',
    params: {
      complaintsPeriodType: type,
    },
  });
}
