import React from 'react';
import { Form, Input } from 'antd';
import { layout1 } from '@/utils/utils';

const TextareaComponent = (props: any) => {
  const { allowClear, name, label, attr = {}, args = {} } = props;
  const { placeholder, span } = args;
  const layout: any = span === 24 ? layout1 : {};
  return (
    <Form.Item {...layout} name={name} label={label}>
      <Input.TextArea
        {...attr}
        placeholder={placeholder || `请输入${label}`}
        allowClear={
          allowClear && typeof allowClear === 'boolean' ? allowClear : true
        }
      />
    </Form.Item>
  );
};

export default TextareaComponent;
