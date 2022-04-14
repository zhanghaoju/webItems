import React, { useImperativeHandle, useState } from 'react';
import { Button, Modal, Row, Col, Tooltip } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { QuestionOutlined } from '@ant-design/icons';
import { getDetail } from '@/services/provincePrice';

interface ColumnItemProps {
  id?: string;
  category?: string;
  provinceId: string;
  productCode: string;
}
const DetailModal = (props: any) => {
  const [visible, setVisible] = useState(false);
  const [paramsProps, setParams] = useState<any>({});
  const toggleVisible = (bool: boolean) => {
    setVisible(bool);
  };

  useImperativeHandle(props.cRef, () => ({
    // visible: toggleVisible,
    params: (data: any) => {
      setParams({
        record: data.record,
      });
      toggleVisible(data.visible);
    },
  }));
  const columns: ProColumns<ColumnItemProps>[] = [
    {
      title: '生效日期',
      dataIndex: 'startDate',
      ellipsis: true,
      valueType: 'date',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      ellipsis: true,
      valueType: 'date',
    },
    {
      title: (
        <>
          供货价
          <Tooltip placement="top" title="下游购进价格">
            <QuestionOutlined style={{ marginLeft: 2, fontSize: 12 }} />
          </Tooltip>
        </>
      ),
      dataIndex: 'price',
      ellipsis: true,
    },
  ];
  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      centered
      onCancel={() => toggleVisible(false)}
      footer={[
        <Button key="primary" onClick={() => toggleVisible(false)}>
          确定
        </Button>,
      ]}
      width={'50%'}
      title="详情"
      visible={visible}
    >
      <Row>
        <Col span={6}>产品编码：{paramsProps?.record?.productCode}</Col>
        <Col span={6}>产品名称：{paramsProps?.record?.productName}</Col>
        <Col span={6}>规格：{paramsProps?.record?.specification}</Col>
        <Col span={6}>省份：{paramsProps?.record?.province}</Col>
      </Row>
      <ProTable<ColumnItemProps, String[]>
        columns={columns}
        form={{ autoComplete: 'off' }}
        request={() => {
          return getDetail({
            provinceId: paramsProps?.record.provinceId,
            productCode: paramsProps?.record.productCode,
          });
        }}
        postData={(data: any) => {
          return data?.list || [];
        }}
        options={false}
        search={false}
        pagination={false}
        rowKey={record => record?.provinceId + record?.productCode}
      />
    </Modal>
  );
};

export default DetailModal;
