import React, { useRef, useState } from 'react';
import { Button, Card, Descriptions, Divider, Modal, Space, Table } from 'antd';
import { ChannelList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/data';

export interface JurisdictionProps {
  item: ChannelList;
}
const FromJurisdictionDetails: React.FC<JurisdictionProps> = ({ item }) => {
  const showDetail = () => {
    setVisible(true);
  };
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <span
        onClick={showDetail}
        style={{ color: '#48a3f3', cursor: 'pointer' }}
      >
        {item?.teryNodeName}
      </span>
      <Modal
        width={900}
        visible={visible}
        title={'辖区详情'}
        onCancel={() => {
          setVisible(false);
        }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              onClick={() => {
                setVisible(false);
              }}
              type="primary"
            >
              确认
            </Button>
          </div>
        }
      >
        <Space direction="vertical">
          <Card
            title="流向信息"
            headStyle={{ background: '#efefef' }}
            size={'small'}
          >
            <Descriptions column={3}>
              <Descriptions.Item label={'标准客户名称'}>
                {item?.toInstName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'标准产品名称'}>
                {item?.prodName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'标准产品规格'}>
                {item?.specification || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'生产厂家'}>
                {item?.manufacturer || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'标准数量'}>
                {item?.prodQuantity || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'标准单位'}>
                {item?.prodUnit || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          {/*<Card*/}
          {/*  title="上游机构信息"*/}
          {/*  headStyle={{ background: '#efefef' }}*/}
          {/*  size={'small'}*/}
          {/*>*/}
          {/*  <Descriptions column={3}>*/}
          {/*    <Descriptions.Item label={'上游编码'}>*/}
          {/*      {item?.attachedFromInstCode || '-'}*/}
          {/*    </Descriptions.Item>*/}
          {/*    <Descriptions.Item label={'上游名称'}>*/}
          {/*      {item?.attachedFromInstName || '-'}*/}
          {/*    </Descriptions.Item>*/}
          {/*    <Descriptions.Item label={'上游经销商级别'}>*/}
          {/*      {item?.attachedFromInstDistributorLevelName || '-'}*/}
          {/*    </Descriptions.Item>*/}
          {/*    <Descriptions.Item label={'是否为渠道'}>*/}
          {/*      {item?.attachedFromInstIsChannel === 0 ? '否' : '是'}*/}
          {/*    </Descriptions.Item>*/}
          {/*    <Descriptions.Item label={'下游机构主类型'}>*/}
          {/*      {item?.attachedFromInstMainCategory || '-'}*/}
          {/*    </Descriptions.Item>*/}
          {/*    <Descriptions.Item label={'下游机构类型'}>*/}
          {/*      {item?.attachedFromInstCategory || '-'}*/}
          {/*    </Descriptions.Item>*/}
          {/*    <Descriptions.Item label={'省份'}>*/}
          {/*      {item?.attachedFromInstProvinceName || '-'}*/}
          {/*    </Descriptions.Item>*/}
          {/*    <Descriptions.Item label={'城市'}>*/}
          {/*      {item?.attachedFromInstCityName || '-'}*/}
          {/*    </Descriptions.Item>*/}
          {/*  </Descriptions>*/}
          {/*</Card>*/}
          <Card
            title="上游关联辖区信息"
            headStyle={{ background: '#efefef' }}
            size={'small'}
          >
            <Descriptions column={3}>
              <Descriptions.Item label={'辖区层级'}>
                {item?.teryLevelName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'辖区编码'}>
                {item?.teryNodeCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'辖区名称'}>
                {item?.teryNodeName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'辖区负责人'}>
                {item?.teryOwnerName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'辖区是否目标'}>
                {item?.terySysTargetType}
              </Descriptions.Item>
              <Descriptions.Item label={'辖区类型'}>
                {item?.teryTypeName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'辖区是否拆分'}>
                {item?.teryHoleId ? '是' : '否'}
              </Descriptions.Item>
              <Descriptions.Item label={'拆分比例'}>
                {item?.terySplitRatio || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'拆分后数量'}>
                {item?.terySplitQuantity || '-'}
              </Descriptions.Item>
            </Descriptions>
            <Divider type="horizontal" />
            <h3 style={{ fontWeight: 'bold' }}>上级辖区信息</h3>
            <Descriptions column={3}>
              {/*<Descriptions.Item label={'辖区层级'}>*/}
              {/*  {item?.teryNodeParentName || '-'}*/}
              {/*</Descriptions.Item>*/}
              <Descriptions.Item label={'辖区编码'}>
                {item?.teryNodeParentCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'辖区名称'}>
                {item?.teryNodeParentName || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Space>
      </Modal>
    </>
  );
};

export default FromJurisdictionDetails;
