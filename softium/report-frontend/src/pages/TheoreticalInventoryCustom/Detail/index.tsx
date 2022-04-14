import React, { useState } from 'react';
import { Card, Space, Descriptions } from 'antd';
import { withRouter } from 'umi';
import {
  LogListQuery,
  TheoreticalInventory,
} from '@/pages/TheoreticalInventoryCustom/data';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { logList } from '../api';

const DescriptionItem = Descriptions.Item;
export default withRouter(props => {
  const [currentItem] = useState<TheoreticalInventory>(
    props?.location?.state as TheoreticalInventory,
  );

  const columns: ProColumns<TheoreticalInventory>[] = [
    {
      title: '调整后-理论期末库存（数量）',
      dataIndex: 'afterAdjustTheoryEndInventory',
      valueType: 'digit',
    },
    {
      title: '理论与实际差异（数量）',
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
      title: '最近一次调整人',
      dataIndex: 'updateByName',
    },
    {
      title: '最近一次调整时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
  ];

  return (
    <>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Card type={'inner'} title={'基础信息'}>
          <Descriptions>
            <DescriptionItem label={'商业单位编码'}>
              {currentItem?.institutionCode}
            </DescriptionItem>
            <DescriptionItem label={'商业单位名称'}>
              {currentItem?.institutionName}
            </DescriptionItem>
            <DescriptionItem label={'省份'}>
              {currentItem?.institutionProvince}
            </DescriptionItem>
            <DescriptionItem label={'城市'}>
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
            <DescriptionItem label={'期初库存(数量)'}>
              {currentItem?.theoryBeginInventory}
            </DescriptionItem>
            {/*<DescriptionItem label={'期初库存(金额)'}>*/}
            {/*  {currentItem?.theoryBeginInventoryAmt}*/}
            {/*</DescriptionItem>*/}
            <DescriptionItem label={'本月采购(数量)'}>
              {currentItem?.fromInstSales}
            </DescriptionItem>
            {/*<DescriptionItem label={'本月采购(金额)'}>*/}
            {/*  {currentItem?.supplierAmt}*/}
            {/*</DescriptionItem>*/}
            <DescriptionItem label={'本月销售(数量)'}>
              {currentItem?.selfSales}
            </DescriptionItem>
            {/*<DescriptionItem label={'本月销售(金额)'}>*/}
            {/*  {currentItem?.salesAmt}*/}
            {/*</DescriptionItem>*/}
            <DescriptionItem label={'调整前-理论期末库存(数量)'}>
              {currentItem?.beforeAdjustTheoryEndInventory}
            </DescriptionItem>
            <DescriptionItem label={'实际库存（数量）'}>
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
