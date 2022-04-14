import React, { useRef, useState } from 'react';
import { Button, Card, Descriptions, Divider, Modal, Space, Table } from 'antd';
import { useRequest, history } from 'umi';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { FooterToolbar } from '@ant-design/pro-layout';

export interface JurisdictionProps {
  item: any;
}

const TemplateDetails: React.FC<JurisdictionProps> = ({ item }) => {
  const tableRef = useRef<ActionType>();
  const showDetail = async (currentItem: any) => {
    // setCurrentItem(currentItem);
    setVisible(true);
    // await detailsRequest.run(currentItem?.id);
    // tableRef?.current?.reload();
  };

  const [visible, setVisible] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(3);

  const data = [
    {
      toInstName: '上海-1',
      region: '小王',
      saleDate: '上海-1/上海/滑动大区/总部',
      prodQuantity1: '小王/小A/小B/小C',
      prodQuantity2: '销售代表',
      prodQuantity3: '销售-直营',
      prodQuantity4: '40%',
      prodQuantity5: '400',
    },
    {
      toInstName: '上海-1',
      region: '小王',
      saleDate: '上海-1/上海/滑动大区/总部',
      prodQuantity1: '小王/小A/小B/小C',
      prodQuantity2: '销售代表',
      prodQuantity3: '销售-直营',
      prodQuantity4: '40%',
      prodQuantity5: '400',
    },
    {
      toInstName: '上海-1',
      region: '小王',
      saleDate: '上海-1/上海/滑动大区/总部',
      prodQuantity1: '小王/小A/小B/小C',
      prodQuantity2: '销售代表',
      prodQuantity3: '销售-直营',
      prodQuantity4: '40%',
      prodQuantity5: '400',
    },
  ];
  const columns: ProColumns[] = [
    {
      title: '辖区',
      dataIndex: 'toInstName',
      search: false,
    },
    {
      title: '负责人',
      dataIndex: 'region',
      search: false,
    },
    {
      title: '辖区路径',
      dataIndex: 'saleDate',
      search: false,
    },
    {
      title: '负责人路经',
      dataIndex: 'prodQuantity1',
      search: false,
    },
    {
      title: '辖区层级',
      dataIndex: 'prodQuantity2',
      search: false,
    },
    {
      title: '辖区类型',
      dataIndex: 'prodQuantity3',
      search: false,
    },
    {
      title: '拆分比',
      dataIndex: 'prodQuantity4',
      search: false,
    },
    {
      title: '拆分后数量',
      dataIndex: 'prodQuantity5',
      search: false,
    },
  ];

  return (
    <>
      <Space direction="vertical">
        <Card size={'small'}>
          <h3 style={{ fontWeight: 'bold' }}>标准信息</h3>
          <Descriptions column={3}>
            <Descriptions.Item label={'标准客户名称'}>
              {'标准客户名称'}
            </Descriptions.Item>
            <Descriptions.Item label={'标准经销商名称'}>
              {'标准产品名称'}
            </Descriptions.Item>
            <Descriptions.Item label={'数据ID'}>{'负责路径'}</Descriptions.Item>
            <Descriptions.Item label={'标准产品名称'}>
              {'辖区层级'}
            </Descriptions.Item>
            <Descriptions.Item label={'标准产品规格'}>
              {'产品规格'}
            </Descriptions.Item>
            <Descriptions.Item label={'生产厂家'}>
              {'诺华制药'}
            </Descriptions.Item>
            <Descriptions.Item label={'标准数量'}>{'100'}</Descriptions.Item>
            <Descriptions.Item label={'单位'}>{'盒'}</Descriptions.Item>
            <Descriptions.Item label={'考核价'}>{'18'}</Descriptions.Item>
            <Descriptions.Item label={'金额（考核价）'}>
              {'50'}
            </Descriptions.Item>
            <Descriptions.Item label={'产品省份价格'}>{'50'}</Descriptions.Item>
            <Descriptions.Item label={'金额（省份价格）'}>
              {'50'}
            </Descriptions.Item>
            <Descriptions.Item label={'销售日期'}>
              {'2021-02-03 11:20:09'}
            </Descriptions.Item>
            <Descriptions.Item label={'销售年月'}>
              {'2021-07'}
            </Descriptions.Item>
            <Descriptions.Item label={'标准产品批号'}>
              {'YX001'}
            </Descriptions.Item>
            <Descriptions.Item label={'生产日期'}>
              {'2021-07-07'}
            </Descriptions.Item>
            <Descriptions.Item label={'有效期'}>{'6个月'}</Descriptions.Item>
          </Descriptions>
          <Divider type="horizontal" />
          <h3 style={{ fontWeight: 'bold' }}>原始流向数据</h3>
          <Descriptions column={3}>
            <Descriptions.Item label={'订单日期'}>
              {'2021-02-22 12:14:03'}
            </Descriptions.Item>
            <Descriptions.Item label={'下游地址'}>
              {'浙江省杭州市西湖区XXXX'}
            </Descriptions.Item>
            <Descriptions.Item label={'产品型号'}>
              {'YX0000001'}
            </Descriptions.Item>
            <Descriptions.Item label={'产品线'}>{'-'}</Descriptions.Item>
            <Descriptions.Item label={'单价'}>{'18'}</Descriptions.Item>
            <Descriptions.Item label={'金额'}>{'50'}</Descriptions.Item>
            <Descriptions.Item label={'生产厂家'}>
              {'诺华制药'}
            </Descriptions.Item>
            <Descriptions.Item label={'销售行为'}>{'90101'}</Descriptions.Item>
            <Descriptions.Item label={'销售单号'}>{'90101'}</Descriptions.Item>
            <Descriptions.Item label={'发运单'}>{'90101'}</Descriptions.Item>
            <Descriptions.Item label={'子公司名称'}>
              {'诺华制药'}
            </Descriptions.Item>
            <Descriptions.Item label={'仓库'}>{'六元'}</Descriptions.Item>
            <Descriptions.Item label={'供应商名称'}>{'代文'}</Descriptions.Item>
            <Descriptions.Item label={'供应商名称'}>{'-'}</Descriptions.Item>
            <Descriptions.Item label={'科室'}>{'-'}</Descriptions.Item>
            <Descriptions.Item label={'开票日期'}>{'-'}</Descriptions.Item>
            <Descriptions.Item label={'备注'}>{'-'}</Descriptions.Item>
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

export default TemplateDetails;
