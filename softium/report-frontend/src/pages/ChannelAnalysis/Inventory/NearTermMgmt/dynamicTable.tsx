import { Badge, Select, Space, Tag, TreeSelect } from 'antd';
import React, { useState } from 'react';
import expandTree from '@/utils/expandTree';
import { ProColumns } from '@ant-design/pro-table';
import { NearTermMgmt } from '@/pages/ChannelAnalysis/Inventory/NearTermMgmt/data';
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
): ProColumns<NearTermMgmt>[] {
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');
  const { windowTimeOption, productOption, instDistributorLevelOption } =
    pockets || {};
  const columnsObj: any = {
    periodId: {
      title: '时间窗',
      key: 'periodId',
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
        if (!form.getFieldValue('periodId')) {
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
              form.resetFields(['teryName']);
            }}
            options={windowTimeOption?.map((t: { text: any; value: any }) => ({
              label: t?.text,
              value: t?.value,
            }))}
          />
        );
      },
    },
    parentTeryName: {
      title: '上级辖区',
      dataIndex: 'parentTeryName',
      fixed: 'left',
      width: 150,
      search: false,
    },
    teryName: {
      title: '辖区',
      dataIndex: 'teryName',
      key: 'teryName',
      formItemProps: {
        dependencies: ['periodId'],
      },
      renderFormItem: (
        _: any,
        { type, defaultRender, ...rest }: any,
        form: { getFieldValue: (arg0: string) => any },
      ) => {
        const currentWindowTime = form.getFieldValue('periodId');
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
    distributorLevel: {
      title: '经销商级别',
      dataIndex: 'distributorLevel',
      key: 'distributorLevel',
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
    batchType: {
      title: '批号类型',
      dataIndex: 'batchType',
      renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
        return (
          <Select
            placeholder={'请选择'}
            mode={'multiple'}
            maxTagCount={2}
            allowClear={true}
            style={{ width: '100%' }}
            options={[
              { label: '6个月内', value: '6个月内' },
              { label: '9个月内', value: '9个月内' },
              { label: '1年内', value: '1年内' },
              { label: '1年以上', value: '1年以上' },
              { label: '已过期', value: '已过期' },
              { label: '无', value: '无' },
            ]}
          />
        );
      },
    },
    prodQuantity: {
      title: '库存量',
      dataIndex: 'prodQuantity',
      search: false,
      valueType: 'digit',
    },
    productAmount: {
      title: '库存金额',
      dataIndex: 'productAmount',
      valueType: 'digit',
      search: false,
    },
    yearOverYear: {
      title: '库存同比',
      dataIndex: 'yearOverYear',
      search: false,
      // valueType: 'digit',
      renderText: (text: any) => {
        return <span>{text ? (text * 100).toFixed(3) + '%' : '-'}</span>;
      },
    },
    linkRelativeRatio: {
      title: '库存环比',
      dataIndex: 'linkRelativeRatio',
      search: false,
      // valueType: 'digit',
      renderText: (text: any) => {
        return <span>{text ? (text * 100).toFixed(3) + '%' : '-'}</span>;
      },
    },
  };
  let dynamicJoinColumns: ProColumns<NearTermMgmt>[] = [];
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
