import { Space, TreeSelect } from 'antd';
import React, { useState } from 'react';
import expandTree from '@/utils/expandTree';
import { ProColumns } from '@ant-design/pro-table';
import { InventoryWarning } from './data';
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
  showDetail: (entity: any) => void,
): ProColumns<InventoryWarning>[] {
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');
  const {
    regionTreeOption,
    productOption,
    productUnti,
    instDistributorLevelOption,
  } = pockets || {};
  const { timeWindowTree } = useModel(
    'ChannelAnalysis.Inventory.useInventoryWarningModel',
  );

  const columnsObj: any = {
    periodIds: {
      title: '时间窗',
      dataIndex: 'periodIds',
      hideInTable: true,
      renderFormItem: (
        _: any,
        { type, defaultRender, ...rest }: any,
        form: any,
      ) => {
        if (type === 'form') {
          return null;
        }
        return (
          <TreeSelect
            allowClear
            treeCheckable={true}
            style={{ width: '100%' }}
            placeholder={'请选择'}
            maxTagCount={2}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            treeData={
              timeWindowTree &&
              timeWindowTree.map(
                (t: {
                  financialName: any;
                  id: any;
                  periodVOList: { periodName: any; id: any }[];
                }) => ({
                  title: t?.financialName,
                  value: t?.id,
                  children: t?.periodVOList?.map(
                    (s: { periodName: any; id: any }) => ({
                      title: s?.periodName,
                      value: s?.id,
                    }),
                  ),
                }),
              )
            }
            treeDefaultExpandAll
          />
        );
      },
    },
    institution: {
      title: '经销商',
      dataIndex: 'institution',
      hideInTable: true,
      fieldProps: {
        placeholder: '可输入名称/编码',
      },
    },
    citys: {
      title: '经销商省市',
      dataIndex: 'citys',
      hideInTable: true,
      renderFormItem: (
        _: any,
        { type, defaultRender, ...rest }: any,
        form: any,
      ) => {
        if (type === 'form') {
          return null;
        }
        return (
          <TreeSelect
            allowClear
            treeCheckable={true}
            style={{ width: '100%' }}
            placeholder={'请选择'}
            maxTagCount={2}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            treeData={
              regionTreeOption &&
              regionTreeOption.map(
                (t: {
                  text: any;
                  value: any;
                  children: {
                    map: (
                      arg0: (s: {
                        text: any;
                        value: any;
                      }) => { title: any; value: any },
                    ) => undefined;
                  };
                }) => {
                  const ret = {
                    title: t?.text,
                    value: t?.value,
                    children: undefined,
                  };
                  if (t?.children) {
                    ret.children = t?.children.map(
                      (s: { text: any; value: any }) => ({
                        title: s?.text,
                        value: s?.value,
                      }),
                    );
                  }
                  return ret;
                },
              )
            }
            treeDefaultExpandAll
          />
        );
      },
    },
    products: {
      title: '产品',
      key: 'products',
      hideInTable: true,
      renderFormItem: (
        _: any,
        { type, defaultRender, ...rest }: any,
        form: any,
      ) => {
        const itemFormat = (item: {
          specification?: string | null | undefined;
          [key: string]: any;
        }) => {
          if (item?.specification)
            return `${item?.name}(${item?.specification})`;
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
    unit: {
      title: '产品单位',
      dataIndex: 'unit',
      search: false,
      valueEnum: Object.fromEntries(
        productUnti?.map((t: { value: string; text: any }) => [
          t?.value,
          { text: t?.text },
        ]) || [],
      ),
    },
    distributorLevel: {
      title: '商业单位级别',
      dataIndex: 'distributorLevel',
      search: false,
      valueEnum: Object.fromEntries(
        instDistributorLevelOption?.map((t: { value: string; text: any }) => [
          t?.value,
          { text: t?.text },
        ]) || [],
      ),
    },
    actualEndInventory: {
      title: '实际库存数量',
      dataIndex: 'actualEndInventory',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
    afterAdjustTheoryEndInventory: {
      title: '理论库存数量',
      dataIndex: 'afterAdjustTheoryEndInventory',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
    quantity: {
      title: '月均销售数量',
      dataIndex: 'quantity',
      search: false,
      valueType: 'digit',
    },
    actInventoryDays: {
      title: '库存天数（实际）',
      dataIndex: 'actInventoryDays',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
    theoryInventoryDays: {
      title: '库存天数(理论)',
      dataIndex: 'theoryInventoryDays',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
    actStatus: {
      title: '实际库存天期异常',
      dataIndex: 'actStatus',
      valueEnum: statusEnum,
    },
    theoryStatus: {
      title: '理论库存天期异常',
      dataIndex: 'theoryStatus',
      valueEnum: statusEnum,
    },
    option: {
      dispName: '操作',
      name: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (
        dom: any,
        entity: { id: React.Key | null | undefined },
        index: any,
        action: any,
      ) => (
        <Space>
          <a
            key={entity?.id}
            onClick={() => {
              showDetail(entity);
            }}
          >
            查看批号明细
          </a>
        </Space>
      ),
    },
  };
  let dynamicJoinColumns: ProColumns<InventoryWarning>[] = [];
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
