import React, { useEffect, useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { list, exportExcel } from './api';
import { Button, Select, Space, TreeSelect } from 'antd';
import { useRequest } from 'umi';
import { Table, VulcanFile } from '@vulcan/utils';
import { useModel } from '@@/plugin-model/useModel';
import expandTree from '@/utils/expandTree';
import {
  ReportForm,
  ReportFormQuery,
} from '@/pages/PaymentCollection/ReportForm/data';

const ReportFormList: React.FC = () => {
  const exportRequest = useRequest(exportExcel, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });
  useEffect(() => {
    updateOptions();
    getCurrentQueryList();
  }, []);
  const {
    pockets,
    yearList,
    orientationList,
    updateOptions,
    getCurrentQueryList,
  } = useModel('PaymentCollection.PaymentCollectionModel');
  const { windowTimeOption, regionTreeOption } = pockets || {};
  const [query, setQuery] = useState<ReportFormQuery>();

  const columns: ProColumns<ReportForm>[] = [
    {
      dataIndex: 'institutionCode',
      title: '经销商编码',
      fixed: 'left',
    },
    {
      dataIndex: 'customerName',
      title: '客户名称',
    },
    {
      dataIndex: 'years',
      title: '年份',
      hideInTable: true,
      renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
        return (
          <Select
            placeholder={'请选择'}
            mode={'multiple'}
            maxTagCount={2}
            allowClear={true}
            style={{ width: '100%' }}
            options={yearList?.map((value, index, array) => ({
              label: value,
              value: value,
            }))}
          />
        );
      },
    },
    {
      dataIndex: 'year',
      title: '年份',
      search: false,
    },
    {
      dataIndex: 'areas',
      title: '片区',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        const jurisdictionOptions = windowTimeOption[0].children;
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
          'code',
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
    {
      dataIndex: 'area',
      title: '片区',
      search: false,
    },
    {
      dataIndex: 'provinces',
      title: '省份',
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
            filterTreeNode={(input, treeNode) => {
              return (
                (treeNode?.title + '').indexOf(input) > -1 ||
                (treeNode?.value + '').indexOf(input) > -1
              );
            }}
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
      dataIndex: 'province',
      title: '省份',
      search: false,
    },
    {
      dataIndex: 'city',
      title: '城市',
      search: false,
    },
    {
      dataIndex: 'orientations',
      title: '方向',
      hideInTable: true,
      renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
        return (
          <Select
            placeholder={'请选择'}
            mode={'multiple'}
            maxTagCount={2}
            allowClear={true}
            style={{ width: '100%' }}
            options={orientationList?.map((value, index, array) => ({
              label: value,
              value: value,
            }))}
          />
        );
      },
    },
    {
      dataIndex: 'orientation',
      title: '方向',
      search: false,
    },
    {
      dataIndex: 'medicalOrganization',
      title: '医疗机构',
      // valueType:
      search: false,
      renderText: text => {
        return <span>{(text || 0).toFixed(4)}</span>;
      },
    },
    {
      dataIndex: 'medicalOrganization',
      title: '葫芦娃事业部',
      search: false,
      renderText: text => {
        return <span>{(text || 0).toFixed(4)}</span>;
      },
    },
    {
      dataIndex: 'commerceReceivablesMinistry',
      title: '商务部应收款',
      search: false,
      renderText: text => {
        return <span>{(text || 0).toFixed(4)}</span>;
      },
    },
    {
      dataIndex: 'gourdFamily',
      title: '葫芦世家',
      search: false,
      renderText: text => {
        return <span>{(text || 0).toFixed(4)}</span>;
      },
    },
    {
      dataIndex: 'receivableFromOtherDepartments',
      title: '其他部门应收款',
      search: false,
      renderText: text => {
        return <span>{(text || 0).toFixed(4)}</span>;
      },
    },
    {
      dataIndex: 'total',
      title: '合计',
      search: false,
      renderText: text => {
        return <span>{(text || 0).toFixed(4)}</span>;
      },
    },
    {
      dataIndex: 'remark1',
      title: '备注1',
      search: false,
    },
    {
      dataIndex: 'remark2',
      title: '备注2',
      search: false,
    },
    {
      dataIndex: 'remark3',
      title: '备注3',
      search: false,
    },
    {
      dataIndex: 'remark4',
      title: '备注4',
      search: false,
    },
    {
      dataIndex: 'remark5',
      title: '备注5',
      search: false,
    },
  ];
  if (windowTimeOption && windowTimeOption?.length > 0) {
    return (
      <>
        <Table
          code={'Payment.Collection.Report'}
          sticky={true}
          scroll={{ x: 1600 }}
          columns={columns}
          headerTitle={
            <Space>
              <Button
                type="primary"
                onClick={() => exportRequest.run(query || {})}
                loading={exportRequest.loading}
              >
                导出
              </Button>
            </Space>
          }
          beforeSearchSubmit={params => {
            setQuery(params);
            return params;
          }}
          request={async params => {
            const query = {
              ...params,
              pageNo: params?.current,
              pageSize: params?.pageSize,
            };
            return await list(query);
          }}
        />
      </>
    );
  }
  return null;
};

export default ReportFormList;
