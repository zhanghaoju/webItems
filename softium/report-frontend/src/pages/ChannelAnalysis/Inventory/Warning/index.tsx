import React, { useEffect } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import {
  InventoryWarning,
  InventoryWarningQuery,
} from '@/pages/ChannelAnalysis/Inventory/Warning/data';
import { fetch } from './api';
import { useModel } from 'umi';
import { TreeSelect } from 'antd';
import expandTree from '@/utils/expandTree';
import { Table } from '@vulcan/utils';

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

export default () => {
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');

  const { timeWindowTree, updateTimeWindowTree } = useModel(
    'ChannelAnalysis.Inventory.useInventoryWarningModel',
  );
  useEffect(() => {
    updateTimeWindowTree();
  }, []);

  const {
    regionTreeOption,
    productOption,
    productUnti,
    instDistributorLevelOption,
  } = pockets || {};

  const columns: ProColumns<InventoryWarning>[] = [
    {
      title: '时间窗',
      dataIndex: 'periodIds',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
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
              timeWindowTree.map(t => ({
                title: t?.financialName,
                value: t?.id,
                children: t?.periodVOList?.map(
                  (s: { periodName: any; id: any }) => ({
                    title: s?.periodName,
                    value: s?.id,
                  }),
                ),
              }))
            }
            treeDefaultExpandAll
          />
        );
      },
    },
    {
      title: '经销商',
      dataIndex: 'institution',
      hideInTable: true,
      fieldProps: {
        placeholder: '可输入名称/编码',
      },
    },
    {
      title: '经销商省市',
      dataIndex: 'citys',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
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
    {
      title: '产品',
      key: 'products',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
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
    {
      title: '经销商编码',
      dataIndex: 'institutionCode',
      search: false,
    },
    {
      title: '经销商名称',
      dataIndex: 'institutionName',
      search: false,
    },
    {
      title: '经销商级别',
      dataIndex: 'distributorLevel',
      search: false,
      valueEnum: Object.fromEntries(
        instDistributorLevelOption?.map((t: { value: string; text: any }) => [
          t?.value,
          { text: t?.text },
        ]) || [],
      ),
    },
    {
      title: '经销商省份',
      dataIndex: 'institutionProvince',
      search: false,
    },
    {
      title: '经销商城市',
      dataIndex: 'institutionCity',
      search: false,
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      search: false,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      search: false,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpecification',
      search: false,
    },
    {
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
    {
      title: '实际库存数量',
      dataIndex: 'actualEndInventory',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
    {
      title: '理论库存数量',
      dataIndex: 'afterAdjustTheoryEndInventory',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
    {
      title: '月均销售数量',
      dataIndex: 'quantity',
      search: false,
      valueType: 'digit',
    },
    {
      title: '库存天数（实际）',
      dataIndex: 'actInventoryDays',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
    {
      title: '库存天数(理论)',
      dataIndex: 'theoryInventoryDays',
      search: false,
      valueType: 'digit',
      sorter: true,
    },
    {
      title: '实际库存天期异常',
      dataIndex: 'actStatus',
      valueEnum: statusEnum,
    },
    {
      title: '理论库存天期异常',
      dataIndex: 'theoryStatus',
      valueEnum: statusEnum,
    },
  ];

  return (
    <>
      <Table<InventoryWarning, InventoryWarningQuery>
        code={'Channel.Inventory.Warning'}
        columns={columns}
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 3000 }}
        tableLayout={'fixed'}
        rowKey={'id'}
        request={async (params, sort) => {
          const { current, ...query } = params;
          query.pageNo = current;
          query.criteria = {
            sortProperties:
              sort &&
              Object.keys(sort).map(key => ({
                propertyName: key,
                sort:
                  sort[key] === 'ascend'
                    ? 'ASC'
                    : sort[key] === 'descend'
                    ? 'DESC'
                    : undefined,
              })),
          };
          return fetch(query);
        }}
      />
    </>
  );
};
