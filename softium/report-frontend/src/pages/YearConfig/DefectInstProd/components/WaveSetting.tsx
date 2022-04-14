import React, { useImperativeHandle, useState } from 'react';
import { Modal, Form, Alert } from 'antd';
import IInputNumber from '@/components/IInputNumber';

const formLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 10 },
};

const DefectInsWaveSetting: React.FC<ModalFormControl.Props<
  DefectInsProd.DefectInstProdConfig
>> = ({ actionRef, onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<
    DefectInsProd.DefectInstProdConfig
  >({});
  const [form] = Form.useForm();

  const show = (
    values: DefectInsProd.DefectInstProdConfig = {
      observeDays: 5,
      consultDays: 30,
      thresholds: 0.75,
    },
  ) => {
    setInitialValues(
      (values && {
        ...values,
        observeDays: values?.observeDays ? values.observeDays : 5,
        consultDays: values?.consultDays ? values.consultDays : 30,
        thresholds: values?.thresholds ? values.thresholds * 100 : 75,
      }) ||
        {},
    );
    form.setFieldsValue({
      ...values,
      observeDays: values?.observeDays ? values.observeDays : 5,
      consultDays: values?.consultDays ? values.consultDays : 30,
      thresholds: values?.thresholds ? values.thresholds * 100 : 75,
    });
    setVisible(true);
  };

  useImperativeHandle(actionRef, () => ({
    show,
    hide: () => setVisible(false),
  }));

  const handleSubmit = async () => {
    const values = await form?.validateFields();
    onSubmit(
      Object.assign({}, initialValues, values, {
        thresholds: values.thresholds / 100,
      }),
    );
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      destroyOnClose={true}
      title={'波动规则设置'}
      onOk={handleSubmit}
    >
      <Alert
        message={'波动观察范围必须小于波动参考范围'}
        type={'info'}
        showIcon
        style={{ margin: '0 auto 20px', width: '60%' }}
      />
      <Form form={form} {...formLayout} initialValues={initialValues}>
        <Form.Item
          name={'observeDays'}
          label={'波动观察范围'}
          rules={[
            {
              required: true,
              message: '请输入波动观察范围',
            },
            {
              type: 'number',
              min: 1,
              max: 90,
              message: '波动观察范围在1-30之间的数字',
            },
          ]}
        >
          <IInputNumber suffix={'天'} />
        </Form.Item>
        <Form.Item
          name={'consultDays'}
          label={'波动参考范围'}
          rules={[
            {
              required: true,
              message: '请输入波动参考范围',
            },
            {
              type: 'number',
              min: 1,
              max: 90,
              message: '波动参考范围在1-90之间的数字',
            },
          ]}
        >
          <IInputNumber suffix={'天'} />
        </Form.Item>
        <Form.Item
          name={'thresholds'}
          label={'风险指数'}
          rules={[
            {
              required: true,
              message: '请输入风险指数',
            },
            {
              type: 'number',
              min: 1,
              max: 90,
              message: '风险指数在1-100之间数字',
            },
          ]}
        >
          <IInputNumber
            min={0}
            max={100}
            formatter={value => `${value}%`}
            parser={value => value?.replace('%', '') || 0}
            prefix={'高于'}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DefectInsWaveSetting;
