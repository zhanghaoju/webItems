import request from '@/utils/request';

//日数据管理--原始数据管理--销售、发货原始数据--load
export const getDailySaleOriginalList = (params?: any) => {
  return request({
    method: 'post',
    url: '/originSaleDay/search',
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

//日数据管理-原始数据管理--销售、发货原始数据--删除
export const dailyOriginalDataSaleDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originSaleDay/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

export const singleDailyOriginalDataSaleDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originSaleDay/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//日数据管理--原始数据管理--销售、发货原始数据--详情
export const getSaleOriginalDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/originSaleDay/detail',
    params,
  });
};

//日数据管理--原始数据管理--销售、发货原始数据--导出
export const getExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/originSaleDay/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//日数据管理--原始数据管理--采购原始数据--load
export const getDailyPurchaseOriginalList = (params?: any) => {
  return request({
    method: 'post',
    url: '/originPurchaseDay/search ',
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

//日数据管理--原始数据管理--采购原始数据--详情
export const getDailyPurchaseOriginalDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/originPurchaseDay/detail',
    params,
  });
};

//日数据管理--原始数据管理--采购原始数据--导出
export const getPurchaseDayExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/originPurchaseDay/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//日数据管理-原始数据管理--采购原始数据--批量删除
export const dailyOriginalDataPurchaseDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originPurchaseDay/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//日数据管理-原始数据管理--采购原始数据--单个删除
export const singleDailyOriginalDataPurchaseDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originPurchaseDay/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//日数据管理--原始数据管理--库存原始数据--load
export const getDailyInventoryOriginalList = (params?: any) => {
  return request({
    method: 'post',
    url: '/originInventoryDay/search',
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

//日数据管理--原始数据管理--库存原始数据--详情
export const getInventoryOriginalDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/originInventoryDay/detail',
    params,
  });
};

//日数据管理--原始数据管理--库存原始数据--单个删除
export const singleDailyOriginalDataInventoryDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originInventoryDay/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//日数据管理--原始数据管理--库存原始数据--批量删除
export const dailyOriginalDataInventoryDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originInventoryDay/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//日数据管理--原始数据管理--库存原始数据--导出
export const getInventoryDayExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/originInventoryDay/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};
