import React, { useState } from 'react';
import { Modal, Form, Button, Select, Radio, DatePicker } from 'antd';
import { history } from 'umi';

const { Option } = Select;
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

interface SelectPeriodProps {
  windowTimeOption?: any[];
}
const SelectPeriod: React.FC<SelectPeriodProps> = ({ windowTimeOption }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const show = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleSubmit = async () => {
    const values = await form?.validateFields();
    let periodArr = values?.periodId?.split('&&');
    let data = {
      periodId: periodArr[0],
      periodName: periodArr.length > 1 ? periodArr[1] : '',
    };
    history.push({
      pathname: '/year-config/transfer-import/import',
      state: data,
    });
  };
  let initPeriodId = '';
  if (windowTimeOption && windowTimeOption[0]) {
    initPeriodId = windowTimeOption[0].value + '&&' + windowTimeOption[0].text;
  }
  return (
    <>
      <Button type={'primary'} onClick={show}>
        数据导入
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        destroyOnClose={true}
        title={'请选择时间窗'}
        onOk={handleSubmit}
      >
        <Form form={form} {...formLayout}>
          <Form.Item
            name="periodId"
            label="时间窗"
            hasFeedback
            initialValue={initPeriodId}
            rules={[{ required: true, message: '请选择销售年月!' }]}
          >
            <Select placeholder="请选择时间窗">
              {windowTimeOption?.map((t: { text: any; value: any }) => (
                <Option key={t?.value} value={t?.value + '&&' + t?.text}>
                  {t?.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SelectPeriod;
