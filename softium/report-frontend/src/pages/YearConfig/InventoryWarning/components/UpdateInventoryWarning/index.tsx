import React, { useImperativeHandle, useRef, useState } from 'react';
import { Modal, Form, Input, Radio, Col, Row, InputNumber, Select } from 'antd';
import { InventoryWarningConfig } from '@/pages/YearConfig/InventoryWarning/data';
import TextArea from 'antd/es/input/TextArea';
import { useModel } from '@@/plugin-model/useModel';

interface IProps {
  actionRef:
    | React.MutableRefObject<UpdateInventConfigFormActionType | undefined>
    | ((actionRef: UpdateInventConfigFormActionType) => void);
  onSubmit: (data: InventoryWarningConfig) => void;
  submitting?: boolean;
}

export interface UpdateInventConfigFormActionType {
  show: (currentItem?: InventoryWarningConfig) => void;
  hide: () => void;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const UpdateInventoryWarningPage: React.FC<IProps> = ({
  actionRef,
  onSubmit,
}) => {
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryWarningConfig>();
  const { pockets } = useModel('useOptions');
  const [form] = Form.useForm();
  const { productUnti } = pockets;
  const show = (currentItem?: InventoryWarningConfig) => {
    setCurrentItem(currentItem || undefined);
    form.setFieldsValue(currentItem);
    setVisible(true);
  };

  useImperativeHandle(actionRef, () => ({
    show,
    hide: () => {
      setVisible(false);
    },
  }));

  const handleSubmit = async () => {
    const values = await form?.validateFields();
    onSubmit(Object.assign({}, currentItem, values));
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        destroyOnClose={true}
        title={'编辑'}
        onOk={() => handleSubmit()}
        width={'60%'}
      >
        <Form form={form} {...layout} initialValues={currentItem}>
          <Row>
            <Col span={12}>
              <Form.Item name={'productName'} label={'产品名称'}>
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'productSpec'} label={'产品规格'}>
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'productUnit'} label={'产品单位'}>
                <Select disabled={true}>
                  {productUnti?.map(
                    (t: { value: string; text: React.ReactNode }) => (
                      <Select.Option key={t?.value} value={t?.value}>
                        {t?.text}
                      </Select.Option>
                    ),
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'saleAvg'}
                label={'X月平均销售'}
                rules={[
                  {
                    required: true,
                  },
                  {
                    validator: (rule: any, value: any, callBack: any) => {
                      if (value < 0) {
                        callBack('X月平均销售必须大于等于0');
                      } else {
                        callBack();
                      }
                    },
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'maxDayExp'}
                label={'库存天期预警最高值'}
                rules={[
                  {
                    required: true,
                  },
                  {
                    validator: (rule: any, value: any, callBack: any) => {
                      if (value < 0) {
                        callBack('库存天期预警最高值必须大于等于0');
                      } else {
                        callBack();
                      }
                    },
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'minDayExp'}
                label={'库存天期预警最低值'}
                rules={[
                  {
                    required: true,
                  },
                  {
                    validator: (rule: any, value: any, callBack: any) => {
                      if (value < 0) {
                        callBack('库存天期预警最低值必须大于等于0');
                      } else {
                        callBack();
                      }
                    },
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateInventoryWarningPage;
