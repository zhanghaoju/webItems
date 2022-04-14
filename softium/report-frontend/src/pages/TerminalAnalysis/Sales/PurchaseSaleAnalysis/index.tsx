import React, { useEffect, useState, useRef } from 'react';
import { Button, FormInstance, Space } from 'antd';
import { Table, VulcanFile } from '@vulcan/utils';
import {
  fetch,
  exp,
} from '@/pages/TerminalAnalysis/Sales/PurchaseSaleAnalysis/api';
import { PurchaseSaleAnalysis } from '@/pages/TerminalAnalysis/Sales/PurchaseSaleAnalysis/data';
import { useModel } from '@@/plugin-model/useModel';
import storage from '@/utils/storage';
import { getDynamicTable } from '@/services/global';
import { getDynamicColumns } from '@/pages/TerminalAnalysis/Sales/PurchaseSaleAnalysis/dynamicTable';
import { useRequest } from '@@/plugin-request/request';

export default () => {
  const exportRequest = useRequest(exp, {
    manual: true,
    formatResult: res => res,
    onSuccess: data => {
      VulcanFile.export(data);
    },
  });

  const ref = useRef<FormInstance>();
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');
  const { windowTimeOption } = pockets || {};
  const [dynamicColumns, setDynamicColumns] = useState<any>([]);
  let userInfo = storage.get('userInfo');
  useEffect(() => {
    getDynamicTable({
      tenantId: userInfo?.tenantId,
      code: 'Purchase.Sale.Analysis',
    }).then((res: { data: { columnList: any } }) => {
      setDynamicColumns(res?.data?.columnList);
    });
  }, []);
  useEffect(() => {
    let windowTime =
      windowTimeOption && windowTimeOption[0] && windowTimeOption[0].value;
    if (ref.current) {
      ref.current.setFieldsValue({
        windowTime: windowTime,
      });
    }
    setQuery({ ...query, windowTime });
  }, [windowTimeOption]);
  const dynamicJoinColumns = getDynamicColumns(dynamicColumns);
  const [query, setQuery] = useState<PurchaseSaleAnalysis>();
  // const columns: ProColumns<PurchaseSaleAnalysis>[] = [
  //   {
  //     title: '时间窗',
  //     key: 'windowTime',
  //     hideInTable: true,
  //     renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
  //       return (
  //         <Select
  //           placeholder={'请选择'}
  //           style={{ width: '100%' }}
  //           onSelect={t => {
  //             form.resetFields(['fromTeryName']);
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
  //     dataIndex: 'fromTeryParentName',
  //     search: false,
  //   },
  //   {
  //     title: '辖区',
  //     dataIndex: 'fromTeryName',
  //     key:'fromTeryName',
  //     formItemProps: {
  //       dependencies: ['windowTime'],
  //     },
  //     renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
  //       const currentWindowTime = form.getFieldValue('windowTime');
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
  //     dataIndex: 'distributorLevelCode',
  //     key: 'distributorLevelCode',
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
  //     dataIndex: 'prodSpecification',
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
  //     key: 'productBatch',
  //   },
  //   {
  //     title: '提货量',
  //     dataIndex: 'buyQuantity',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     title: '分销量',
  //     dataIndex: 'saleQuantity',
  //     search: false,
  //     valueType: 'digit',
  //   },
  //   {
  //     title: '购销量差',
  //     dataIndex: 'saleBuyCutQuantity',
  //     key: 'saleBuyCutQuantity',
  //     valueEnum: statusEnum,
  //     renderText: (text: number) => (
  //       <span> {text <= 500 ? text : <Tag color="red">{text}</Tag>}</span>
  //     ),
  //   },
  //   {
  //     title: '涉及金额',
  //     dataIndex: 'saleBuyCutAmount',
  //     search: false,
  //     valueType: 'digit',
  //   },
  // ];
  if (windowTimeOption && windowTimeOption.length > 0) {
    return (
      <>
        <Table<PurchaseSaleAnalysis>
          code={'Purchase.Sale.Analysis'}
          form={{
            initialValues: {
              windowTime:
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
          search={{
            labelWidth: 'auto',
          }}
          sticky={true}
          scroll={{ x: 1400 }}
          tableLayout={'fixed'}
          rowKey={'id'}
          beforeSearchSubmit={(params: PurchaseSaleAnalysis) => {
            setQuery(params);
            params.windowTime = params?.windowTime
              ? params?.windowTime
              : windowTimeOption &&
                windowTimeOption[0] &&
                windowTimeOption[0].value;
            return params;
          }}
          request={async (params, sort) => {
            const _query: PurchaseSaleAnalysis = {
              ...params,
            };
            _query.windowTime = _query?.windowTime
              ? _query?.windowTime
              : windowTimeOption &&
                windowTimeOption[0] &&
                windowTimeOption[0].value;

            try {
              let res = await fetch(_query);
              return {
                data: res?.data?.rows || [],
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
