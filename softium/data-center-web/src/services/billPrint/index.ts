import request from '@/utils/request';

//打单名单pocket
export const getInitPocketQuery = () => {
  return request({
    method: 'get',
    url: '/projectManagement/initResource',
    baseURL: process.env.DATACENTER_URL,
  });
};

//打单名单列表load
export const getBillPrintList = (params: any) => {
  return request({
    url: '/billPrint/search',
    method: 'post',
    data: {
      ...params,
    },
    baseURL: process.env.DATACENTER_URL,
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//打单名单查看
export const getBillPrintDetailQuery = (params?: any) => {
  return request({
    method: 'get',
    url: '/billPrint/detail',
    params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//打单/不打单
export const handlePrintBill = (params?: any) => {
  return request({
    method: 'post',
    url: '/billPrint/saveOrUpdate',
    data: {
      ...params,
    },
    baseURL: process.env.DATACENTER_URL,
  });
};

//获取经销商
export const getInstitutionPocket = (params?: any) => {
  return request({
    method: 'post',
    url: '/institution/list',
    data: {
      ...params,
    },
    baseURL: process.env.DATACENTER_URL,
  });
};

//新增&&修改
export const handleModifyBillPrintQuery = (params?: any) => {
  return request({
    method: 'post',
    url: '/billPrint/saveOrUpdate',
    data: { ...params },
    baseURL: process.env.DATACENTER_URL,
  });
};

//获取账期--历史打单
export const getPeriodList = (params?: any) => {
  return request({
    method: 'post',
    url: '/period/list',
    data: {
      ...params,
    },
    baseURL: process.env.DATACENTER_URL,
  });
};

//账期--新增
export const getUntreatedPeriod = (params?: any) => {
  return request({
    method: 'post',
    url: '/period/getUntreatedPeriod',
    data: {
      ...params,
    },
    baseURL: process.env.DATACENTER_URL,
  });
};

//导出
export const getExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/billPrint/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
    baseURL: process.env.DATACENTER_URL,
  });
};

//下载模板
export const downLoadTemplateQuery = () => {
  return request({
    method: 'post',
    url: '/billPrint/template/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {},
    baseURL: process.env.DATACENTER_URL,
  });
};
