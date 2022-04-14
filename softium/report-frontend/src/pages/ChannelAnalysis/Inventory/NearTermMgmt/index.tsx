import React, { useEffect, useState, useRef } from 'react';
import { Button, FormInstance, Select, Space, TreeSelect } from 'antd';
import { Table, VulcanFile } from '@vulcan/utils';
import { fetch, exp } from '@/pages/ChannelAnalysis/Inventory/NearTermMgmt/api';
import { useModel } from '@@/plugin-model/useModel';
import storage from '@/utils/storage';
import { getDynamicTable } from '@/services/global';
import { getDynamicColumns } from '@/pages/ChannelAnalysis/Inventory/NearTermMgmt/dynamicTable';
import {
  NearTermMgmt,
  NearTermMgmtQuery,
} from '@/pages/ChannelAnalysis/Inventory/NearTermMgmt/data';
import { useRequest } from '@@/plugin-request/request';

export default () => {
  const exportRequest = useRequest(exp, {
    manual: true,
    formatResult: res => res,
    onSuccess: data => {
      VulcanFile.export(data);
    },
  });
  const [dynamicColumns, setDynamicColumns] = useState<any>([]);
  let userInfo = storage.get('userInfo');
  const ref = useRef<FormInstance>();
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');
  const { windowTimeOption } = pockets || {};
  const [query, setQuery] = useState<NearTermMgmt>();

  useEffect(() => {
    getDynamicTable({
      tenantId: userInfo?.tenantId,
      code: 'Customer.Inventory.Mgmt',
    }).then((res: { data: { columnList: any } }) => {
      setDynamicColumns(res?.data?.columnList);
    });
  }, []);
  // useEffect(() => {
  //   let periodId =
  //     windowTimeOption && windowTimeOption[0] && windowTimeOption[0].value;
  //   if (ref.current) {
  //     ref.current.setFieldsValue({
  //       periodId: periodId,
  //     });
  //   }
  //   setQuery({
  //     ...query,
  //     ...{ periodId },
  //     ...{ tenantId: userInfo?.tenantId },
  //   });
  // }, [windowTimeOption]);
  const dynamicJoinColumns = getDynamicColumns(dynamicColumns);

  // const columns: ProColumns<NearTermMgmt>[] = [
  //   {
  //     title: '时间窗',
  //     key: 'periodId',
  //     hideInTable: true,
  //     renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
  //       return (
  //         <Select
  //           placeholder={'请选择'}
  //           style={{ width: '100%' }}
  //           onSelect={t => {
  //             form.resetFields(['jurisdiction']);
  //           }}
  //           options={windowTimeOption?.map((t: { text: any; value: any }) => ({
  //             label: t?.text,
  //             value: t?.value,
  //           }))}
  //         />
  //       );
  //     },
  //   },
  //   {
  //     title: '上级辖区',
  //     key: 'parentTeryName',
  //     dataIndex: 'parentTeryName',
  //     formItemProps: {
  //       dependencies: ['periodId'],
  //     },
  //     renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
  //       const currentWindowTime = form.getFieldValue('periodId');
  //       const jurisdictionOptions = windowTimeOption?.find(
  //         (t: { value: any }) => t?.value === currentWindowTime,
  //       )?.children;
  //       const formatFn = (item: {
  //         name?: string;
  //         staffName?: string;
  //         [key: string]: any;
  //       }) => {
  //         return `${item?.name}(${item?.staffName || '空岗'})`;
  //       };
  //       const treeData = expandTree(
  //         jurisdictionOptions,
  //         'children',
  //         'name',
  //         'id',
  //         formatFn,
  //       );
  //       return (
  //         <TreeSelect
  //           allowClear
  //           treeCheckable={true}
  //           style={{ width: '100%' }}
  //           placeholder={'请选择'}
  //           maxTagCount={2}
  //           dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
  //           showCheckedStrategy={TreeSelect.SHOW_ALL}
  //           treeData={treeData}
  //           // @ts-ignore
  //           filterTreeNode={(input, treeNode: MyTreeNode) => {
  //             return (
  //               treeNode?.title?.indexOf(input) > -1 ||
  //               treeNode?.value?.indexOf(input) > -1 ||
  //               treeNode?.code?.indexOf(input) > -1
  //             );
  //           }}
  //         />
  //       );
  //     },
  //   },
  //   {
  //     title: '辖区',
  //     dataIndex: 'teryName',
  //     key: 'teryName',
  //     formItemProps: {
  //       dependencies: ['periodId'],
  //     },
  //     renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
  //       const currentWindowTime = form.getFieldValue('periodId');
  //       const jurisdictionOptions = windowTimeOption?.find(
  //         (t: { value: any }) => t?.value === currentWindowTime,
  //       )?.children;
  //       const formatFn = (item: {
  //         name?: string;
  //         staffName?: string;
  //         [key: string]: any;
  //       }) => {
  //         return `${item?.name}(${item?.staffName || '空岗'})`;
  //       };
  //       const treeData = expandTree(
  //         jurisdictionOptions,
  //         'children',
  //         'name',
  //         'id',
  //         formatFn,
  //       );
  //       return (
  //         <TreeSelect
  //           allowClear
  //           treeCheckable={true}
  //           style={{ width: '100%' }}
  //           placeholder={'请选择'}
  //           maxTagCount={2}
  //           dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
  //           showCheckedStrategy={TreeSelect.SHOW_ALL}
  //           treeData={treeData}
  //           // @ts-ignore
  //           filterTreeNode={(input, treeNode: MyTreeNode) => {
  //             return (
  //               treeNode?.title?.indexOf(input) > -1 ||
  //               treeNode?.value?.indexOf(input) > -1 ||
  //               treeNode?.code?.indexOf(input) > -1
  //             );
  //           }}
  //         />
  //       );
  //     },
  //   },
  //   {
  //     title: '经销商编码',
  //     dataIndex: 'distributorCode',
  //     search: false,
  //   },
  //   {
  //     title: '经销商名称',
  //     dataIndex: 'distributorName',
  //     key: 'distributorName',
  //   },
  //   {
  //     title: '经销商级别',
  //     dataIndex: 'distributorLevel',
  //     key: 'distributorLevel',
  //     valueEnum: Object.fromEntries(
  //       instDistributorLevelOption?.map((t: { value: string; text: any }) => [
  //         t?.value,
  //         { text: t?.text },
  //       ]) || [],
  //     ),
  //     renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
  //       return (
  //         <Select
  //           placeholder={'请选择'}
  //           mode={'multiple'}
  //           maxTagCount={2}
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
  //     title: '产品编码',
  //     dataIndex: 'prodCode',
  //     search: false,
  //   },
  //   {
  //     title: '产品名称',
  //     dataIndex: 'prodName',
  //     key: 'prodName',
  //     renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
  //       const itemFormat = (item: {
  //         specification?: string | null | undefined;
  //         [key: string]: any;
  //       }) => {
  //         let detail = '';
  //         if (item?.specification) {
  //           detail = item?.specification;
  //         }
  //         if (item?.manufacturer) {
  //           if (detail) {
  //             detail = `${detail},${item?.manufacturer}`;
  //           } else {
  //             detail = item?.manufacturer;
  //           }
  //         }
  //         if (detail) return `${item?.name}(${detail})`;
  //         return item?.name;
  //       };
  //       const treeData = expandTree<{
  //         specification?: string | null | undefined;
  //         [key: string]: any;
  //       }>(productOption, 'children', 'name', 'code', itemFormat);
  //       return (
  //         <TreeSelect
  //           allowClear
  //           treeCheckable={true}
  //           style={{ width: '100%' }}
  //           placeholder={'请选择'}
  //           // @ts-ignore
  //           filterTreeNode={(input, treeNode: MyTreeNode) => {
  //             return (
  //               treeNode?.title?.indexOf(input) > -1 ||
  //               treeNode?.value?.indexOf(input) > -1
  //             );
  //           }}
  //           maxTagCount={2}
  //           dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
  //           showCheckedStrategy={TreeSelect.SHOW_ALL}
  //           treeData={treeData}
  //         />
  //       );
  //     },
  //   },
  //   {
  //     title: '产品规格',
  //     dataIndex: 'prodSpec',
  //     search: false,
  //   },
  //   {
  //     title: '产品单价',
  //     dataIndex: 'prodSfPrice',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     title: '批号',
  //     dataIndex: 'productBatch',
  //     search: false,
  //   },
  //   {
  //     title: '生产年月',
  //     dataIndex: 'productionDateYm',
  //     search: false,
  //   },
  //   {
  //     title: '剩余到期月份',
  //     dataIndex: 'remainingMaturityMonth',
  //     search: false,
  //   },
  //   {
  //     title: '批号类型',
  //     dataIndex: 'batchType',
  //     renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
  //       return (
  //         <Select
  //           placeholder={'请选择'}
  //           mode={'multiple'}
  //           maxTagCount={2}
  //           allowClear={true}
  //           style={{ width: '100%' }}
  //           options={[
  //             { label: '6个月内', value: '6个月内' },
  //             { label: '9个月内', value: '9个月内' },
  //             { label: '1年内', value: '1年内' },
  //             { label: '1年以上', value: '1年以上' },
  //           ]}
  //         />
  //       );
  //     },
  //   },
  //   {
  //     title: '库存量',
  //     dataIndex: 'prodQuantity',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     title: '库存金额',
  //     dataIndex: 'productAmount',
  //     valueType: 'digit',
  //     search: false,
  //   },
  //   {
  //     title: '库存同比',
  //     dataIndex: 'yearOverYear',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     title: '库存环比',
  //     dataIndex: 'linkRelativeRatio',
  //     search: false,
  //     valueType: 'digit',
  //   },
  // ];
  if (windowTimeOption && windowTimeOption.length > 0) {
    return (
      <>
        <Table<NearTermMgmt>
          code={'Customer.Inventory.Mgmt'}
          form={{
            initialValues: {
              periodId:
                windowTimeOption &&
                windowTimeOption[0] &&
                windowTimeOption[0].value,
            },
          }}
          headerTitle={
            <Space>
              <Button
                type="primary"
                key={'export'}
                onClick={() => exportRequest.run(query)}
                loading={exportRequest.loading}
              >
                导出
              </Button>
            </Space>
          }
          formRef={ref}
          columns={dynamicJoinColumns}
          beforeSearchSubmit={(params: NearTermMgmt) => {
            params.tenantId = userInfo?.tenantId;
            params.periodId = params?.periodId
              ? params?.periodId
              : windowTimeOption &&
                windowTimeOption[0] &&
                windowTimeOption[0].value;
            setQuery(params);
            return params;
          }}
          search={{
            labelWidth: 'auto',
          }}
          scroll={{ x: 1500 }}
          sticky={true}
          tableLayout={'fixed'}
          // rowKey={'id'}
          request={async (params, sort) => {
            const _query: NearTermMgmtQuery = {
              ...params,
            };
            _query.tenantId = userInfo?.tenantId;
            _query.periodId = _query?.periodId
              ? _query?.periodId
              : windowTimeOption &&
                windowTimeOption[0] &&
                windowTimeOption[0].value;

            try {
              let res = await fetch(_query);
              return {
                data: res?.data?.list || [],
                total: res?.data?.total,
                success: true,
              };
            } catch (err) {
              return {
                total: 0,
                success: true,
                data: [],
              };
            }
          }}
        />
      </>
    );
  }
  return null;
};
