import React, { useRef, useState } from 'react';
import { Button, Card, Descriptions, Empty, Modal, Space, Table } from 'antd';
import { useRequest } from 'umi';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TerminalList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/data';

export interface JurisdictionProps {
  item: TerminalList;
}

const JurisdictionDetails: React.FC<JurisdictionProps> = ({ item }) => {
  const tableRef = useRef<ActionType>();
  const showDetail = async (currentItem: any) => {
    setVisible(true);
  };
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <span
        onClick={showDetail}
        style={{ color: '#48a3f3', cursor: 'pointer' }}
      >
        {item.attachedProdName}
      </span>
      <Modal
        width={900}
        visible={visible}
        title={'产品挂靠详情'}
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
            title="挂靠前产品信息"
            headStyle={{ background: '#efefef' }}
            size={'small'}
          >
            <Descriptions column={3}>
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
              <Descriptions.Item label={'单位'}>
                {item?.prodUnit || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card
            title="挂靠后产品信息"
            headStyle={{ background: '#efefef' }}
            size={'small'}
          >
            {item?.sfProdHasGuakao === 1 ? (
              <Descriptions column={3}>
                <Descriptions.Item label={'挂靠后产品名称'}>
                  {item?.attachedProdName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={'挂靠后产品规格'}>
                  {item?.attachedProdSpecification || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={'生产厂家'}>
                  {item?.manufacturer || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={'挂靠后数量'}>
                  {item?.attachedProdQuantity || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={'单位'}>
                  {item?.attachedProdUnit || '-'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无信息"
              />
            )}
          </Card>
        </Space>
      </Modal>
    </>
  );
};

export default JurisdictionDetails;
