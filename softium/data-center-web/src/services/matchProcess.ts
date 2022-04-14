import request from '@/utils/request';

//经销商匹配
//待办处理--月数据处理--匹配处理-经销商匹配-load
export const getFromInstitutionMatchList = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getFromInstitutionMatch',
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

//待办处理--月数据处理--匹配处理-经销商匹配-统计查询
export const getMatchCount = (params?: any) => {
  return request({
    method: 'get',
    url: '/match/getSaleCount',
    params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-统计查询
export const getRegion = (params?: any) => {
  return request({
    method: 'get',
    url: '/match/getRegion',
    params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-智能匹配
export const smartMatchFunc = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/industyMatch',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-弹窗列表查询(企业主数据智能推荐列表)
export const getEnterpriseMatchList = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/enterpriseIntelligentMatchingList',
    data: params,
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-弹窗列表查询(行业主数据智能推荐列表)
export const getTradeMatchList = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/industryIntelligentMatchingList',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-弹窗列表确认匹配  校验接口
export const matchCheck = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getMdmConfig',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-弹窗列表确认匹配  校验接口
export const mainDataInsert = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/mainDataInsert',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-撤销匹配
export const cancelCheck = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/cancelFromInstitutionMatch',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-匹配
export const matchSubmit = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/fromInstitutionMatch',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-导出
export const exportUnMatch = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/exportUnMatch',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-添加打单名单
export const addPlayNameLIst = (params?: any) => {
  return request({
    method: 'post',
    url: '/billPrint/saveOrUpdate',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-字典查询接口
export const getDictionary = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getDictionary',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-经销商匹配-经销商新增企业主数据
export const addFromInstitution = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/addFromInstitution',
    data: params,
  });
};

//机构匹配
//待办处理--月数据处理--匹配处理-机构匹配-机构新增企业主数据
export const addFromOrganization = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/addToInstitution',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-机构匹配-load
export const getFromOrganizationMatchList = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getToInstitutionMatch',
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

//待办处理--月数据处理--匹配处理-机构匹配-匹配
export const matchSubmitForOrganization = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/toInstitutionMatch',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-机构匹配-撤销匹配
export const cancelCheckForOrganization = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/cancelToInstitutionMatch',
    data: params,
  });
};

//产品匹配
//待办处理--月数据处理--匹配处理-产品匹配-左侧列表load
export const getProductMatchList = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getProductMatch',
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

//待办处理--月数据处理--匹配处理-产品匹配-右侧列表load
export const getProductMatchRightList = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getMdmProductList',
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

//待办处理--月数据处理--匹配处理-产品匹配-匹配
export const matchSubmitForProduct = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/productMatch',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-产品匹配-撤销匹配
export const cancelCheckForProduct = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/cancelProductMatch',
    data: params,
  });
};

//单位匹配
//待办处理--月数据处理--匹配处理-单位匹配-load
export const getUnitMatchList = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/getProductUnitMatch',
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

//待办处理--月数据处理--匹配处理-单位匹配-匹配
export const matchSubmitForUnit = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/productUnitMatch',
    data: params,
  });
};

//待办处理--月数据处理--匹配处理-单位匹配-撤销匹配
export const cancelCheckForUnit = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/cancelProductUnitMatch',
    data: params,
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

//判断行业库只能匹配按钮清洗过程置灰状态
export const getCleanIndustryMatchQuery = (params?: any) => {
  return request({
    method: 'post',
    url: '/dataConfig/cleanIndustryMatchButton',
    data: params,
  });
};
