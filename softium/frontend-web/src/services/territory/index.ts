import request from '@/utils/request';

interface TerritoryTreeParams {
  periodId: string;
}

/**
 * 获取辖区树
 * @param params
 */
export const getTerritoryTree = (params: TerritoryTreeParams) =>
  request({
    method: 'get',
    url: '/territory/tree',
    params,
  });
