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

//月数据管理--原始数据管理--销售原始数据--load
export const getSaleOriginalList = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/sale/search',
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

//月数据管理-原始数据管理--销售原始数据--删除
export const monthlyOriginalDataSaleDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/sale/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

export const singleMonthlyOriginalDataSaleDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/sale/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//月数据管理--原始数据管理--销售原始数据--详情
export const getSaleOriginalDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/originData/sale/detail',
    params,
  });
};

//月数据管理--原始数据管理--销售原始数据--导出
export const getExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/originData/originSale/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//月数据管理--原始数据管理--采购原始数据--load
export const getPurchaseOriginalList = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/purchase/search',
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

//月数据管理--原始数据管理--采购原始数据--详情
export const getPurchaseOriginalDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/originData/purchase/detail',
    params,
  });
};

//月数据管理-原始数据管理--采购原始数据--删除
export const monthlyOriginalDataPurchaseDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/purchase/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//月数据管理--原始数据管理--采购原始数据--导出
export const getPurchaseExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/originData/originPurchase/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//月数据管理-原始数据管理--采购原始数据--删除
export const singleMonthlyOriginalDataPurchaseDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/purchase/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//月数据管理--原始数据管理--库存原始数据--load
export const getInventoryOriginalList = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/inventory/search',
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

//月数据管理--原始数据管理--库存原始数据--详情
export const getInventoryOriginalDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/originData/inventory/detail',
    params,
  });
};

//月数据管理--原始数据管理--库存原始数据--导出
export const getInventoryExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/originData/originInventory/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//月数据管理--原始数据管理--库存原始数据--删除
export const singleMonthlyOriginalDataInventoryDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/inventory/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

export const monthlyOriginalDataInventoryDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/inventory/delete',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};
