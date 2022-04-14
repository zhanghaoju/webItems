import React, { useEffect, useRef, useState } from 'react';
import { ProColumns } from '@ant-design/pro-table';
import { Button, Card, Select, Space, TreeSelect } from 'antd';
import { useRequest, useModel, history } from 'umi';
import { Table, VulcanFile } from '@vulcan/utils';
import { ImportReportQuery, ImportReport } from './data';
import { fetch, downTemplate } from './api';

const List: React.FC = () => {
  const downloadTemplateRequest = useRequest(downTemplate, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });

  const handleImport = () => {
    history.push({
      pathname: '/payment-collection/import/payment-import',
      // state: {
      //   periodId: periodId || timeWindowOption[0]?.id,
      // },
    });
  };
  useEffect(() => {
    getCurrentQueryList();
  }, []);

  const { yearList, orientationList, getCurrentQueryList } = useModel(
    'PaymentCollection.PaymentCollectionModel',
  );
  const columns: ProColumns<ImportReport>[] = [
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

  return (
    <Card>
      <Table<ImportReport, ImportReportQuery>
        code={'Payment.Collection.Import'}
        sticky={true}
        scroll={{ x: 1600 }}
        columns={columns}
        rowKey={'id'}
        search={{
          labelWidth: 'auto',
        }}
        headerTitle={
          <Space>
            <Button type={'primary'} onClick={() => handleImport()}>
              {'数据导入'}
            </Button>
            <Button
              onClick={() => downloadTemplateRequest.run()}
              loading={downloadTemplateRequest.loading}
            >
              下载模板
            </Button>
          </Space>
        }
        request={async params => {
          const query = {
            ...params,
            pageNo: params?.current,
            pageSize: params?.pageSize,
          };
          const res = await fetch(query);
          return {
            data: res?.data?.list,
            total: res?.data?.total,
          };
        }}
      />
    </Card>
  );
};

export default List;
