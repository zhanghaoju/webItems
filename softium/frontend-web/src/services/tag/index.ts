import request from '@/utils/request';

export const searchTag = (data: any) => {
  return request({
    method: 'post',
    url: 'tag/search',
    data,
  });
};
