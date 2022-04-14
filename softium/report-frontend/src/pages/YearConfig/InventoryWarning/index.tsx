import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  InventoryWarningConfig,
  InventoryWarningConfigQuery,
} from '@/pages/YearConfig/InventoryWarning/data';
import { update, fetch, downloadTemplate, exportExcel } from './api';
import { Button, message, Space } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import { Table, VulcanFile } from '@vulcan/utils';
import { history } from '@@/core/history';
import UpdateModal, {
  UpdateInventConfigFormActionType,
} from '@/pages/YearConfig/InventoryWarning/components/UpdateInventoryWarning';
import { useModel } from '@@/plugin-model/useModel';

const InventoryWarningConfigList: React.FC = () => {
  const exportRequest = useRequest(exportExcel, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });

  const downloadTemplateRequest = useRequest(downloadTemplate, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });

  const submitRequest = useRequest(update, {
    manual: true,
    onSuccess: () => {
      message.success('编辑成功');
      updateModalRef?.current?.hide();
      actionRef?.current?.reload();
    },
  });

  const [query, setQuery] = useState<InventoryWarningConfigQuery>();

  const { pockets } = useModel('useOptions');

  const { productUnti } = pockets;

  const columns: ProColumns<InventoryWarningConfig>[] = [
    {
      dataIndex: 'productName',
      title: '产品名称',
    },
    {
      dataIndex: 'productSpec',
      title: '产品规格',
    },
    {
      dataIndex: 'productUnit',
      title: '产品单位',
      search: false,
      valueEnum: Object.fromEntries(
        productUnti?.map((t: { value: string; text: any }) => [
          t?.value,
          { text: t?.text },
        ]) || [],
      ),
    },
    {
      dataIndex: 'productCode',
      title: '产品编码',
      hideInTable: true,
    },
    {
      dataIndex: 'saleAvg',
      title: 'X月平均销售',
      valueType: 'digit',
      search: false,
    },
    {
      dataIndex: 'maxDayExp',
      title: '库存天期最高值',
      valueType: 'digit',
      search: false,
    },
    {
      dataIndex: 'minDayExp',
      title: '库存天期最低值',
      valueType: 'digit',
      search: false,
    },
    {
      dataIndex: 'updateByName',
      title: '维护人',
      search: false,
    },
    {
      dataIndex: 'updateTime',
      title: '维护时间',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (dom, entity) => (
        <Button
          type={'link'}
          onClick={() => updateModalRef?.current?.show(entity)}
        >
          编辑
        </Button>
      ),
    },
  ];

  const actionRef = useRef<ActionType>();
  const updateModalRef = useRef<UpdateInventConfigFormActionType>();

  const handleImport = () => {
    history.push({
      pathname: '/year-config/inventory-warning/import',
    });
  };

  return (
    <>
      <Table<InventoryWarningConfig, InventoryWarningConfigQuery>
        code={'YearConfig.InventoryWarning'}
        actionRef={actionRef}
        request={params => {
          const { current, ...query } = params;
          query.pageNo = current;
          return fetch(query);
        }}
        columns={columns}
        search={{
          labelWidth: 'auto',
        }}
        beforeSearchSubmit={params => {
          setQuery(params);
          return params;
        }}
        rowKey={'id'}
        headerTitle={
          <Space>
            <Button type={'primary'} onClick={() => handleImport()}>
              {'数据导入'}
            </Button>
            <Button
              onClick={() => exportRequest.run(query || {})}
              loading={exportRequest.loading}
            >
              导出
            </Button>
            <Button
              onClick={() => downloadTemplateRequest.run()}
              loading={downloadTemplateRequest.loading}
            >
              下载模板
            </Button>
          </Space>
        }
      />
      <UpdateModal
        actionRef={updateModalRef}
        onSubmit={submitRequest?.run}
        submitting={submitRequest?.loading}
      />
    </>
  );
};

export default InventoryWarningConfigList;
