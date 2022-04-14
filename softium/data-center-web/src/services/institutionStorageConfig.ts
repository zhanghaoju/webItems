import request from '@/utils/request';

//质检报告下载
export const downLoadInsititutionTemplate = (params?: any) => {
  return request({
    method: 'get',
    url: '/fileHandleProcess/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: params,
  });
};

/**
 * 默认上传模板详情加载接口
 */
export async function institutionConfigLoad(params: any) {
  return request({
    url: `/fileHandleProcess/templateLoad`,
    method: 'get',
    params,
  });
}

/**
 * 上传模板提交配置接口
 */
export async function institutionConfigSubmit(params: any) {
  return request({
    url: `/fileHandleProcess/distribTemplate`,
    method: 'post',
    data: params,
  });
}

/**
 * 特殊经销商上传模板配置列表load
 */
export async function institutionUploadTemplateLoad(params: any) {
  return request({
    url: `/fileHandleProcess/distribTemplateLoad`,
    method: 'post',
    data: params,
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
}

/**
 * 特殊经销商上传模板配置列表删除接口
 */
export async function institutionUploadTemplateDelete(params: any) {
  return request({
    url: `/fileHandleProcess/delDistribTemplate`,
    method: 'get',
    params,
  });
}

/**
 * 特殊经销商上传模板详情加载接口
 */
export async function specialInstitutionConfigLoad(params: any) {
  return request({
    url: `/fileHandleProcess/loadDistribTemplate`,
    method: 'get',
    params,
  });
}

/**
 * 上传模板经销商模糊查询接口
 */
export async function institutionConfigForSearch(params: any) {
  return request({
    url: `/institution/distribList`,
    method: 'post',
    data: params,
  });
}
