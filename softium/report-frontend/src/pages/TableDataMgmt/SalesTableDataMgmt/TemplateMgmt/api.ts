import request from '@/utils/request';
import {
  addTemplateModel,
  tableDataType,
  TemplateList,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/data';

/**
 * 查询所有字段
 * @param query
 */
export async function queryAllFields() {
  return request({
    method: 'GET',
    url: '/new-template/select-all-field',
  });
}

/**
 * 新建模板默认字段
 * @param query
 */
export async function getDefaultFields() {
  return request({
    method: 'GET',
    url: '/new-template/default-display',
  });
}

/** 批量写入
 * 查询所有字段
 * @param query
 */
export async function insertFields(query: {
  id?: string;
  data?: tableDataType[];
}) {
  return request({
    method: 'POST',
    url: '/new-template/batch-insert-field',
    data: query,
  });
}
/**
 * 模板列表查询
 * @param query
 */
export async function getTemplateList(query: TemplateList) {
  return request({
    method: 'POST',
    url: '/new-template/template-list',
    data: query,
  });
}

/**
 * 创建新建模板
 * @param query
 */
export async function addTemplate(query: addTemplateModel) {
  return request({
    method: 'POST',
    url: '/new-template/create-template',
    data: query,
  });
}

/**
 * 编辑模板 根据模板ID 获取模板内容
 * @param query
 */
export async function getTemplateDetails(query: { templateId: string }) {
  return request({
    method: 'GET',
    url: '/new-template/template-details',
    params: query,
  });
}
/**
 * 模板的名字 和 描述
 * @param query
 */
export async function editTemplate(query: TemplateList) {
  return request({
    method: 'POST',
    url: '/new-template/update-template',
    data: query,
  });
}
/**
 * 修改模板的内容
 * @param query
 */
export async function updateTemplate(query: tableDataType[]) {
  return request({
    method: 'POST',
    url: '/new-template/update-details',
    data: query,
  });
}
/**
 * 删除模板
 * @param query
 */
export async function delTemplate(query: { id: string }) {
  return request({
    method: 'POST',
    url: '/new-template/delete-template',
    data: query,
  });
}
/**
 * 下载模板
 * @param query
 */

export async function exportTemplate(query: { templateId: string }) {
  return request({
    method: 'GET',
    responseType: 'blob',
    url: '/new-template/download-template',
    params: query,
  });
}

/**
 * 导出字段详情查看所有字段的具体说明
 * @param query
 */
export async function exportFields() {
  return request({
    method: 'GET',
    responseType: 'blob',
    url: '/new-template/export-field',
  });
}
