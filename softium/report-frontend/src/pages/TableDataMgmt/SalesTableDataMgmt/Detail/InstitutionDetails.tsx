import React, { useRef, useState } from 'react';
import { Button, Card, Descriptions, Divider, Modal, Space, Table } from 'antd';
import { TerminalList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/data';
import {
  instCategoryToEN,
  instMainCategoryToEN,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/utils';

export interface institutionProps {
  item: TerminalList;
  institutionCategoryOption?: any[];
  dictionaries?: {};
}
const InstitutionDetails: React.FC<institutionProps> = ({
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
        {item?.attachedToInstName}
      </span>
      <Modal
        width={900}
        visible={visible}
        title={'下游机构详情'}
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
              {/*  {item?.attachedProdKind}*/}
              {/*</Descriptions.Item>*/}
              <Descriptions.Item label={'标准客户名称'}>
                {item?.toInstName}
              </Descriptions.Item>
              <Descriptions.Item label={'挂靠后机构名称'}>
                {item?.attachedToInstName}
              </Descriptions.Item>
              <Descriptions.Item label={'标准产品规格'}>
                {item?.specification}
              </Descriptions.Item>
              <Descriptions.Item label={'生产厂家'}>
                {item?.manufacturer}
              </Descriptions.Item>
              <Descriptions.Item label={'标准产品名称'}>
                {item?.prodName}
              </Descriptions.Item>
              <Descriptions.Item label={'标准数量'}>
                {item?.prodQuantity}
              </Descriptions.Item>
              <Descriptions.Item label={'单位'}>
                {item?.prodUnit}
              </Descriptions.Item>
              <Descriptions.Item label={'挂靠后机构所在省份'}>
                {item?.attachedToInstProvinceName}
              </Descriptions.Item>
              {/*<Descriptions.Item label={'省份产品价格'}>*/}
              {/*  {item?.prodQuantity}*/}
              {/*</Descriptions.Item>*/}
              {/*<Descriptions.Item label={'金额（省份价格）'}>*/}
              {/*  {item?.prodUnit}*/}
              {/*</Descriptions.Item>*/}
            </Descriptions>
          </Card>
          <Card
            title="下游关联辖区信息"
            headStyle={{ background: '#efefef' }}
            size={'small'}
          >
            <h3 style={{ fontWeight: 'bold' }}>挂靠前</h3>
            <Descriptions column={3}>
              <Descriptions.Item label={'下游编码'}>
                {item?.toInstCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'下游名称'}>
                {item?.toInstName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'下游经销商级别'}>
                {item?.toInstDistributorLevelName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'是否终端'}>
                {item?.toInstIsTerminal === 0 ? '否' : '是'}
              </Descriptions.Item>
              <Descriptions.Item label={'下游机构主类型'}>
                {item?.toInstMainCategory || '-'}
                {/*{instMainCategoryToEN(*/}
                {/*  institutionCategoryOption || [],*/}
                {/*  item?.toInstMainCategory || '',*/}
                {/*)}*/}
              </Descriptions.Item>
              <Descriptions.Item label={'下游机构类型'}>
                {item?.toInstCategory || '-'}
                {/*{instCategoryToEN(*/}
                {/*  dictionaries,*/}
                {/*  item?.toInstMainCategory || '',*/}
                {/*  item?.toInstCategory || '',*/}
                {/*)}*/}
              </Descriptions.Item>
              <Descriptions.Item label={'省份'}>
                {item?.toInstProvinceName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'城市'}>
                {item?.toInstCityName || '-'}
              </Descriptions.Item>
            </Descriptions>
            <Divider type="horizontal" />
            <h3 style={{ fontWeight: 'bold' }}>挂靠后</h3>
            <Descriptions column={3}>
              <Descriptions.Item label={'下游编码'}>
                {item?.attachedToInstCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'下游名称'}>
                {item?.attachedToInstName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'下游经销商级别'}>
                {item?.attachedToInstDistributorLevelName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'是否终端'}>
                {item?.attachedToInstIsTerminal === 0 ? '否' : '是'}
              </Descriptions.Item>
              <Descriptions.Item label={'下游机构主类型'}>
                {item?.attachedToInstMainCategory || '-'}
                {/*{instMainCategoryToEN(*/}
                {/*  institutionCategoryOption || [],*/}
                {/*  item?.attachedToInstMainCategory || '',*/}
                {/*)}*/}
              </Descriptions.Item>
              <Descriptions.Item label={'下游机构类型'}>
                {item?.attachedToInstCategory || '-'}
                {/*{instCategoryToEN(*/}
                {/*  dictionaries,*/}
                {/*  item?.attachedToInstMainCategory || '',*/}
                {/*  item?.attachedToInstCategory || '',*/}
                {/*)}*/}
              </Descriptions.Item>
              <Descriptions.Item label={'省份'}>
                {item?.attachedToInstProvinceName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={'城市'}>
                {item?.attachedToInstCityName || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Space>
      </Modal>
    </>
  );
};

export default InstitutionDetails;
