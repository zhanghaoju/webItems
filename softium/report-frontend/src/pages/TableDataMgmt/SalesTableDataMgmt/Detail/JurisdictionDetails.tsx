import React, { useRef, useState } from 'react';
import { Button, Card, Descriptions, Divider, Modal, Space, Table } from 'antd';
import { TerminalList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/data';

export interface JurisdictionProps {
  item: TerminalList;
}
const JurisdictionDetails: React.FC<JurisdictionProps> = ({ item }) => {
  const showDetail = () => {
    setVisible(true);
  };
  const [visible, setVisible] = useState<boolean>(false);

  // @ts-ignore
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
          <Card
            title="下游关联辖区信息"
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

export default JurisdictionDetails;
