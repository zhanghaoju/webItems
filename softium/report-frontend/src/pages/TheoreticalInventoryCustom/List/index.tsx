import React, { Ref, RefObject, useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  TheoreticalInventory,
  TheoreticalInventoryQuery,
} from '@/pages/TheoreticalInventoryCustom/data';
import { Button, Card, message, Select, Space } from 'antd';
import { fetch, adjust, exportFile, getDynamicTable } from '../api';
import { useModel } from '@@/plugin-model/useModel';
import { history, useRequest } from 'umi';
import Adjust, { AdjustRef } from './Adjust';
import { DynamicTable, Table, VulcanFile } from '@vulcan/utils';
// import { PeriodBO } from '@/pages/TheoreticalInventoryCustom/models/TheoreticalInventoryModel';
import { DownloadOutlined } from '@ant-design/icons';
import { getDynamicColumns } from './dynamicTable';
import storage from '@/utils/storage';

const TheoreticalInventoryList: React.FC = () => {
  const { periodList, currentPeriod, updateData } = useModel(
    'TheoreticalInventoryCustom.TheoreticalInventoryModel',
  );

  const { pockets } = useModel('SalesAppeal.SalesAppealModel');

  // const { instDistributorLevelOption, productUnti } = pockets || {};

  const adjustRequest = useRequest(adjust, {
    manual: true,
    onSuccess: () => {
      message.success('调整成功');
      actionRef?.current?.reload();
    },
  });

  const exportRequest = useRequest(exportFile, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });

  useEffect(() => {
    updateData();
    let userInfo = storage.get('userInfo');
    getDynamicTable({
      tenantId: userInfo?.tenantId,
      code: 'Channel.Inventory.CustomBalance',
    }).then((res: { data: { columnList: any } }) => {
      setDynamicColumns(res?.data?.columnList);
    });
  }, []);

  const [query, setQuery] = useState<TheoreticalInventoryQuery>();
  const [dynamicColumns, setDynamicColumns] = useState<any>([]);
  const actionRef = useRef<ActionType>();

  const adjustRef = useRef<AdjustRef>();
  //拼接table的columns
  const dynamicJoinColumns = getDynamicColumns(dynamicColumns);
  const optionColumns: ProColumns<TheoreticalInventory> = {
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    render: (
      dom: any,
      entity: TheoreticalInventory,
      index: any,
      action: any,
    ) => (
      <Space>
        <a
          onClick={() => {
            history.push({
              pathname: '/custom-report/customBalance/detail',
              state: entity,
            });
          }}
        >
          查看
        </a>
        <a
          onClick={() => {
            adjustRef?.current?.show(entity);
          }}
        >
          调整期初库存
        </a>
      </Space>
    ),
  };
  //添加操作列
  if (dynamicJoinColumns?.length > 0) {
    dynamicJoinColumns.push(optionColumns);
  }
  // const columns: ProColumns<TheoreticalInventory>[] = [
  //   {
  //     title: '时间窗',
  //     key: 'periodId',
  //     hideInTable: true,
  //     renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
  //       return (
  //         <Select
  //           placeholder={'请选择'}
  //           style={{ width: '100%' }}
  //           options={periodList?.map((t: PeriodBO) => ({
  //             label: t?.name || '',
  //             value: t?.id || '',
  //           }))}
  //         />
  //       );
  //     },
  //   },
  //   {
  //     dataIndex: 'distributorLevel',
  //     title: '经销商级别',
  //     hideInTable: true,
  //     renderFormItem: (_, { type, defaultRender, ...rest }) => {
  //       return (
  //         <Select
  //           placeholder={'请选择'}
  //           allowClear={true}
  //           style={{ width: '100%' }}
  //           options={instDistributorLevelOption?.map(
  //             (t: { text: any; value: any }) => ({
  //               label: t?.text,
  //               value: t?.value,
  //             }),
  //           )}
  //         />
  //       );
  //     },
  //   },
  //   {
  //     dataIndex: 'institutionCode',
  //     title: '经销商编码',
  //     fixed: 'left',
  //   },
  //   {
  //     dataIndex: 'institutionName',
  //     title: '经销商名称',
  //   },
  //   {
  //     dataIndex: 'institutionProvince',
  //     title: '经销商省份',
  //     search: false,
  //   },
  //   {
  //     dataIndex: 'institutionCity',
  //     title: '经销商城市',
  //     search: false,
  //   },
  //   {
  //     dataIndex: 'productCode',
  //     title: '产品编码',
  //   },
  //   {
  //     dataIndex: 'productName',
  //     title: '产品名称',
  //   },
  //   {
  //     dataIndex: 'isAdjust',
  //     title: '是否调整',
  //     hideInTable: true,
  //     valueEnum: {
  //       0: {
  //         text: '否',
  //       },
  //       1: {
  //         text: '是',
  //       },
  //     },
  //   },
  //   {
  //     dataIndex: 'isDiff',
  //     title: '是否存在差异',
  //     hideInTable: true,
  //     valueEnum: {
  //       0: {
  //         text: '否',
  //       },
  //       1: {
  //         text: '是',
  //       },
  //     },
  //   },
  //   {
  //     dataIndex: 'productSpecification',
  //     title: '产品规格',
  //     search: false,
  //   },
  //   {
  //     dataIndex: 'unit',
  //     title: '单位',
  //     search: false,
  //     valueEnum: Object.fromEntries(
  //       productUnti?.map((t: { value: string; text: any }) => [
  //         t?.value,
  //         { text: t?.text },
  //       ]) || [],
  //     ),
  //   },
  //   {
  //     dataIndex: 'manufacturer',
  //     title: '生产厂家',
  //     search: false,
  //   },
  //   {
  //     dataIndex: 'price',
  //     title: '考核价',
  //     search: false,
  //   },
  //   {
  //     dataIndex: 'theoryBeginInventory',
  //     title: '理论期初库存(数量)',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     dataIndex: 'theoryBeginInventoryAmt',
  //     title: '理论期初库存(金额)',
  //     search: false,
  //     valueType: 'digit',
  //     tooltip: '公式：【考核价】*【数量】',
  //   },
  //   {
  //     dataIndex: 'fromInstSales',
  //     title: '上游销量',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     dataIndex: 'selfSales',
  //     title: '自身销量',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     dataIndex: 'beforeAdjustTheoryEndInventory',
  //     title: '理论期末库存（调整前数量）',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     dataIndex: 'beforeAdjustTheoryEndInventoryAmt',
  //     title: '理论期末库存（调整前金额）',
  //     search: false,
  //     valueType: 'digit',
  //     tooltip: '公式：【考核价】*【数量】',
  //   },
  //   {
  //     dataIndex: 'afterAdjustTheoryEndInventory',
  //     title: '理论期末库存（调整后数量）',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     dataIndex: 'afterAdjustTheoryEndInventoryAmt',
  //     title: '理论期末库存（调整后金额）',
  //     search: false,
  //     valueType: 'digit',
  //     tooltip: '公式：【考核价】*【数量】',
  //   },
  //   {
  //     dataIndex: 'actualEndInventory',
  //     title: '期末实际库存（数量）',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     dataIndex: 'actualEndInventoryAmt',
  //     title: '期末实际库存（金额）',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     dataIndex: 'differenceVal',
  //     title: '差异值（数量）',
  //     search: false,
  //     valueType: 'digit',
  //     sorter: true,
  //   },
  //   {
  //     dataIndex: 'differenceRatio',
  //     title: '差异比',
  //     search: false,
  //     render: (dom, entity, index) =>
  //       (entity?.differenceRatio && `${entity?.differenceRatio * 100}%`) || '-',
  //     tooltip:
  //       '公式（均为数量）：【期末理论库存（调整后）- 实际库存】/【理论库存】',
  //   },
  //   {
  //     dataIndex: 'differenceAmtVal',
  //     title: '差异值（金额）',
  //     search: false,
  //     sorter: true,
  //     valueType: 'digit',
  //     tooltip:
  //       '公式：【期末理论库存（调整后）- 期末实际库存】（均为数量）*【考核价】',
  //   },
  //   {
  //     dataIndex: 'adjustVal',
  //     title: '调整量',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     dataIndex: 'adjustReason',
  //     title: '调整原因',
  //     search: false,
  //   },
  //   {
  //     dataIndex: 'updateByName',
  //     title: '调整人',
  //     search: false,
  //   },
  //   {
  //     dataIndex: 'updateTime',
  //     title: '调整时间',
  //     valueType: 'dateTime',
  //     search: false,
  //   },
  //   {
  //     dataIndex: 'supplierName',
  //     title: '供应商名称',
  //     search: false,
  //     hideInTable: true,
  //   },
  //   {
  //     dataIndex: 'prodSfPrice',
  //     title: '一级商业采购价',
  //     search: false,
  //     hideInTable: true,
  //     valueType: 'digit',
  //   },
  //   {
  //     dataIndex: 'sfTheoryBeginInventoryAmt',
  //     title: '期初库存（金额）',
  //     search: false,
  //     valueType: 'digit',
  //     tooltip: '公式：【一级商业采购价】*【期初库存（数量）】',
  //     hideInTable: true,
  //   },
  //   {
  //     dataIndex: 'supplierAmt',
  //     title: '本月采购(金额)',
  //     search: false,
  //     valueType: 'digit',
  //     tooltip: '公式：【一级经销商采购价】*【本月采购(数量)】',
  //     hideInTable: true,
  //   },
  //
  //   {
  //     dataIndex: 'salesAmt',
  //     title: '本月销售(金额)',
  //     search: false,
  //     valueType: 'digit',
  //     tooltip: '公式：【一级经销商采购价】*【本月销售(数量)】',
  //     hideInTable: true,
  //   },
  //   {
  //     dataIndex: 'sfBeforeAdjustTheoryEndInventoryAmt',
  //     title: '调整前-理论期末库存（金额）',
  //     search: false,
  //     valueType: 'digit',
  //     tooltip: '公式：【一级商采购价】*【调整前-理论期末库存（数量）】',
  //     hideInTable: true,
  //   },
  //   {
  //     dataIndex: 'sfActualEndInventoryAmt',
  //     title: '实际库存（金额）',
  //     search: false,
  //     valueType: 'digit',
  //     hideInTable: true,
  //   },
  //   {
  //     dataIndex: 'sfDifferenceAmtVal',
  //     title: '理论与实际差异（金额）',
  //     search: false,
  //     valueType: 'digit',
  //     tooltip: '公式：【一级商采购价】*【理论与实际差异（数量）】',
  //     hideInTable: true,
  //   },
  //   {
  //     dataIndex: 'sfAfterAdjustTheoryEndInventoryAmt',
  //     title: '调整后-理论期末库存（金额）',
  //     search: false,
  //     hideInTable: true,
  //     valueType: 'digit',
  //     tooltip: '公式：【一级商采购价】*【调整后-理论期末库存（数量）】',
  //   },
  //   {
  //     title: '操作',
  //     valueType: 'option',
  //     fixed: 'right',
  //     render: (dom, entity, index, action) => (
  //       <Space>
  //         <a
  //           onClick={() => {
  //             history.push({
  //               pathname: '/channel/inventory-analysis/customBalance/detail',
  //               state: entity,
  //             });
  //           }}
  //         >
  //           查看
  //         </a>
  //         <a
  //           onClick={() => {
  //             adjustRef?.current?.show(entity);
  //           }}
  //         >
  //           调整期初库存
  //         </a>
  //       </Space>
  //     ),
  //   },
  // ];
  if (periodList && periodList.length > 0 && currentPeriod) {
    return (
      <Card>
        <Table<TheoreticalInventory, TheoreticalInventoryQuery>
          code={'Channel.Inventory.CustomBalance'}
          //sticky={true}
          form={{
            initialValues: {
              periodId: currentPeriod?.id,
            },
          }}
          search={{
            labelWidth: 'auto',
          }}
          beforeSearchSubmit={params => {
            setQuery(params);
            return params;
          }}
          headerTitle={
            <Button
              type={'primary'}
              onClick={() => exportRequest.run(query || {})}
              loading={exportRequest.loading}
            >
              <DownloadOutlined />
              导出
            </Button>
          }
          scroll={{ x: 3500 }}
          request={async (params, sort) => {
            const { current, ...query } = params;
            const _query: TheoreticalInventoryQuery & Sort = {
              ...query,
            };
            _query.pageNo = current;
            _query.periodId = _query?.periodId
              ? _query?.periodId
              : currentPeriod?.id;
            _query.criteria = {
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
            const res = await fetch(_query);
            return {
              data: res?.data?.list,
              total: res?.data?.total,
            };
          }}
          tableLayout={'fixed'}
          columns={dynamicJoinColumns}
          rowKey={'id'}
          actionRef={actionRef}
        />
        <Adjust
          actionRef={adjustRef}
          onSubmit={adjustRequest.run}
          submitting={adjustRequest.loading}
        />
      </Card>
    );
  }
  return null;
};

export default TheoreticalInventoryList;
