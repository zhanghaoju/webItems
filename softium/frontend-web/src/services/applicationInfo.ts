import request from '@/utils/request';

interface ResourceParams {
  appId?: string;
  appCode?: string;
}

export const getApp = () => {
  return request({
    method: 'get',
    url: '/cas-client/account-details',
  });
};

export const getExtColumn = (params: any) => {
  return request({
    method: 'get',
    url: '/column/ext',
    params,
  });
};

export const getColumn = (params: any) => {
  return request({
    method: 'get',
    url: '/column/load',
    params,
  });
};

export const getLoadCommon = (params: any = {}) => {
  return request({
    method: 'get',
    url: '/column/loadCommon',
    params,
  });
};

export const getResourceRoute = (params?: ResourceParams) => {
  return request({
    method: 'get',
    url: '/user/resource',
    baseURL: process.env.SAAS_URL,
    params,
  });
};
