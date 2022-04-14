import React, { useEffect, useState } from 'react';
import {
  TreeDataType,
  tableDataType,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/data';
import {
  queryAllFields,
  getDefaultFields,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/api';
import { listTransformTree } from '@/pages/TableDataMgmt/SalesTableDataMgmt/utils';

export default function useTemplateMgmtModel() {
  //穿梭框的树结构数据
  const [treeData, setTreeData] = useState<TreeDataType[]>([]);

  //穿梭框的树结构的默认字段
  const [defaultFields, setDefaultFields] = useState<string[]>([]);

  //穿梭框的选中的值
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  //可以拖动的表格的树结构数据
  const [dragTreeData, setDragTreeData] = useState<tableDataType[]>([]);

  //编辑模板 获取原来模板的内容
  const [editTempList, setEditTempList] = useState<tableDataType[]>([]);

  //获取穿梭框的树结构数据
  const fieldListRequest = () => {
    queryAllFields().then(res => {
      let fieldsTree = listTransformTree(res?.data);
      setTreeData(fieldsTree);
    });
  };
  //获取穿梭框的树结构数据
  const defaultFieldsRequest = () => {
    getDefaultFields().then(res => {
      let codes = [];
      for (const item of res?.data) {
        codes.push(item.fieldCode);
      }
      setDefaultFields(codes);
    });
  };
  useEffect(() => {
    fieldListRequest();
    defaultFieldsRequest();
  }, []);
  return {
    treeData,
    targetKeys,
    setTargetKeys,
    dragTreeData,
    setDragTreeData,
    editTempList,
    setEditTempList,
    defaultFields,
  };
}
