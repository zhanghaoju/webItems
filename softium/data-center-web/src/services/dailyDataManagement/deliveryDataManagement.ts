import request from '@/utils/request';

//日数据管理--交付数据管理--销售、发货交付数据--load
export const getDailySaleDeliveryList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectSaleDay/formatSaleDay/search',
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

//日数据管理--交付数据管理--销售发货交付--详情
export const getDailySaleDeliveryDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectSaleDay/detail',
    params,
  });
};

//日数据管理--交付数据管理--销售、发货交付--导出
export const getDeliveryDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectSaleDay/formatSaleDay/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//日数据管理--交付数据管理--销售交付--数据封板
export const getDataSeal = (params?: any) => {
  return request({
    method: 'get',
    url: '/period/dataSeal',
    params,
  });
};

//日数据管理--交付数据管理--机构挂靠计算
export const getInstitutionRelyQuery = (params?: any) => {
  return request({
    method: 'get',
    url: '/institutionAttach/compute',
    params,
  });
};

//日数据管理--交付数据管理--采购交付数据--load
export const getDailyPurchaseDeliveryList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectPurchaseDay/formatPurchaseDay/search',
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

//日数据管理--交付数据管理--采购交付--导出
export const getPurchaseDeliveryDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectPurchaseDay/formatPurchaseDay/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//日数据管理--交付数据管理--采购交付--详情
export const getPurchaseDeliveryDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectPurchaseDay/detail',
    params,
  });
};

//日数据管理--交付数据管理--库存交付数据--load
export const getDailyInventoryDeliveryList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectInventoryDay/formatInventory/search',
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

//日数据管理--交付数据管理--库存交付数据--导出
export const getInventoryDeliveryDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectInventoryDay/formatInventory/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//日数据管理--交付数据管理--库存交付数据--详情
export const getInventoryDeliveryDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectInventoryDay/detail',
    params,
  });
};
