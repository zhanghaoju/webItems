import request from '@/utils/request';

//列表
export const getTheoryBeginInventoryList = (params?: any) => {
  return request({
    method: 'post',
    url: '/beginTheoryInventory/search',
    data: {
      ...params,
    },
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//导出
export async function exportFile(params?: any) {
  return request({
    method: 'POST',
    responseType: 'blob',
    data: {
      ...params,
    },
    url: '/beginTheoryInventory/export',
  });
}

//下载模板
export async function downloadTemplate() {
  return request({
    method: 'GET',
    responseType: 'blob',
    url: '/beginTheoryInventory/template/download',
  });
}
