import request from '@/utils/request';

//待办处理--月数据处理--拦截处理-日期规则拦截-load
export const getDateRuleInterceptList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/pathSearch',
    data: {
      ...params, //如果用proTable中的request.js 直接发送请求，参数格式会被解析，因此这里需要这样写才可转化为对象格式
    },
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//待办处理--月数据处理--拦截处理-日期规则拦截-删除
export const monthlyDateRuleIntercepDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/batchDeleteSale',
    data: params,
  });
};

//待办处理--月数据处理--拦截处理-日期规则拦截-取消拦截
export const monthlyDateRuleIntercepCancel = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/batchCancelBlockingPeriod',
    data: params,
  });
};

//待办处理--月数据处理--拦截处理-日期规则拦截-全量取消拦截
export const monthlyDateRuleIntercepAllCancel = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/batchCancleAllDate',
    data: params,
  });
};

//待办处理--月数据处理--拦截处理-日期规则拦截-统计查询
export const monthlyDateRuleIntercepgetSaleCount = (params?: any) => {
  return request({
    method: 'get',
    url: '/inspectData/sale/getSaleCount',
    params,
  });
};

//待办处理--月数据处理--拦截处理-打单规则拦截-取消拦截
export const monthlyBillRuleIntercepCancel = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/batchCancelBlockingBill',
    data: params,
  });
};

//待办处理--月数据处理--拦截处理-打单规则拦截-全量取消拦截
export const monthlyBillRRuleIntercepAllCancel = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/batchCancelAllBill',
    data: params,
  });
};

//待办处理--月数据处理--拦截处理-打单规则拦截-导出
export const exportUnExistInstitution = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/exportUnExistInstitution',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//待办处理--月数据处理--拦截处理-打单规则拦截-导出拦截经销商
export const exportBillData = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/bill/exportBillData',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//全部数据清洗
export const getDataCleanQuery = (params?: any) => {
  return request({
    method: 'post',
    url: '/remedial/rinseByBusinessType',
    data: { ...params },
  });
};
