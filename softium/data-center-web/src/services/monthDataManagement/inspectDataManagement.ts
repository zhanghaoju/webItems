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

//月数据管理--核查数据管理--销售核查数据--load
export const getSaleInspectList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/search',
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

//月数据管理--核查数据管理--销售核查数据--查看详情
export const getSaleInspectDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/sale/detail',
    params,
  });
};

//月数据管理--核查数据管理--销售核查数据--清洗详情
export const getCleanDetailList = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/sale/getCleaningStatus',
    params,
  });
};

//月数据管理--核查数据管理--销售核查数据--撤销匹配
export const getCancelMatchQuery = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/cancelMatch',
    params,
  });
};

//月数据管理--核查数据管理--销售核查数据-导出
export const getInspectDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
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

//月数据管理--核查数据管理--采购核查数据--load
export const getPurchaseInspectList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/purchase/search',
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

//月数据管理--核查数据管理--采购核查数据--查看详情
export const getPurchaseInspectDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/purchase/detail',
    params,
  });
};

//月数据管理--核查数据管理--采购核查数据--清洗详情
export const getPurchaseCleanDetailList = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/purchase/getCleaningLoad',
    params,
  });
};

//月数据管理--核查数据管理--采购核查数据--导出
export const getPurchaseInspectDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/purchase/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//月数据管理--核查数据管理--库存核查数据--导出
export const getInventoryInspectDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/inventory/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//月数据管理--核查数据管理--库存核查数据--load
export const getInventoryInspectList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/inventory/search',
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

//月数据管理--核查数据管理--库存核查数据--查看详情
export const getInventoryInspectDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/inventory/detail',
    params,
  });
};

//月数据管理--核查数据管理--库存核查数据--清洗详情
export const getInventoryCleanDetailList = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/inventory/getCleaningLoad',
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

//库存补采
export const getInventorySupplementList = (params?: any) => {
  return request({
    method: 'post',
    url: '/fileParseLog/getLevelList',
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

//库存补采明细
export const getInventorySupplementDetailList = (params?: any) => {
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

//确认补采
export const getSupplementQuery = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectInventoryDay/supplementConnection',
    data: { ...params },
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

//省份-查询接字典
export const getDictionary = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getDictionary',
    data: params,
  });
};
