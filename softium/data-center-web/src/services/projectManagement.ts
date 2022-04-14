import request from '@/utils/request';

/**
 * 特殊经销商模糊查询接口
 */
export async function specialInstitutionFuzzyQuery (params: any) {
  return request({
    url: `/projectManagement/fuzzyQuery`,
    method: 'get',
    params
  })
}

/**
 * 特殊经销商模糊查询接口(全量)
 */
export async function specialInstitutionQueryAll () {
  return request({
    url: `/projectManagement/fuzzyQueryAll`,
    method: 'get'
  })
}

/**
 * 列映射默认配置load接口
 */
export const getFieldMappingDefaultList = (params: any) => {
  return request({
    method: 'get',
    url: '/fieldMapping/load',
    params,
  });
};


/**
 * 列映射默认配置添加接口
 */
export async function addFieldMappingDefault (params: any) {
  return request({
    url: `/fieldMapping/add`,
    method: 'post',
    data: params
  })
}

/**
 * 列映射默认配置修改接口
 */
export async function modifyFieldMappingDefault (params: any) {
  return request({
    url: `/fieldMapping/saveFieldsMapping`,
    method: 'post',
    data: params
  })
}

/**
 * 列映射默认配置查看和配置detail接口
 */
export async function detailFieldMappingDefault (params: any) {
  return request({
    url: `/fieldMapping/viewFieldList`,
    method: 'post',
    data: params
  })
}

/**
 * 列映射默认配置删除接口
 */
export async function deleteFieldMappingDefault (params: any) {
  return request({
    url: `/fieldMapping/deleteDefaultFieldMapping`,
    method: 'post',
    data: params
  })
}


/**
 * 列映射特殊经销商配置load接口
 */
export const getFieldMappingSpecialList = (params: any) => {
  return request({
    method: 'post',
    url: '/fieldMapping/loadSpecial',
    data: params
  })
  // .then((response: any) => {
  //   return {
  //     total: response.data.total,
  //     data: response.data.list,
  //     success: response.success
  //   }
  // });
};


/**
 * 列映射特殊经销商配置添加接口
 */
export async function addFieldMappingSpecial (params: any) {
  return request({
    url: `/fieldMapping/add`,
    method: 'post',
    data: params
  })
}

/**
 * 列映射特殊经销商配置修改接口
 */
export async function modifyFieldMappingSpecial (params: any) {
  return request({
    url: `/fieldMapping/saveFieldsMapping`,
    method: 'post',
    data: params
  })
}

/**
 * 列映射特殊经销商配置查看和配置detail接口
 */
export async function detailFieldMappingSpecial (params: any) {
  return request({
    url: `/fieldMapping/viewFieldList`,
    method: 'post',
    data: params
  })
}

/**
 * 列映射特殊经销商配置删除接口
 */
export async function deleteFieldMappingSpecial (params: any) {
  return request({
    url: `/fieldMapping/deleteSpecialFieldMapping`,
    method: 'post',
    data: params
  })
}


  /**
 * 文件列规则默认配置load接口
 */
export const getFileColumnRuleDefaultList = (params: any) => {
  return request({
    method: 'get',
    url: '/fileColumnRule/defaultLoad',
    params,
  });
};


/**
 * 文件列规则默认配置添加接口
 */
export async function addFileColumnRuleDefault (params: any) {
  return request({
    url: `/fileColumnRule/saveFileColumRule`,
    method: 'post',
    data: params
  })
}

/**
 * 文件列规则默认配置修改接口
 */
export async function modifyFileColumnRuleDefault (params: any) {
  return request({
    url: `/fileColumnRule/saveFileColumRule`,
    method: 'post',
    data: params
  })
}

/**
 * 文件列规则默认配置查看和配置detail接口
 */
export async function detailFileColumnRuleDefault (params: any) {
  return request({
    url: `/fileColumnRule/viewFieldList`,
    method: 'post',
    data: params
  })
}

/**
 * 文件列规则默认配置删除接口
 */
export async function deleteFileColumnRuleDefault (params: any) {
  return request({
    url: `/fileColumnRule/delFileColumnRule`,
    method: 'post',
    data: params
  })
}

/**
 * 文件列规则默认配置删除接口(特殊经销商通用，只是多传了projectInstitutionCode)
 */
export async function deleteFileColumnRuleDTOSDefault (params: any) {
  return request({
    url: `/fileColumnRule/deleteFieldRule`,
    method: 'post',
    data: params
  })
}

/**
 * 文件列规则特殊经销商配置load接口
 */
export const getFileColumnRuleSpecialList = (params: any) => {
  return request({
    url: '/fileColumnRule/specialLoad',
    method: 'post',
    data: params
  });
};


/**
 * 文件列规则特殊经销商配置添加接口
 */
export async function addFileColumnRuleSpecial (params: any) {
  return request({
    url: `/fileColumnRule/saveFileColumRule`,
    method: 'post',
    data: params
  })
}

/**
 * 文件列规则特殊经销商配置修改接口
 */
export async function modifyFileColumnRuleSpecial (params: any) {
  return request({
    url: `/fileColumnRule/saveFileColumRule`,
    method: 'post',
    data: params
  })
}

/**
 * 文件列规则特殊经销商配置查看和配置detail接口
 */
export async function detailFileColumnRuleSpecial (params: any) {
  return request({
    url: `/fileColumnRule/viewFieldList`,
    method: 'post',
    data: params
  })
}

/**
 * 文件列规则特殊经销商配置删除详情接口
 */
export async function deleteFileColumnRuleSpecial (params: any) {
  return request({
    url: `/fileColumnRule/delFileColumnRule`,
    method: 'post',
    data: params
  })
}

/**
 * 文件列规则特殊经销商配置删除接口
 */
export async function deleteFileColumnRuleDTOSSpecial (params: any) {
  return request({
    url: `/fileColumnRule/deleteFieldRule`,
    method: 'post',
    data: params
  })
}

  /**
 * 质检规则配置默认load接口
 */
export const getCheckRuleDefaultList = (params: any) => {
  return request({
    url: '/qualityRule/defaultLoad',
    method: 'get',
    params,
  });
};


/**
 * 质检规则配置默认配置添加接口
 */
export async function addCheckRuleDefault (params: any) {
  return request({
    url: `/qualityRule/editRule`,
    method: 'post',
    data: params
  })
}

/**
 * 质检规则配置默认配置修改接口
 */
export async function modifyCheckRuleDefault (params: any) {
  return request({
    url: `/qualityRule/editRule`,
    method: 'post',
    data: params
  })
}

/**
 * 质检规则配置默认配置查看和配置detail接口
 */
export async function detailCheckRuleDefault (params: any) {
  return request({
    url: `/qualityRule/detail`,
    method: 'get',
    params,
  })
}

/**
 * 质检规则配置默认配置删除详情接口
 */
export async function deleteCheckRuleDefault (params: any) {
  return request({
    url: `/qualityRule/deleteQualityRule`,
    method: 'post',
    data: params
  })
}


/**
 * 质检规则配置默认配置删除详情接口
 */
export async function switchCheckRuleDefault (params: any) {
  return request({
    url: `/qualityRule/switchOnOff`,
    method: 'post',
    data: params
  })
}

/**
 * 判重字段查询接口
 */
export async function preProcessFuzzyQuery (params: any) {
  return request({
    url: `/preProcess/fuzzyQueryField`,
    method: 'get',
    params
  })
}

/**
 * 质检规则配置特殊经销商load接口
 */
export const getCheckRuleSpecialList = (params: any) => {
  return request({
    url: '/qualityRule/specialLoad',
    method: 'post',
    data: params
  });
};


/**
 * 质检规则配置特殊经销商添加接口
 */
export async function addCheckRuleSpecial (params: any) {
  return request({
    url: `/qualityRule/editRule`,
    method: 'post',
    data: params
  })
}

/**
 * 质检规则配置特殊经销商修改接口
 */
export async function modifyCheckRuleSpecial (params: any) {
  return request({
    url: `/qualityRule/editRule`,
    method: 'post',
    data: params
  })
}

/**
 * 质检规则配置特殊经销商查看和配置detail接口
 */
export async function detailCheckRuleSpecial (params: any) {
  return request({
    url: `/qualityRule/detail`,
    method: 'get',
    params,
  })
}

/**
 * 质检规则配置特殊经销商删除详情接口
 */
export async function deleteCheckRuleSpecial (params: any) {
  return request({
    url: `/qualityRule/deleteQualityRule`,
    method: 'post',
    data: params
  })
}


/**
 * 质检规则配置特殊经销商删除详情接口
 */
export async function switchCheckRuleSpecial (params: any) {
  return request({
    url: `/qualityRule/switchOnOff`,
    method: 'post',
    data: params
  })
}


/**
 * 数据预处理默认load接口
 */
export const getPreProcessDefaultList = (params: any) => {
  return request({
    url: '/preProcess/defaultLoad',
    method: 'get',
    params
  });
};


/**
 * 数据预处理默认添加接口
 */
export async function addPreProcessDefault (params: any) {
  return request({
    url: `/preProcess/preRuleEdit`,
    method: 'post',
    data: params
  })
}

/**
 * 数据预处理默认修改接口
 */
export async function modifyPreProcessDefault (params: any) {
  return request({
    url: `/preProcess/preRuleEdit`,
    method: 'post',
    data: params
  })
}

/**
 * 数据预处理默认查看和配置detail接口
 */
export async function detailPreProcessDefault (params: any) {
  return request({
    url: `/preProcess/detail`,
    method: 'get',
    params,
  })
}

/**
 * 数据预处理默认删除详情接口
 */
export async function deletePreProcessDefault (params: any) {
  return request({
    url: `/preProcess/deletePreRule`,
    method: 'post',
    data: params
  })
}


/**
 * 数据预处理默认删除详情接口
 */
export async function switchPreProcessDefault (params: any) {
  return request({
    url: `/preProcess/switchOnOff`,
    method: 'post',
    data: params
  })
}


/**
 * 数据预处理默认load接口
 */
export const getPreProcessSpecialList = (params: any) => {
  return request({
    url: '/preProcess/specialLoad',
    method: 'post',
    data: params
  });
};


/**
 * 数据预处理默认添加接口
 */
export async function addPreProcessSpecial (params: any) {
  return request({
    url: `/preProcess/preRuleEdit`,
    method: 'post',
    data: params
  })
}

/**
 * 数据预处理默认修改接口
 */
export async function modifyPreProcessSpecial (params: any) {
  return request({
    url: `/preProcess/preRuleEdit`,
    method: 'post',
    data: params
  })
}

/**
 * 数据预处理默认查看和配置detail接口
 */
export async function detailPreProcessSpecial (params: any) {
  return request({
    url: `/preProcess/detail`,
    method: 'get',
    params,
  })
}

/**
 * 数据预处理默认删除详情接口
 */
export async function deletePreProcessSpecial (params: any) {
  return request({
    url: `/preProcess/deletePreRule`,
    method: 'post',
    data: params
  })
}


/**
 * 数据预处理默认删除详情接口
 */
export async function switchPreProcessSpecial (params: any) {
  return request({
    url: `/preProcess/switchOnOff`,
    method: 'post',
    data: params
  })
}

/**
 * 数据预处理默认删除dto接口
 */
export async function deletePreProcessDTOSDefault (params: any) {
  return request({
    url: `/preProcess/deleteFieldCharConvert`,
    method: 'post',
    data: params
  })
}