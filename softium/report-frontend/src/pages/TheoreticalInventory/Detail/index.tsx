import React, { useState } from 'react';
import { Card, Space, Descriptions } from 'antd';
import { withRouter } from 'umi';
import {
  LogListQuery,
  TheoreticalInventory,
} from '@/pages/TheoreticalInventory/data';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { logList } from '../api';

const DescriptionItem = Descriptions.Item;
export default withRouter(props => {
  const [currentItem] = useState<TheoreticalInventory>(
    props?.location?.state as TheoreticalInventory,
  );

  const columns: ProColumns<TheoreticalInventory>[] = [
    {
      title: '期末理论库存（调整后）',
      dataIndex: 'afterAdjustTheoryEndInventory',
      valueType: 'digit',
    },
    {
      title: '差异值',
      dataIndex: 'differenceVal',
      valueType: 'digit',
    },
    {
      title: '调整量',
      dataIndex: 'adjustVal',
      valueType: 'digit',
    },
    {
      title: '调整原因',
      dataIndex: 'adjustReason',
    },
    {
      title: '调整人',
      dataIndex: 'updateByName',
    },
    {
      title: '调整时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
  ];

  return (
    <>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Card type={'inner'} title={'基础信息'}>
          <Descriptions>
            <DescriptionItem label={'经销商编码'}>
              {currentItem?.institutionCode}
            </DescriptionItem>
            <DescriptionItem label={'经销商名称'}>
              {currentItem?.institutionName}
            </DescriptionItem>
            <DescriptionItem label={'经销商省份'}>
              {currentItem?.institutionProvince}
            </DescriptionItem>
            <DescriptionItem label={'经销商城市'}>
              {currentItem?.institutionCity}
            </DescriptionItem>
            <DescriptionItem label={'产品编码'}>
              {currentItem?.productCode}
            </DescriptionItem>
            <DescriptionItem label={'产品名称'}>
              {currentItem?.productName}
            </DescriptionItem>
            <DescriptionItem label={'产品规格'}>
              {currentItem?.productSpecification}
            </DescriptionItem>
          </Descriptions>
        </Card>
        <Card type={'inner'} title={'库存信息'}>
          <Descriptions>
            <DescriptionItem label={'期初理论库存'}>
              {currentItem?.theoryBeginInventory}
            </DescriptionItem>
            <DescriptionItem label={'上游销量'}>
              {currentItem?.fromInstSales}
            </DescriptionItem>
            <DescriptionItem label={'自身销量'}>
              {currentItem?.selfSales}
            </DescriptionItem>
            <DescriptionItem label={'期末理论库存（调整前）'}>
              {currentItem?.beforeAdjustTheoryEndInventory}
            </DescriptionItem>
            <DescriptionItem label={'期末实际库存'}>
              {currentItem?.actualEndInventory}
            </DescriptionItem>
          </Descriptions>
          <ProTable<TheoreticalInventory, LogListQuery>
            options={false}
            columns={columns}
            params={{
              institutionId: currentItem?.institutionId,
              productId: currentItem?.productId,
              periodId: currentItem?.periodId,
            }}
            search={false}
            pagination={false}
            request={async params => {
              const res = await logList(params);
              return {
                data: res?.data,
              };
            }}
            rowKey={'id'}
          />
        </Card>
      </Space>
    </>
  );
});
