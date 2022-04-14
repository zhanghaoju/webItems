import request from '@/utils/request';

//打单监控--列表
export const getBillMonitorList = (params?: any) => {
  return request({
    method: 'post',
    url: '/monitor/billPrint/list',
    data: {
      ...params,
    },
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

//文件统计概况
export const getDashboard = (params?: any, url?: any) => {
  return request({
    method: 'post',
    url: '/monitor/billPrint/dashboard',
    data: params,
  });
};

//文件到达详情
export const getFileArrivalDetailQuery = (params?: any, url?: any) => {
  return request({
    method: 'post',
    url: '/monitor/billPrint/detail',
    data: params,
  });
};

//打单监控--导出
export const getBillMonitorExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/monitor/billPrint/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};
