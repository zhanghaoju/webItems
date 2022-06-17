import React, { useImperativeHandle, useState } from 'react';
import { Button, Descriptions, Modal } from 'antd';
import { getDictionary } from '@/pages/institution/util';

const Detail = (props: any) => {
  const { cRef } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  const toggleVisible = () => setVisible(!visible);

  const open = (record: any) => {
    toggleVisible();
    setData(record);
  };

  useImperativeHandle(cRef, () => ({
    open,
  }));

  return (
    <Modal
      width="50%"
      centered
      visible={visible}
      onCancel={() => toggleVisible()}
      footer={[<Button onClick={() => toggleVisible()}>确定</Button>]}
      title="任务详情"
    >
      <Descriptions>
        <Descriptions.Item label="机构名称">
          {data.institutionName}
        </Descriptions.Item>
        <Descriptions.Item label="机构编码">
          {data.institutionCode}
        </Descriptions.Item>
        <Descriptions.Item label="原始机构属性">
          {getDictionary('InstitutionCategory', data.fromType)}
        </Descriptions.Item>
        <Descriptions.Item label="变更后属性">
          {getDictionary('InstitutionCategory', data.toType)}
        </Descriptions.Item>
        <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default Detail;
