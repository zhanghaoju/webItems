import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Card, Space } from 'antd';
import { useRequest, useModel, history } from 'umi';
import { Table, VulcanFile } from '@vulcan/utils';
import { OpeningInventoryQuery, OpeningInventory } from './data';
import { fetch, exportFile, downloadTemplate } from './api';

const TheoreticalInventoryList: React.FC = () => {
  const exportRequest = useRequest(exportFile, {
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

  const [query, setQuery] = useState<OpeningInventoryQuery>();
  const [periodId, setPeriodId] = useState<string>();

  const actionRef = useRef<ActionType>();

  const { updateTimeWindowOption, timeWindowOption } = useModel(
    'useTimeWindowOption',
  );

  // useEffect(() => {
  //   updateTimeWindowOption();
  // }, []);

  const handleImport = () => {
    history.push({
      pathname: '/year-config/opening-inventory/import',
      state: {
        periodId: periodId || timeWindowOption[0]?.id,
      },
    });
  };
  const columns: ProColumns<OpeningInventory>[] = [
    {
      dataIndex: 'periodId',
      title: '时间窗',
      fieldProps: {
        onSelect: (v: string) => {
          setPeriodId(v);
        },
      },
      valueEnum: Object.fromEntries(
        timeWindowOption?.map(t => [
          t?.id,
          {
            text: t?.name,
          },
        ]),
      ),
    },
    {
      dataIndex: 'institutionCode',
      title: '经销商编码',
    },
    {
      dataIndex: 'institutionName',
      title: '经销商名称',
    },
    {
      dataIndex: 'institutionProvince',
      title: '经销商省份',
      search: false,
    },
    {
      dataIndex: 'institutionCity',
      title: '经销商城市',
      search: false,
    },
    {
      dataIndex: 'productCode',
      title: '产品编码',
    },
    {
      dataIndex: 'productName',
      title: '产品名称',
    },
    {
      dataIndex: 'productSpecification',
      title: '产品规格',
      search: false,
    },
    {
      dataIndex: 'theoryBeginInventory',
      title: '理论期初库存',
      search: false,
      valueType: 'digit',
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
  ];

  if (timeWindowOption && timeWindowOption?.length > 0) {
    return (
      <Card>
        <Table<OpeningInventory, OpeningInventoryQuery>
          code={'YearConfig.OpeningInventory'}
          form={{
            initialValues: {
              periodId: timeWindowOption[0]?.id,
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
          tableLayout={'fixed'}
          columns={columns}
          rowKey={'id'}
          actionRef={actionRef}
        />
      </Card>
    );
  }
  return null;
};

export default TheoreticalInventoryList;
