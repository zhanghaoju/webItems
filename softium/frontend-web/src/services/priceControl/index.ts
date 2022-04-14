import request from '@/utils/request';

//产品
export const productTree = (params?: any, url?: any) => {
  return request({
    method: 'get',
    url: '/product/tree',
    params,
  });
};
export const getInstitutionList = (params: any) => {
  return request({
    method: 'POST',
    url: '/institution/list',
    data: params,
  });
};

export const getColumns = (params: any) =>
  request({
    method: 'get',
    url: '/institutionBargain/columns',
    params,
  });

export const getDistributorLevelInfo = (params: any) =>
  request({
    method: 'post',
    url: '/institution/distributor/levelInfo',
    data: params,
  });

export const addPrice = (params: any) =>
  request({
    method: 'post',
    url: '/institutionBargain/add',
    data: params,
  });

export const getPriceList = (params: any) =>
  request({
    method: 'POST',
    url: '/institutionBargain/list',
    data: params,
  });

export const editPriceInfo = (params: any) =>
  request({
    method: 'post',
    url: '/institutionBargain/edit',
    data: params,
  });

export const deletePrice = (params: any) =>
  request({
    method: 'post',
    url: '/institutionBargain/delete',
    data: params,
  });

export const downloadPriceTemplate = (financialYearId: string | null) =>
  request({
    method: 'get',
    url: `/institutionBargain/template/${financialYearId}`,
    responseType: 'blob',
  });

export const exportPrice = (params: any) =>
  request({
    method: 'post',
    url: '/institutionBargain/export',
    responseType: 'blob',
    data: params,
  });
