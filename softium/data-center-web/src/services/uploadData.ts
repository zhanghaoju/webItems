import request from '@/utils/request';

//质检报告下载
export const downLoadTemplate = (params?: any) => {
  return request({
    method: 'get',
    url: '/fileHandleProcess/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: params,
  });
};

/**
 * 上传文件初始化界面接口
 */
export async function uploadDataLoad(params: any) {
  return request({
    url: `/fileHandleProcess/filepageload`,
    method: 'get',
    params,
  });
}

/**
 * 上传文件接口
 */
export async function uploadDataSubmit(params: any) {
  return request({
    url: `/fileHandleProcess/fileUpload`,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data;charset=utf-8',
    },
  });
}
