import { Badge, Select, Space, Tag, TreeSelect } from 'antd';
import React, { useState } from 'react';
import expandTree from '@/utils/expandTree';
import { ProColumns } from '@ant-design/pro-table';
import { PurchaseSaleAnalysis } from './data';
import { useModel } from '@@/plugin-model/useModel';

const statusEnum = {
  normal: {
    text: '正常',
    status: 'Success',
  },
  abnormal: {
    text: '异常',
    status: 'Warning',
  },
};

/**
 * [getDynamicColumns 拼接动态表格列]
 * @return {[type]} []
 */
export function getDynamicColumns(
  dynamicColumns: any[],
): ProColumns<PurchaseSaleAnalysis>[] {
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');
  const { windowTimeOption, productOption, instDistributorLevelOption } =
    pockets || {};
  const columnsObj: any = {
    windowTime: {
      title: '时间窗',
      key: 'windowTime',
      hideInTable: true,
      renderFormItem: (
        _: any,
        { type, defaultRender, ...rest }: any,
        form: {
          getFieldValue: (arg0: string) => any;
          setFieldsValue: (arg0: { windowTime: any }) => void;
          resetFields: (arg0: string[]) => void;
        },
      ) => {
        if (!form.getFieldValue('windowTime')) {
          form.setFieldsValue({
            windowTime:
              windowTimeOption &&
              windowTimeOption[0] &&
              windowTimeOption[0].value,
          });
        }
        return (
          <Select
            placeholder={'请选择'}
            style={{ width: '100%' }}
            onSelect={t => {
              form.resetFields(['fromTeryName']);
            }}
            options={windowTimeOption?.map((t: { text: any; value: any }) => ({
              label: t?.text,
              value: t?.value,
            }))}
          />
        );
      },
    },
    fromTeryName: {
      title: '辖区',
      dataIndex: 'fromTeryName',
      key: 'fromTeryName',
      formItemProps: {
        dependencies: ['windowTime'],
      },
      renderFormItem: (
        _: any,
        { type, defaultRender, ...rest }: any,
        form: { getFieldValue: (arg0: string) => any },
      ) => {
        const currentWindowTime = form.getFieldValue('windowTime');
        const jurisdictionOptions = windowTimeOption?.find(
          (t: { value: any }) => t?.value === currentWindowTime,
        )?.children;
        const formatFn = (item: {
          name?: string;
          staffName?: string;
          [key: string]: any;
        }) => {
          return `${item?.name}(${item?.staffName || '空岗'})`;
        };
        const treeData = expandTree(
          jurisdictionOptions,
          'children',
          'name',
          'id',
          formatFn,
        );
        return (
          <TreeSelect
            allowClear
            treeCheckable={true}
            style={{ width: '100%' }}
            placeholder={'请选择'}
            maxTagCount={2}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            treeData={treeData}
            // @ts-ignore
            filterTreeNode={(input, treeNode: MyTreeNode) => {
              return (
                treeNode?.title?.indexOf(input) > -1 ||
                treeNode?.value?.indexOf(input) > -1 ||
                treeNode?.code?.indexOf(input) > -1
              );
            }}
          />
        );
      },
    },
    fromTeryParentName: {
      title: '上级辖区',
      dataIndex: 'fromTeryParentName',
      fixed: 'left',
      width: 150,
      search: false,
    },
    distributorName: {
      title: '经销商名称',
      dataIndex: 'distributorName',
      key: 'distributorName',
      width: 170,
    },
    distributorLevelCode: {
      title: '经销商级别',
      dataIndex: 'distributorLevelCode',
      key: 'distributorLevelCode',
      valueEnum: Object.fromEntries(
        instDistributorLevelOption?.map((t: { value: string; text: any }) => [
          t?.value,
          { text: t?.text },
        ]) || [],
      ),
      renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
        return (
          <Select
            placeholder={'请选择'}
            mode={'multiple'}
            maxTagCount={2}
            allowClear={true}
            style={{ width: '100%' }}
            options={instDistributorLevelOption?.map(
              (t: { text: any; value: any }) => ({
                label: t?.text,
                value: t?.value,
              }),
            )}
          />
        );
      },
    },
    prodName: {
      title: '产品名称',
      dataIndex: 'prodName',
      key: 'prodName',
      renderFormItem: (
        _: any,
        { type, defaultRender, ...rest }: any,
        form: any,
      ) => {
        const itemFormat = (item: {
          specification?: string | null | undefined;
          [key: string]: any;
        }) => {
          let detail = '';
          if (item?.specification) {
            detail = item?.specification;
          }
          if (item?.manufacturer) {
            if (detail) {
              detail = `${detail},${item?.manufacturer}`;
            } else {
              detail = item?.manufacturer;
            }
          }
          if (detail) return `${item?.name}(${detail})`;
          return item?.name;
        };
        const treeData = expandTree<{
          specification?: string | null | undefined;
          [key: string]: any;
        }>(productOption, 'children', 'name', 'code', itemFormat);
        return (
          <TreeSelect
            allowClear
            treeCheckable={true}
            style={{ width: '100%' }}
            placeholder={'请选择'}
            // @ts-ignore
            filterTreeNode={(input, treeNode: MyTreeNode) => {
              return (
                treeNode?.title?.indexOf(input) > -1 ||
                treeNode?.value?.indexOf(input) > -1
              );
            }}
            maxTagCount={2}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            treeData={treeData}
          />
        );
      },
    },
    prodSfPrice: {
      title: '产品单价',
      dataIndex: 'prodSfPrice',
      search: false,
      valueType: 'digit',
    },
    productBatch: {
      title: '批号',
      dataIndex: 'productBatch',
      key: 'productBatch',
      renderText: (text: any) => <span> {text ? text : '无'}</span>,
    },
    buyQuantity: {
      title: '提货量',
      dataIndex: 'buyQuantity',
      search: false,
      valueType: 'digit',
    },
    saleQuantity: {
      title: '分销量',
      dataIndex: 'saleQuantity',
      search: false,
      valueType: 'digit',
    },
    saleBuyCutQuantity: {
      title: '购销量差',
      dataIndex: 'saleBuyCutQuantity',
      valueEnum: statusEnum,
      key: 'saleBuyCutQuantity',
      renderText: (text: number) => (
        <span> {text < 500 ? text : <Tag color="red">{text}</Tag>}</span>
      ),
    },
    saleBuyCutAmount: {
      title: '涉及金额',
      dataIndex: 'saleBuyCutAmount',
      search: false,
      valueType: 'digit',
    },
    buyQuantityAll: {
      title: '累计销售量',
      dataIndex: 'buyQuantityAll',
      search: false,
      valueType: 'digit',
    },
    salequantityAll: {
      title: '累计购进量',
      dataIndex: 'salequantityAll',
      search: false,
      valueType: 'digit',
    },
  };
  let dynamicJoinColumns: ProColumns<PurchaseSaleAnalysis>[] = [];
  if (!dynamicColumns) {
    return dynamicJoinColumns;
  }
  // 根据dispOrder进行排序
  dynamicColumns?.sort((a: any, b: any) => {
    return a.dispOrder - b.dispOrder;
  });
  for (let item of dynamicColumns) {
    let optional = item?.optional ? JSON.parse(item?.optional) : {};
    if (columnsObj.hasOwnProperty(item.name)) {
      let col: any = { ...columnsObj[item.name] };
      col.title = item.dispName;
      col.dataIndex = item.name;
      col.hideInTable = optional.hideInTable;
      col.search = !optional.hideInSearch;
      dynamicJoinColumns.push(col);
    } else {
      dynamicJoinColumns.push({
        title: item.dispName,
        dataIndex: item.name,
        hideInTable: optional.hideInTable,
        search: !optional.hideInSearch ? undefined : false,
      });
    }
  }
  return dynamicJoinColumns;
}
