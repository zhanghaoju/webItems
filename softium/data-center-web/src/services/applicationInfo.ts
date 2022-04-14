import request from '@/utils/request';

interface ResourceParams {
  appId?: string;
  appCode?: string;
}

//用戶信息
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/cas-client/account-details',
  });
};

//资源：页面元素菜单资源
export const getResourceRoute = (params?: ResourceParams) => {
  return request({
    method: 'get',
    url: '/user/resource',
    baseURL: process.env.SAAS_URL,
    params,
  });
};

//获取默该租户默认账期
export const getDefaultPeriod = (params?: any, url?: any) => {
  return request({
    method: 'get',
    url: '/period/getDefaultPeriodAndPocket',
    data: params,
  });
};
