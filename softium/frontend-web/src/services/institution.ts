import request from '@/utils/request';

/**
 * 医院列表
 * @param params
 */
export const getHospitalList = (params?: any) => {
  return request({
    method: 'post',
    url: '/institution/healthcare/list',
    data: params,
  });
};

/**
 * 推荐机构
 * @param params
 */
export const institutionRecommend = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/recommend',
    data: params,
  });
};

/**
 * 医院修改
 * @param params
 */
export const updateHospital = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/healthCare/update',
    data: params,
  });
};

/**
 * 添加医院
 * @param params
 */
export const insertHospital = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/healthCare/insert',
    data: params,
  });
};

/**
 * 添加医院DCR
 * @param params
 */
export const dcrInsertHospital = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/healthCare/dcr/insert',
    data: params,
  });
};

/**
 * 别名列表
 * @param params
 */
export const getAliasList = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/alias/list',
    data: params,
  });
};

/**
 * 修改别名
 * @param params
 */
export const updateAlias = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/alias/update',
    data: params,
  });
};

/**
 * 添加别名
 * @param params
 */
export const insertAlias = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/alias/add',
    data: params,
  });
};

/**
 * 医院详情
 * @param params
 */
export const getInstitutionDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/institution/detail',
    params,
  });
};

/**
 * 医院详情
 * @param params
 */
export const getHospitalDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/institution/detail',
    params,
  });
};

/**
 * 药店列表
 * @param params
 */
export const getPharmacyList = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/pharmacy/list',
    data: params,
  });
};

/**
 * 添加药店
 * @param params
 */
export const insertPharmacy = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/pharmacy/insert',
    data: params,
  });
};

/**
 * 添加药店DCR
 * @param params
 */
export const dcrInsertPharmacy = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/pharmacy/dcr/insert',
    data: params,
  });
};

/**
 * 修改药店
 * @param params
 */
export const updatePharmacy = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/pharmacy/update',
    data: params,
  });
};

/**
 * 租户经销商配置
 * @param params
 */
export const getInstitutionConfig = (params?: any) => {
  return request({
    method: 'get',
    url: '/institution/institutionConfig',
    params,
  });
};

/**
 * 经销商列表
 * @param params
 */
export const getDistributorList = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/list',
    data: params,
  });
};

/**
 * 代理商列表
 * @param params
 */
export const getAgentList = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/list',
    data: params,
  });
};

/**
 * 添加经销商
 * @param params
 */
export const insertDistributor = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/insert',
    data: params,
  });
};

/**
 * 添加经销商DCR
 * @param params
 */
export const dcrInsertDistributor = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/dcr/insert',
    data: params,
  });
};

/**
 * 修改经销商
 * @param params
 */
export const updateDistributor = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/update',
    data: params,
  });
};

/**
 * 经销商机构信息
 * @param params
 */
export const getInstitutionInfo = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/institutionInfo',
    data: params,
  });
};

/**
 * 经销商产品信息
 * @param params
 */
export const getProductInfo = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/productInfo',
    data: params,
  });
};

/**
 * 经销商产品级别列表
 * @param params
 */
export const getDistributorLevelInfo = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/levelInfo',
    data: params,
  });
};

/**
 * 添加经销商产品级别
 * @param params
 */
export const insertDistributorLevel = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/levelAdd',
    data: params,
  });
};

/**
 * 修改经销商级别
 * @param params
 */
export const updateDistributorLevel = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/levelUpdate',
    data: params,
  });
};

export const batchDeleteDistributorLevel = (params: any) =>
  request({
    method: 'post',
    url: '/institution/distributor/levelBatchDelete',
    data: params,
  });

export const batchUpdateDistributorLevel = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/distributor/levelBatchUpdate',
    data: params,
  });
};

/**
 * 添加代理商
 * @param params
 */
export const insertAgent = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/insert',
    data: params,
  });
};

/**
 * 添加代理商DCR
 * @param params
 */
export const dcrInsertAgent = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/dcr/insert',
    data: params,
  });
};

/**
 * 修改代理商
 * @param params
 */
export const updateAgent = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/update',
    data: params,
  });
};

/**
 * 医院模板导出
 * @ params
 */
export const downloadHospitalTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/institution/healthCare/template',
    params,
  });
};

/**
 * 药店模板导出
 * @ params
 */
export const downloadPharmacyTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/institution/pharmacy/template',
    params,
  });
};

/**
 * 经销商模板导出
 * @ params
 */
export const downloadDistributorTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/institution/distributor/template',
    params,
  });
};

/**
 * 医院数据导出
 * @params params
 */
export const exportHospitalData = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/institution/healthCare/export',
    data: params,
  });
};

/**
 * 药店数据导出
 * @params params
 */
export const exportPharmacyData = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/institution/pharmacy/export',
    data: params,
  });
};

/**
 * 经销商数据导出
 * @params params
 */
export const exportDistributorData = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/institution/distributor/export',
    data: params,
  });
};

/**
 * 经销商数据级别导出
 * @params params
 */
export const exportDistributorLevelData = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/institution/distributor/level/export',
    data: params,
  });
};

/**
 * 别名模板导出
 */
export const aliasTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/institution/alias/template',
    params,
  });
};

/**
 * 级别模板导出
 */
export const levelTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/institution/distributor/level/template',
    params,
  });
};

/**
 * 级别模板导出
 */
export const contractTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/distributor/contract/content/template',
    params,
  });
};

/**
 * 代理商协议模板下载
 */
export const agentContractTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/agentContract/template',
    params,
  });
};

/**
 * 协议配送商模板下载
 */
export const agreeContractTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/agentScope/template',
    params,
  });
};

/**
 * 别名数据导出
 */
export const exportAliasData = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/institution/alias/export',
    data: params,
  });
};

/**
 * 代理商协议导出
 */
export const exportAgentContract = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/agentContract/export',
    data: params,
  });
};

/**
 * 代理商协议导出
 */
export const exportAgreeContract = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/agentScope/export',
    data: params,
  });
};

/**
 * 别名数据导出
 */
export const exportContractData = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/distributor/contract/content/export',
    data: params,
  });
};

/**
 * 机构查询
 * @param params
 */
export const getList = (params?: any) => {
  return request({
    method: 'post',
    url: '/institution/list',
    data: params,
  });
};

/**
 * 下载机构模板
 */
export const institutionTemplate = () =>
  request({
    method: 'get',
    url: '/institution/industryCode/template',
    responseType: 'blob',
  });

/**
 * 下载全部机构模板
 */
export const institutionAllTemplate = () =>
  request({
    method: 'get',
    url: '/institution/institutionAll/template',
    responseType: 'blob',
  });

/**
 * 机构数据导出
 */
export const exportInstitutionData = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/institution/exportAll',
    data: params,
  });
};

export const getDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/institution/detail',
    params,
  });
};

/**
 * 代理商协议列表
 * @param params
 */
export const getAgentContractList = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/contract/list',
    data: params,
  });
};

/**
 * 代理商协议添加
 * @param params
 */
export const agentContractInsert = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/contract/insert',
    data: params,
  });
};

/**
 * 代理商协议修改
 * @param params
 */
export const agentContractUpdate = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/contract/update',
    data: params,
  });
};

/**
 * 代理商协议编码检测
 * @param params
 */
export const agentContractCheck = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/contract/check',
    data: params,
  });
};

/**
 * 协议配送商添加
 * @param params
 */
export const contractDistributorInsert = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/contractDistributor/insert',
    data: params,
  });
};

/**
 * 协议配送商添加
 * @param params
 */
export const getContractDistributorList = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/contractDistributor/list',
    data: params,
  });
};

/**
 * 协议配送商修改
 * @param params
 */
export const updateContractDistributor = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/agent/contractDistributor/update',
    data: params,
  });
};

/**
 * 代理商模板导出
 * @ params
 */
export const downloadAgentTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/institution/agent/template',
    params,
  });
};

/**
 * 代理商数据导出
 */
export const exportAgentData = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/institution/agent/export',
    data: params,
  });
};

/**
 * 其他类型机构列表
 * @param params
 */
export const getOtherList = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/other/list',
    data: params,
  });
};

/**
 * 添加其他类型机构
 * @param params
 */
export const insertOther = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/other/insert',
    data: params,
  });
};

/**
 * 添加其他类型机构
 * @param params
 */
export const dcrInsertOther = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/other/dcr/insert',
    data: params,
  });
};

/**
 * 修改其他类型机构
 * @param params
 */
export const updateOther = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/other/update',
    data: params,
  });
};

/**
 * 其他类型数据导出
 * @params params
 */
export const exportOtherData = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/institution/other/export',
    data: params,
  });
};

/**
 * 其他类型模板导出
 * @ params
 */
export const downloadOtherTemplate = (params: any) => {
  return request({
    method: 'get',
    responseType: 'blob',
    url: '/institution/other/template',
    params,
  });
};

/**
 * 校验机构别名
 * @ params`
 */
export const checkAlias = (params: any) => {
  return request({
    method: 'get',
    url: '/institution/checkInstitutionName',
    params,
  });
};

/**
 * 获取机构申请详情
 * @ params`
 */
export const getNewApplyDetail = (params: any) => {
  return request({
    method: 'get',
    url: '/dcr/institution/institutionDcrDetail',
    params,
  });
};

/**
 * 删除机构
 * @ params`
 */
export const deleteInstitution = (params: any) => {
  return request({
    method: 'get',
    url: '/institution/delete',
    params,
  });
};

/**
 * 变更机构属性
 * @ params`
 */
export const institutionTypeChange = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/type-change/create',
    data: params,
  });
};

/**
 * 变更机构属性记录
 * @ params`
 */
export const typeChangeList = (params: any) => {
  return request({
    method: 'post',
    url: '/institution/type-change/list',
    data: params,
  });
};

/**
 * 机构属性变更记录导出
 * @ params`
 */
export const typeChangeExport = (params: any) => {
  return request({
    method: 'post',
    responseType: 'blob',
    url: '/institution/type-change/export',
    data: params,
  });
};
