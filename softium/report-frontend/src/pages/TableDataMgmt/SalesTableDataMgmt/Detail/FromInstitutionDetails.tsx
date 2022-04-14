import React, { useRef, useState } from 'react';
import { Button, Card, Descriptions, Divider, Modal, Space, Table } from 'antd';
import { ChannelList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/data';
import {
  instCategoryToEN,
  instMainCategoryToEN,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/utils';

export interface institutionProps {
  item: ChannelList;
  institutionCategoryOption?: any[];
  dictionaries?: {};
}
const FromInstitutionDetails: React.FC<institutionProps> = ({
  item,
  institutionCategoryOption,
  dictionaries,
}) => {
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
        {item?.attachedFromInstName}
      </span>
      <Modal
        width={900}
        visible={visible}
        title={'上游机构详情'}
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
              {/*<Descriptions.Item label={'挂靠类型'}>*/}
              {/*  {item?.attachedProdKind || '-'}*/}
              {/*</Descriptions.Item>*/}
              <Descriptions.Item label={'标准客户名称'}>
                {item?.fromInstName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'挂靠后机构名称'}>
                {item?.attachedFromInstName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'标准产品规格'}>
                {item?.specification || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'生产厂家'}>
                {item?.manufacturer || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'标准产品名称'}>
                {item?.prodName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'标准数量'}>
                {item?.prodQuantity || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'单位'}>
                {item?.prodUnit || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'挂靠后机构所在省份'}>
                {item?.attachedToInstProvinceName || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card
            title="上游机构信息"
            headStyle={{ background: '#efefef' }}
            size={'small'}
          >
            <h3 style={{ fontWeight: 'bold' }}>挂靠前</h3>
            <Descriptions column={3}>
              <Descriptions.Item label={'上游编码'}>
                {item?.attachedFromInstCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'上游名称'}>
                {item?.attachedFromInstName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'上游经销商级别'}>
                {item?.attachedFromInstDistributorLevelName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'是否为渠道'}>
                {item?.attachedFromInstIsChannel === 0 ? '否' : '是'}
              </Descriptions.Item>
              <Descriptions.Item label={'上游机构主类型'}>
                {item?.attachedFromInstMainCategory || '-'}
                {/*{instMainCategoryToEN(*/}
                {/*  institutionCategoryOption || [],*/}
                {/*  item?.attachedFromInstMainCategory || '',*/}
                {/*)}*/}
              </Descriptions.Item>
              <Descriptions.Item label={'上游机构类型'}>
                {item?.attachedFromInstCategory || '-'}
                {/*{instCategoryToEN(*/}
                {/*  dictionaries,*/}
                {/*  item?.attachedFromInstMainCategory || '',*/}
                {/*  item?.attachedFromInstCategory || '',*/}
                {/*)}*/}
              </Descriptions.Item>
              <Descriptions.Item label={'省份'}>
                {item?.attachedFromInstProvinceName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'城市'}>
                {item?.attachedFromInstCityName || '-'}
              </Descriptions.Item>
            </Descriptions>
            <Divider type="horizontal" />
            <h3 style={{ fontWeight: 'bold' }}>挂靠后</h3>
            <Descriptions column={3}>
              <Descriptions.Item label={'上游编码'}>
                {item?.attachedFromInstCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'上游名称'}>
                {item?.attachedFromInstName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'上游经销商级别'}>
                {item?.attachedFromInstDistributorLevelName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'是否渠道'}>
                {item?.attachedFromInstIsChannel === 0 ? '否' : '是'}
              </Descriptions.Item>
              <Descriptions.Item label={'上游机构主类型'}>
                {item?.attachedFromInstMainCategory || '-'}
                {/*{instMainCategoryToEN(*/}
                {/*  institutionCategoryOption || [],*/}
                {/*  item?.attachedFromInstMainCategory || '',*/}
                {/*)}*/}
              </Descriptions.Item>
              <Descriptions.Item label={'上游机构类型'}>
                {item?.attachedFromInstCategory || '-'}
                {/*{instCategoryToEN(*/}
                {/*  dictionaries,*/}
                {/*  item?.attachedFromInstMainCategory || '',*/}
                {/*  item?.attachedFromInstCategory || '',*/}
                {/*)}*/}
              </Descriptions.Item>
              <Descriptions.Item label={'省份'}>
                {item?.attachedFromInstProvinceName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'城市'}>
                {item?.attachedFromInstCityName || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Space>
      </Modal>
    </>
  );
};

export default FromInstitutionDetails;
