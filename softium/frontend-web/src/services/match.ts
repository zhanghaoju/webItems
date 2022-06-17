import request from '@/utils/request';

/**
 * 任务列表
 * @param params
 */
export const getList = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/list',
    data: params,
  });
};

/**
 * 添加任务
 * @param params
 */
export const addTask = (params: any) => {
  return request({
    method: 'post',
    url: '/match/add',
    data: params,
  });
};

export const importExcls = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/import',
    data: params,
  });
};

export const submitData = (params?: any) => {
  return request({
    method: 'post',
    url: '/match/submitData',
    data: params,
  });
};
