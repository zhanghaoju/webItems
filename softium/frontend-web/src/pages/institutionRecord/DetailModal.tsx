import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Modal, Descriptions } from 'antd';

export default forwardRef((props: any, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const { columnList, record } = props;

  useImperativeHandle(ref, () => ({
    toggleVisible,
  }));

  return (
    <Modal
      title="机构备案详情"
      visible={visible}
      width="60%"
      footer={
        <Button type="primary" onClick={toggleVisible}>
          确定
        </Button>
      }
      onCancel={toggleVisible}
    >
      <Descriptions>
        {columnList
          .filter((item: any) => !item.isHidden)
          .map((item: any) => (
            <Descriptions.Item label={item.dispName}>
              {record[item.name]}
            </Descriptions.Item>
          ))}
      </Descriptions>
    </Modal>
  );
});
