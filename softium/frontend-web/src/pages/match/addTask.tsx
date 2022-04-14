import React, { useState } from 'react';
import { Form, Modal, Input, Select, Button, message } from 'antd';
import './styles/index.less';
import { addTask } from '@/services/match';

const AddMatch = (props: any) => {
  const [initLoading, updateLoading] = useState(false);
  const { templateEnum, setModal } = props;
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const hideModal = () => {
    setModal(false);
  };

  let newTemplateEnum: any[] = [];
  for (let key in templateEnum) {
    newTemplateEnum.push(templateEnum[key]);
  }

  const onFinish = (values: any) => {
    updateLoading(true);
    if (values) {
      addTask(values).then(res => {
        hideModal();
        if (res) {
          updateLoading(false);
          message.success('任务添加成功');
        }
      });
    }
  };

  return (
    <Modal
      maskClosable={false}
      className="modal-width"
      title="添加任务"
      visible={true}
      onCancel={() => hideModal()}
      footer={null}
    >
      <Form {...formLayout} onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="任务名称"
          name="name"
          rules={[{ required: true, message: '请输入任务名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="任务模板"
          name="template"
          rules={[{ required: true, message: '请选择任务模板' }]}
        >
          <Select>
            {newTemplateEnum.map((item: any, index: number) => {
              return (
                <Select.Option key={index} value={item.status}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="任务描述" name="desc">
          <Input.TextArea />
        </Form.Item>
        <div className="add-task-footer">
          <Button type="default" onClick={() => hideModal()}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={initLoading}>
            确定
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddMatch;
