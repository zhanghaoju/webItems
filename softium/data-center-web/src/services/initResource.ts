import request from '@/utils/request';

//全局是用的下拉框数据
export const initPocketResource = (params?: any) => {
  return request({
    method: 'get',
    url: '/projectManagement/initResource',
    params,
  });
};

//账期--新增(主要用来查当前租户未封板的数据账期,大多用来做页面初始查询条件使用)
export const getUntreatedPeriod = (params?: any) => {
  return request({
    method: 'post',
    url: '/period/getUntreatedPeriod',
    data: {
      ...params,
    },
    baseURL: process.env.DATACENTER_URL,
  });
};

//账期--下拉列表(主要用来查当前租户未封板的数据账期,大多用来做页面初始查询条件使用)
export const getPeriodList = (params?: any) => {
  return request({
    method: 'post',
    url: '/period/list',
    data: params,
    baseURL: process.env.DATACENTER_URL,
  });
};

//行业库按钮和行业库推荐列表是否显示，接口查询
export const getIsDisplay = (params?: any) => {
  return request({
    method: 'get',
    url: '/match/getIsDisplay',
    params,
    baseURL: process.env.DATACENTER_URL,
  });
};
