import request from '@/utils/request';

export interface ResourceParams {
  i18nKey?: string[];
  appId: string;
}

/**
 * 根据AppId加载国际化语言列表
 */
export async function getAllLocales() {
  return request.get(`/i18n/loadLocale`, {
    baseURL: process.env.PASS_URL,
  });
}

/**
 * 加载国际化资源
 * @param params
 */
export async function loadResource(params?: ResourceParams) {
  return request({
    method: 'POST',
    url: '/i18n/loadResource',
    data: params,
    baseURL: process.env.PASS_URL,
  });
}
