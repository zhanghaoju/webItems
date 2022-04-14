import request from '../utils/request';
import { APPID } from '@/constant';

export interface ResourceParams {
  i18nKey?: string[];
}

// /**
//  * 根据AppId加载国际化语言列表
//  */
// export async function getAllLocales() {
//   return request.get(`/i18n/loadLocale`, {
//     baseURL: process.env.PAAS_URL
//   });
// }
//
// /**
//  * 加载国际化资源
//  * @param params
//  */
// export async function loadResource(params?: ResourceParams) {
//   return request({
//     method: 'POST',
//     url: '/i18n/loadResource',
//     data: params,
//     baseURL: process.env.PAAS_URL
//   })
// }

/**
 * 获取用户信息
 */
export async function getAccount() {
  return request({
    method: 'GET',
    url: '/cas-client/account-details',
  });
}

/**
 * 获取应用信息
 */
export async function getResource() {
  return request({
    method: 'GET',
    url: '/user/resource',
    params: {
      appId: APPID,
    },
    baseURL: process.env.SAAS_URL,
  });
}

/**
 * 获取动态表格
 */
export async function getDynamicTable(data: {
  tenantId: string;
  code: string;
}) {
  return request({
    method: 'GET',
    url:
      '/ext/load?appId=' +
      APPID +
      '&tableName=' +
      data.code +
      '&tenantId=' +
      data.tenantId,
    data: data,
  });
}
/**
 * 机构搜索
 * @param name
 */
export async function institutionSearch(name: string = '') {
  return request({
    params: {
      name,
    },
    method: 'GET',
    url: '/options/institution-search',
    // baseURL: process.env.REPORT_URL,
  });
}
/**
 * 字典
 */
export async function getOptions() {
  return request({
    method: 'GET',
    url: '/options/configcenter-options',
    // baseURL: process.env.REPORT_URL,
  });
}
