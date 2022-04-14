import request from '@/utils/request';

export const getFileManagementList = (params?: any) => {
  return request({
    method: 'post',
    url: '/fileParseLog/search',
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

//加号触发二级展示下拉数据接口
export const getFileManagementListInfo = (params?: any) => {
  return request({
    method: 'get',
    url: '/fileParseLog/searchFile',
    params,
  });
};

//状态查询下拉数据接口
export const getTreeStatus = (params?: any) => {
  return request({
    method: 'get',
    url: '/fileParseLog/queryTreeStatus',
    params,
  });
};

//数据删除
export const deleteFileParseLog = (params?: any) => {
  return request({
    method: 'post',
    url: '/fileParseLog/delete',
    data: {
      ...params,
    },
  });
};

//原始文件下载
export const downLoadFileParseLogOrignalData = (params?: any) => {
  return request({
    method: 'post',
    url: '/fileParseLog/originData/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//文件校验结果查看
export const getFileParseResult = (params?: any) => {
  return request({
    method: 'get',
    url: '/fileParseLog/getFileParseResult',
    params,
  });
};

//质检报告下载
export const downLoadFileParseLogReport = (params?: any) => {
  return request({
    method: 'post',
    url: '/fileParseLog/report/download',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};

//文件管理，数据查看按钮(原始数据)
export const getOriginDataViewList = (params?: any) => {
  return request({
    method: 'post',
    url: '/originData/data/search',
    data: {
      ...params, //如果用proTable中的request.js 直接发送请求，参数格式会被解析，因此这里需要这样写才可转化为对象格式
    },
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//文件管理，数据查看按钮(核查数据)
export const getCheckDataViewList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/checkData',
    data: {
      ...params, //如果用proTable中的request.js 直接发送请求，参数格式会被解析，因此这里需要这样写才可转化为对象格式
    },
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//文件管理，数据查看按钮(交付数据)
export const getActiveDataViewList = (params?: any) => {
  return request({
    method: 'post',
    url: '/inspectData/activeData',
    data: {
      ...params, //如果用proTable中的request.js 直接发送请求，参数格式会被解析，因此这里需要这样写才可转化为对象格式
    },
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//质检数据查看，load  tab的接口
export const qualityDetailLoad = (params?: any) => {
  return request({
    method: 'post',
    url: '/fileParseLog/reportQuery',
    data: {
      ...params,
    },
  });
};

//文件管理，质检数据查看按钮
export const getQualityList = (params?: any) => {
  return request({
    method: 'post',
    url: '/fileParseLog/qualityReportList',
    data: {
      ...params, //如果用proTable中的request.js 直接发送请求，参数格式会被解析，因此这里需要这样写才可转化为对象格式
    },
  }).then((response: any) => {
    return {
      total: response.data.total,
      data: response.data.list,
      success: response.success,
    };
  });
};

//质检数据查看导出
export const getQualityExport = (params?: any) => {
  return request({
    method: 'post',
    url: '/fileParseLog/exportQueryQuality',
    responseType: 'blob',
    headers: {
      supressTruncature: true,
    },
    data: {
      ...params,
    },
  });
};
