import request from '@/utils/request';

interface Dictionary {
  systemCode?: string;
  categoryCode?: string;
}

export const getDictionaryByCode = (params: Dictionary) => {
  return request.post('/dictionary/search', params);
};

export const getDictionaryAll = (params?: Dictionary) => {
  return request.post('/dictionary/searchAll', params);
};
export const searchDictionary = (params: any) => {
  return request({
    method: 'POST',
    url: '/dictionary/search',
    data: params,
  });
};
