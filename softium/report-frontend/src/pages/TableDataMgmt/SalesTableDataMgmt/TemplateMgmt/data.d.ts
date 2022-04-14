import React from 'react';

export interface TemplateList extends BaseModel {
  pageSize?: number;

  pageNo?: number;
  /**
   * 模板名称
   */
  templateName?: string;

  /**
   *描述
   */
  templateDescribe?: string;
  /**
   * 创建日期
   */
  createTime?: string;
  /**
   * 修改日期
   */
  updateTime?: string;
  /**
   * 修改人
   */
  updateByName?: string;
}

export type TreeDataType = {
  key?: string;
  title?: string;
  type?: string;
  fieldType?: string;
  children?: TreeDataType[];
};

export type tableDataType = {
  templateId?: string;
  id?: string;
  // key?: string;
  orders?: number;
  fieldName?: string;
  fieldCode?: string;
  fieldType?: string;
  customFieldName?: string;
  children?: tableDataType[];
};

export type fieldListType = {
  fieldCode?: string;
  fieldName?: string;
  fieldType?: string;
};

export interface addTemplateModel {
  templateName?: string;
  templateDescribe?: string;
}
