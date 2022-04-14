import React, { useState } from 'react';
import { Card, Descriptions, Button } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { withRouter } from 'umi';
import {
  TheoreticalInventory,
  inventoryDetail,
} from '@/pages/dataManagement/inventory/inventoryAnalysis/data';
import { history } from '@@/core/history';

const DescriptionItem = Descriptions.Item;
export default withRouter(props => {
  const [currentItem] = useState<TheoreticalInventory>(
    props?.location?.state as TheoreticalInventory,
  );

  const inventoryDetailColumn: ProColumns<inventoryDetail>[] = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      fixed: 'left',
    },
    {
      title: '产品批号',
      dataIndex: 'productBatchNo',
      key: 'productBatchNo',
      fixed: 'left',
    },
    {
      title: '期末理论库存量',
      dataIndex: 'endTheoryQuantity',
      key: 'endTheoryQuantity',
    },
    {
      title: '期末实际库存量',
      dataIndex: 'endActualQuantity',
      key: 'endActualQuantity',
    },
    {
      title: '差异值（理论-实际）',
      dataIndex: 'diffQuantity',
      key: 'diffQuantity',
    },
  ];

  return (
    <>
      <div className="detailPage-content">
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
            <DescriptionItem label={'产品批号'}>
              {currentItem?.productBatchNo}
            </DescriptionItem>
            <DescriptionItem label={'产品名称'}>
              {currentItem?.productName}
            </DescriptionItem>
            <DescriptionItem label={'产品规格'}>
              {currentItem?.productSpec}
            </DescriptionItem>
            <DescriptionItem label={'产品单位'}>
              {currentItem?.productUnit}
            </DescriptionItem>
            <DescriptionItem label={'产品厂家'}>
              {currentItem?.productManufacturer}
            </DescriptionItem>
          </Descriptions>
        </Card>
        <Card type={'inner'} title={'库存信息'} style={{ marginTop: 30 }}>
          {/*<Descriptions>*/}
          {/*  <DescriptionItem label={'上游销量'}>*/}
          {/*    {currentItem?.fromInstitutionVolume}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'自身销量'}>*/}
          {/*    {currentItem?.toInstitutionVolume}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'理论期初库存(数量)'}>*/}
          {/*    {currentItem?.beginTheoryQuantity}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'理论期初库存(价格)'}>*/}
          {/*    {currentItem?.beginTheoryPrice}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'理论期末库存(数量)'}>*/}
          {/*    {currentItem?.endTheoryQuantity}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'理论期末库存(价格)'}>*/}
          {/*    {currentItem?.endTheoryPrice}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'期末实际库存(数量)'}>*/}
          {/*    {currentItem?.endActualQuantity}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'期末实际库存(价格)'}>*/}
          {/*    {currentItem?.endActualPrice}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'差异值(数量)'}>*/}
          {/*    {currentItem?.diffQuantity}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'差异值(价格)'}>*/}
          {/*    {currentItem?.diffPrice}*/}
          {/*  </DescriptionItem>*/}
          {/*  <DescriptionItem label={'所属账期'}>*/}
          {/*    {currentItem?.periodName}*/}
          {/*  </DescriptionItem>*/}
          {/*</Descriptions>*/}
          <ProTable<inventoryDetail>
            search={false}
            options={false}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            columns={inventoryDetailColumn}
            dataSource={currentItem.children}
            sticky={true}
            scroll={{ x: 1800 }}
            tableLayout={'fixed'}
            rowKey={'id'}
          />
        </Card>
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <Button
            type="default"
            onClick={() => {
              history.goBack();
            }}
          >
            返回
          </Button>
        </div>
      </div>
    </>
  );
});
