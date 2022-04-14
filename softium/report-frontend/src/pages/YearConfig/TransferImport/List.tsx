import React, { useEffect, useRef, useState } from 'react';
import { ProColumns } from '@ant-design/pro-table';
import { Button, Card, Select, Space, TreeSelect } from 'antd';
import { useRequest, useModel, history } from 'umi';
import { Table, VulcanFile } from '@vulcan/utils';
import { AllocationPO, AllocationQuery } from './data';
import { fetch, downTemplate, exportList } from './api';
import SelectPeriod from '@/pages/YearConfig/TransferImport/SelectPeriod';

const List: React.FC = () => {
  const downloadTemplateRequest = useRequest(downTemplate, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });
  const exportListRequest = useRequest(exportList, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      VulcanFile.export(res);
    },
  });
  const handleImport = () => {
    history.push({
      pathname: '/year-config/transfer-import',
      // state: {
      //   periodId: periodId || timeWindowOption[0]?.id,
      // },
    });
  };
  useEffect(() => {
    updateOptions();
  }, []);
  const { updateOptions, pockets } = useModel(
    'PaymentCollection.PaymentCollectionModel',
  );
  const { windowTimeOption } = pockets;
  const [query, setQuery] = useState<AllocationQuery>({});
  const columns: ProColumns<AllocationPO>[] = [
    {
      dataIndex: 'periodIds',
      title: '时间窗名称',
      key: 'periodIds',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            mode={'multiple'}
            placeholder={'请选择'}
            allowClear={true}
            style={{ width: '100%' }}
            options={windowTimeOption?.map((t: { text: any; value: any }) => ({
              label: t?.text,
              value: t?.value,
            }))}
          />
        );
      },
    },
    {
      dataIndex: 'periodName',
      title: '时间窗名称',
      fixed: 'left',
      search: false,
    },
    {
      dataIndex: 'teryNodeCode',
      title: '辖区编码',
      search: false,
    },
    {
      dataIndex: 'teryNodeName',
      title: '辖区名称',
      key: 'teryNodeName',
    },
    {
      dataIndex: 'productCode',
      title: '产品品种编码',
      search: false,
    },
    {
      dataIndex: 'productName',
      title: '产品品种名称',
      key: 'productName',
    },
    {
      dataIndex: 'allocationAmt',
      title: '调拨金额',
      search: false,
    },
  ];
  if (windowTimeOption && windowTimeOption?.length > 0) {
    return (
      <Card>
        <Table<AllocationPO, AllocationQuery>
          code={'ReportConfig.Transfer.Import'}
          sticky={true}
          scroll={{ x: 1300 }}
          columns={columns}
          rowKey={'id'}
          search={{
            labelWidth: 'auto',
          }}
          form={{
            initialValues: {
              periodIds: [windowTimeOption[0]?.value],
            },
          }}
          headerTitle={
            <Space>
              <SelectPeriod windowTimeOption={windowTimeOption} />
              <Button
                onClick={() => exportListRequest.run(query)}
                loading={exportListRequest.loading}
              >
                {'导出'}
              </Button>
              <Button
                onClick={() => downloadTemplateRequest.run()}
                loading={downloadTemplateRequest.loading}
              >
                下载模板
              </Button>
            </Space>
          }
          beforeSearchSubmit={(params: AllocationQuery) => {
            const query = {
              ...params,
              pageNo: params?.current,
            };
            query.periodIds =
              query?.periodIds && query?.periodIds?.length > 0
                ? query.periodIds
                : undefined;
            setQuery(query);
            return query;
          }}
          request={async (params: AllocationQuery) => {
            const query = {
              ...params,
              pageNo: params?.current,
            };
            query.periodIds =
              query?.periodIds && query?.periodIds?.length > 0
                ? query.periodIds
                : undefined;
            const res = await fetch(query);
            return {
              data: res?.data?.list,
              total: res?.data?.total,
            };
          }}
        />
      </Card>
    );
  }
  return null;
};
export default List;
