import React, { useRef, useState } from 'react';
import { Button, Card, Descriptions, Divider, Modal, Space, Table } from 'antd';
import { history } from 'umi';
import { FooterToolbar } from '@ant-design/pro-layout';
import { TerminalList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/data';

export interface JurisdictionProps {
  location?: {
    state?: TerminalList | {};
  };
}
const JurisdictionDetails: React.FC<JurisdictionProps> = ({ location }) => {
  const [item] = useState<TerminalList>(location?.state as TerminalList);
  return (
    <>
      <Space direction="vertical">
        <Card size={'small'}>
          <h3 style={{ fontWeight: 'bold' }}>标准流向信息</h3>
          <Descriptions column={3}>
            <Descriptions.Item label={'标准客户名称'}>
              {item?.toInstName || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={'标准经销商名称'}>
              {item?.fromInstName || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={'数据ID'}>{item?.sfId}</Descriptions.Item>
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
            {/*<Descriptions.Item label={'考核价'}>{item?.prod_amount}</Descriptions.Item>*/}
            <Descriptions.Item label={'金额（考核价）'}>
              {item?.prodAssessmentAmount || '-'}
            </Descriptions.Item>
            {/*<Descriptions.Item label={'产品省份价格'}>{'50'}</Descriptions.Item>*/}
            {/*<Descriptions.Item label={'金额（省份价格）'}>*/}
            {/*  {'50'}*/}
            {/*</Descriptions.Item>*/}
            <Descriptions.Item label={'销售日期'}>
              {item?.saleDate || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={'销售年月'}>
              {item?.periodName || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={'标准产品批号'}>
              {item?.productBatch || '-'}
            </Descriptions.Item>
            {/*<Descriptions.Item label={'生产日期'}>*/}
            {/*  {'2021-07-07'}*/}
            {/*</Descriptions.Item>*/}
            {/*<Descriptions.Item label={'有效期'}>{'6个月'}</Descriptions.Item>*/}
          </Descriptions>
        </Card>
        <FooterToolbar
          style={{
            display: 'flow-root',
            textAlign: 'center',
          }}
        >
          <Button
            type="default"
            onClick={() => {
              history.push('/table-data-mgmt/sales/sales-query/terminal');
            }}
          >
            返回
          </Button>
        </FooterToolbar>
      </Space>
    </>
  );
};

export default JurisdictionDetails;
