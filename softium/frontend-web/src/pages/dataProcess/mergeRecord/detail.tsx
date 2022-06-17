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
      footer={[
        <Button key="add" onClick={() => toggleVisible()}>
          确定
        </Button>,
      ]}
      title="任务详情"
    >
      <Descriptions column={2}>
        <Descriptions.Item label="待合并机构名称">
          {data.institutionName}
        </Descriptions.Item>
        <Descriptions.Item label="待合并机构编码">
          {data.institutionCode}
        </Descriptions.Item>
        <Descriptions.Item label="目标机构名称">
          {getDictionary('InstitutionCategory', data.fromType)}
        </Descriptions.Item>
        <Descriptions.Item label="目标机构编码">
          {getDictionary('InstitutionCategory', data.toType)}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="描述">
          {data.description}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default Detail;
