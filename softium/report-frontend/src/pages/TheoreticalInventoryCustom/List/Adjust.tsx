import React, { useImperativeHandle, useState } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';
import {
  AdjustParams,
  TheoreticalInventory,
} from '@/pages/TheoreticalInventory/data';
import TextArea from 'antd/es/input/TextArea';

export declare type AdjustRef = {
  /**
   * @name 显示
   */
  show: (currentItem: TheoreticalInventory) => void;
};

interface AdjustProps {
  actionRef?:
    | React.MutableRefObject<AdjustRef | undefined>
    | ((actionRef: AdjustRef) => void);
  submitting?: boolean;
  onSubmit?: (data: AdjustParams) => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const AdjustTheoreticalInventory: React.FC<AdjustProps> = ({
  actionRef,
  submitting,
  onSubmit,
}) => {
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<TheoreticalInventory>();
  const [form] = Form.useForm();

  const show = (currentItem: TheoreticalInventory) => {
    setCurrentItem(currentItem);
    form.resetFields();
    setVisible(true);
  };

  useImperativeHandle(actionRef, () => ({
    show,
  }));

  return (
    <>
      <Modal
        title={'调整理论期初库存'}
        visible={visible}
        confirmLoading={submitting}
        onOk={() => form?.submit()}
        maskClosable={false}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form
          {...layout}
          form={form}
          onFinish={async value => {
            const dataToSubmit: AdjustParams = {
              id: currentItem?.id,
              adjustReasonNew: value?.adjustReasonNew,
              adjustValNew: value?.adjustValNew,
            };
            try {
              if (onSubmit) {
                (await onSubmit) && onSubmit(dataToSubmit);
                setVisible(false);
              }
            } catch (e) {
              throw e;
            }
          }}
        >
          <Form.Item
            label={'调整量'}
            name={'adjustValNew'}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder={'请输入'} />
          </Form.Item>
          <Form.Item label={'调整原因'} name={'adjustReasonNew'}>
            <TextArea style={{ width: '100%' }} placeholder={'请输入'} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdjustTheoreticalInventory;
