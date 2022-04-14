import request from '@/utils/request';

//load
export const getWorkBenchList = (params?: any) => {
  return request({
    method: 'get',
    url: '/workbench/load',
    params,
  });
};

//默认账期值
export const getPeriodWindow = (params?: any, url?: any) => {
  return request({
    method: 'get',
    url: '/period/getDefaultPeriodAndPocket',
    data: params,
  });
};
