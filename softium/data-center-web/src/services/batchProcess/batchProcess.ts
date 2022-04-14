import request from '@/utils/request';

//批号处理列表
export const getBatchProcessList = (params?: any) => {
  return request({
    method: 'post',
    url: '/productBatch/getProductBatchList',
    data: {
      ...params,
    },
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//导出
export const getProductBatchExportQuery = (params?: any) => {
  return request({
    method: 'post',
    url: '/productBatch/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//修改标准批号
export const modifyProductBatch = (params?: any) => {
  return request({
    method: 'post',
    url: '/productBatch/updateProductBatch',
    data: params,
  });
};

//批号处理列表
export const getBatchProcessPickList = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getProductBatchMdmList',
    data: {
      ...params,
    },
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//修改标准批号
export const getBatchEditBtnQuery = (params?: any) => {
  return request({
    method: 'post',
    url: '/productBatch/getEditStatus',
    data: params,
  });
};
