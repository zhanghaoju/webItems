import request from '@/utils/request';

//挂靠主页面-load
export const getFromInstitutionAttachList = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/search',
    data: {
      ...params, //如果用proTable中的request.js 直接发送请求，参数格式会被解析，因此这里需要这样写才可转化为对象格式
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

//产品挂靠主页面-load
export const getFromProductAttachList = (params?: any) => {
  return request({
    method: 'post',
    url: '/productAttach/search',
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

//挂靠主页面-load 账期、和挂靠类型下拉框数据
export const getPeriodConfig = (params?: any) => {
  return request({
    method: 'get',
    url: '/institutionAttach/getAvailablePeriods',
    params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠主页面-load 账期、和挂靠类型下拉框数据
export const institutionConfigForSearch = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/enterpriseIntelligentMatchingList',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠主页面-load 账期、和挂靠类型下拉框数据,原始机构名称搜索
export const originalInstitutionSearch = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/originalInstitutionSearch',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠主页面-load 账期、和挂靠类型下拉框数据,挂靠后机构名称搜索
export const attachedInstitutionSearch = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/attachedInstitutionSearch',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠-字典查询接口
export const getDictionary = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getDictionary',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠-产品查询接口
export const getProductForAttach = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/getMdmProductList',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠-挂靠添加提交接口
export const saveAttachAdd = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/add',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠-产品挂靠添加提交接口
export const saveProductAttachAdd = (params?: any) => {
  return request({
    method: 'post',
    url: '/productAttach/add',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠-挂靠编辑提交接口
export const saveAttachEdit = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/edit',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//产品挂靠-挂靠编辑提交接口
export const saveProductAttachEdit = (params?: any) => {
  return request({
    method: 'post',
    url: '/productAttach/edit',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//产品挂靠--导出
export const productAttachExport = (params?: any) => {
  return request({
    method: 'post',
    url: '/productAttach/export',
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

//机构挂靠--下载模板
export const exportInstitutionAttach = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/template/download',
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

//产品挂靠--下载模板
export const exportProductAttach = (params?: any) => {
  return request({
    method: 'post',
    url: '/productAttach/template/download',
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

//挂靠-挂靠详情load接口
export const attachDetail = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/detail',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠-产品挂靠详情load接口
export const attachProductDetail = (params?: any) => {
  return request({
    method: 'get',
    url: '/productAttach/detail',
    params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠-挂靠导出接口
export const exportAttach = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/export',
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

//挂靠-挂靠删除接口
export const attachDelete = (params?: any) => {
  return request({
    method: 'post',
    url: '/institutionAttach/delete',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠-产品挂靠删除接口
export const attachProductDelete = (params?: any) => {
  return request({
    method: 'get',
    url: '/productAttach/delete',
    params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠主页面-load 账期、和挂靠类型下拉框数据,原始机构名称搜索
export const productSearch = (params?: any) => {
  return request({
    method: 'post',
    url: '/productAttach/getMdmProductList',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//挂靠计算
export const getInstitutionRelyQuery = (params?: any) => {
  return request({
    method: 'get',
    url: '/institutionAttach/compute',
    params,
  });
};
