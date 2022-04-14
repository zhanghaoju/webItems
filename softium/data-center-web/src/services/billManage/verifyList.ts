import request from '@/utils/request';

//打单管理--列表
export const getVerifyPollList = (params?: any) => {
  return request({
    method: 'post',
    url: '/verify-poll/search',
    data: {
      ...params,
    },
  });
};

export async function searchInstituName(params: any) {
  return request({
    url: `/verify-poll/searchInstituName`,
    method: 'post',
    data: {
      ...params,
    },
  });
}

//验证名单--下载模板
export const downLoadTemplateQuery = () => {
  return request({
    method: 'post',
    url: '/verify-poll/template/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {},
  });
};

export const verifyInsertName = (params?: any, url?: any) => {
  return request({
    method: 'post',
    url: '/verify-poll/insertName',
    data: params,
  });
};

//打单管理--导出
export const verifyExportOperating = (params: any) => {
  return request({
    method: 'post',
    url: '/verify-poll/exportOperating',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

export const saasInfoUserData = (params?: any, url?: any) => {
  return request({
    method: 'post',
    url: '/saasInfo/userData',
    data: params,
  });
};

export const verifiOperating = (params?: any, url?: any) => {
  return request({
    method: 'post',
    url: '/verify-poll/verifiOperating',
    data: params,
  });
};

export const saasInfoTaskDistribution = (params?: any, url?: any) => {
  return request({
    method: 'post',
    url: '/saasInfo/taskDistribution',
    data: params,
  });
};
