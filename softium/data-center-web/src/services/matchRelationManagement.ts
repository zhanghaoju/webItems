import request from '@/utils/request';

//机构匹配
export const getInstitutionMatchList = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionMapping/search',
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

//机构匹配--下载模板
export const downLoadTemplateQuery = () => {
  return request({
    method: 'post',
    url: '/institutionMapping/template/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {},
  });
};

//机构匹配--导出
export const getExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/institutionMapping/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//机构匹配--失效/失效/批量失效
export const institutionMappingEffectivenessSetting = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionMapping/effectivenessAndInvalidity ',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//产品匹配
export const getProductMatchList = (params?: any) => {
  return request({
    method: 'post',
    url: '/productMapping/search',
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

//产品匹配--下载模板
export const downloadProductTemplateQuery = () => {
  return request({
    method: 'post',
    url: '/productMapping/template/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {},
  });
};

//产品匹配--导出
export const getProductExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/productMapping/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//产品匹配--失效/失效/批量失效
export const productMappingEffectivenessSetting = (params?: any) => {
  return request({
    method: 'post',
    url: '/productMapping/effectivenessAndInvalidity',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//单位匹配
export const getProductUnitMatchList = (params?: any) => {
  return request({
    method: 'post',
    url: '/productUnitMapping/search',
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

//单位匹配--下载模板
export const downloadProductUnitTemplateQuery = () => {
  return request({
    method: 'post',
    url: '/productUnitMapping/template/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {},
  });
};

//单位匹配--导出
export const getProductUnitExportQuery = (params: any) => {
  return request({
    method: 'post',
    url: '/productUnitMapping/export',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//单位匹配--失效/失效/批量失效
export const productUnitMappingEffectivenessSetting = (params?: any) => {
  return request({
    method: 'post',
    url: '/productUnitMapping/effectivenessAndInvalidity ',
    data: [...params],
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};
