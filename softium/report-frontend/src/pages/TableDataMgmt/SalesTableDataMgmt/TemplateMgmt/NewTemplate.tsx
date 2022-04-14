import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { history, useRequest } from 'umi';
import {
  addTemplate,
  editTemplate,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/api';
import { TemplateList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/data';
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
interface NewTemplateProps {
  type?: 'add' | 'edit';
  item?: TemplateList;
  tempContentType?: string;
}
const NewTemplate: React.FC<NewTemplateProps> = ({
  type,
  item,
  tempContentType,
}) => {
  const addTemplateRequest = useRequest(addTemplate, {
    manual: true,
    formatResult: res => res,
    onSuccess: async data => {
      const values = await form?.validateFields();
      let entity = { ...values, ...{ id: data?.data } };
      history.push({
        pathname: `/table-data-mgmt/sales/template-add`,
        state: {
          type: 'add',
          data: entity,
        },
      });
    },
  });
  const editTemplateRequest = useRequest(editTemplate, {
    formatResult: res => res,
    manual: true,
    onSuccess: async data => {
      const values = await form?.validateFields();
      let entity = { ...item, ...values };
      history.push({
        pathname: `/table-data-mgmt/sales/template-add`,
        state: {
          type: tempContentType,
          data: entity,
        },
      });
      setVisible(false);
    },
  });
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const show = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleSubmit = async () => {
    const values = await form?.validateFields();
    if (type === 'add') {
      addTemplateRequest.run(values);
    } else {
      let entity = { ...item, ...values };
      editTemplateRequest.run(entity);
    }
  };

  return (
    <>
      {type === 'add' ? (
        <Button onClick={show}>新建模板</Button>
      ) : (
        <a onClick={show} style={{ margin: '0 0 5px 10px' }}>
          修改
        </a>
      )}
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        destroyOnClose={true}
        title={type === 'add' ? '新建下载模板' : '编辑下载模板'}
        onOk={handleSubmit}
      >
        <Form form={form} {...formLayout}>
          <Form.Item
            name={'templateName'}
            label={'模板名称'}
            initialValue={item?.templateName}
            rules={[
              {
                required: true,
                message: '请输入模板名称',
              },
            ]}
          >
            <Input placeholder={'请输入模板名称'} />
          </Form.Item>
          <Form.Item
            initialValue={item?.templateDescribe}
            name={'templateDescribe'}
            label={'调整原因'}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default NewTemplate;
