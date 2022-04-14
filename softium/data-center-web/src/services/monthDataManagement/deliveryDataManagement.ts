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

//月数据管理--交付数据管理--销售交付数据--load
export const getSaleDeliveryList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/formatSale/search',
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

//月数据管理--交付数据管理--销售交付--详情
export const getSaleDeliveryDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/sale/detail',
    params,
  });
};

//月数据管理--交付数据管理--销售交付--导出
export const getDeliveryDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/formatSale/export ',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//月数据管理--交付数据管理--销售交付--数据封板前判断清洗状态
export const getCleanStatus = (params?: any) => {
  return request({
    method: 'get',
    url: '/period/isSeal',
    params,
  });
};

//月数据管理--交付数据管理--销售交付--数据封板
export const getDataSeal = (params?: any) => {
  return request({
    method: 'get',
    url: '/period/dataSeal',
    params,
  });
};

//月数据管理--交付数据管理--机构挂靠计算
export const getInstitutionRelyQuery = (params?: any) => {
  return request({
    method: 'get',
    url: '/institutionAttach/compute',
    params,
  });
};

//月数据管理--交付数据管理--调拨计算
export const getSaleTypeComputeQuery = (params?: any) => {
  return request({
    method: 'get',
    url: '/dataHandle/typeHandle',
    params,
  });
};

//月数据管理--交付数据管理--机构级别计算
export const getInsTypeComputeQuery = (params?: any) => {
  return request({
    method: 'get',
    url: '/institution/syncDistributorLevel',
    params,
  });
};

//月数据管理--交付数据管理--采购交付数据--load
export const getPurchaseDeliveryList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/formatPurchase/search',
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

//月数据管理--交付数据管理--采购交付--导出
export const getPurchaseDeliveryDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/formatPurchase/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//月数据管理--交付数据管理--采购交付--详情
export const getPurchaseDeliveryDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/purchase/detail',
    params,
  });
};

//月数据管理--交付数据管理--库存交付数据--load
export const getInventoryDeliveryList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/formatInventory/search',
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

//月数据管理--交付数据管理--库存交付数据--导出
export const getInventoryDeliveryDataExportRequest = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/formatInventory/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//月数据管理--交付数据管理--库存交付数据--详情
export const getInventoryDeliveryDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/inspectData/inventory/detail',
    params,
  });
};
