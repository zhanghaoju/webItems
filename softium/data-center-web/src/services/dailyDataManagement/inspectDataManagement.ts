import request from '@/utils/request';

//账期默认值
export const getUntreatedPeriod = (params?: any) => {
  return request({
    method: 'post',
    url: '/period/getUntreatedPeriod',
    data: {
      ...params,
    },
  });
};

//日数据管理--核查数据管理--销售、发货核查数据--load
export const getDailySaleInspectList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectSaleDay/search',
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

//日数据管理--核查数据管理--销售核查数据--查看详情
export const getDailySaleInspectDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectSaleDay/detail',
    params,
  });
};

//日数据管理--核查数据管理--销售核查数据--清洗详情
export const getDailyCleanDetailList = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectSaleDay/getCleaningDetail',
    params,
  });
};

//日数据管理--核查数据管理--销售核查数据--撤销匹配
export const getCancelMatchQuery = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/cancelMatch',
    params,
  });
};

//日数据管理--核查数据管理--销售、发货核查数据-导出
export const getInspectDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectSaleDay/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//日数据管理--核查数据管理--采购核查数据--load
export const getPurchaseInspectList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectPurchaseDay/search',
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

//日数据管理--核查数据管理--采购核查数据--查看详情
export const getPurchaseInspectDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectPurchaseDay/detail',
    params,
  });
};

//日数据管理--核查数据管理--采购核查数据--清洗详情
export const getPurchaseCleanDetailList = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectPurchaseDay/getCleaningDetail',
    params,
  });
};

//日数据管理--核查数据管理--采购核查数据--导出
export const getPurchaseInspectDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectPurchaseDay/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//日数据管理--核查数据管理--库存核查数据--导出
export const getInventoryInspectDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectInventoryDay/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//日数据管理--核查数据管理--库存核查数据--load
export const getInventoryInspectList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectInventoryDay/search',
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

//日数据管理--核查数据管理--库存核查数据--查看详情
export const getInventoryInspectDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectInventoryDay/detail',
    params,
  });
};

//月数据管理--核查数据管理--库存核查数据--清洗详情
export const getInventoryCleanDetailList = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectInventoryDay/getCleaningDetail',
    params,
  });
};

//核查数据管理--全部数据清洗
export const getDataCleanQuery = (params?: any) => {
  return request({
    method: 'post',
    url: '/remedial/rinse',
    params,
  });
};

//全部数据清洗按钮状态
export const getCleanBtnStatusQuery = (params?: any) => {
  return request({
    method: 'post',
    url: '/dataConfig/cleanButton',
    data: {
      ...params,
    },
  });
};
