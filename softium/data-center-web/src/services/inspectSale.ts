import request from '@/utils/request';


export const getInspectSaleList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/sale/search',
    data:{
      ...params
    }
  })
};

export const detail = (params?: any) => {
  return request({
    method: 'get',
    url: '/inspectData/sale/detail',
    params
  })
};

export const getPocket = () => {
  return request({
    method: 'get',
    url: 'projectManagement/initResource'
  })
}