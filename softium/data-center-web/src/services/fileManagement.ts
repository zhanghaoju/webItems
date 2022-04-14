import request from '@/utils/request';

export const getFileManagementList = (params?: any) => {
  return request({
    method: 'post',
    url: '/fileParseLog/search',
    data:{
      ...params
    }
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success
    }
  })
};

//数据删除
export const deleteFileParseLog = (params?:any)=>{
  return request({
    method: 'post',
    url: '/fileParseLog/delete',
    data:{
      ...params
    },
  });
};

//原始文件下载
export const downLoadFileParseLogOrignalData =(params?:any)=>{
  return request({
    method: 'post',
    url: '/fileParseLog/originData/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true
    },
    data:{
      ...params
    },
  });
}

//文件校验结果查看
export const getFileParseResult =(params?:any)=>{
  return request({
    method: 'post',
    url: '/fileParseLog/getFileParseResult',
    data:{
      ...params
    },
  });
}

//质检报告下载
export const downLoadFileParseLogReport =(params?:any)=>{
  return request({
    method: 'post',
    url: '/fileParseLog/report/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true
    },
    data:{
      ...params
    },
  });
}

