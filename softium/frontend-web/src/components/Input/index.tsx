import React from 'react';
import {
  formItemLayout,
  handleLikeFieldChange,
} from '@/pages/institution/util';
import { Form, Input } from 'antd';

const InputComponent = (props: any) => {
  const {
    placeholder,
    form,
    isLikeField,
    allowClear,
    itemLayout,
    name,
    label,
    args = {},
    rules = [],
    type,
  } = props;
  const { disabled, required } = args;
  const formItem = itemLayout || formItemLayout;
  if (required)
    rules.unshift({ required: true, message: `${label}不可以为空` });
  return (
    <Form.Item {...formItem} name={name} rules={rules} label={label}>
      <Input
        type={type || 'text'}
        disabled={disabled}
        placeholder={placeholder || `请输入${label}`}
        allowClear={typeof allowClear === 'boolean' ? allowClear : true}
        onKeyUp={e => isLikeField && handleLikeFieldChange(e, form, name)}
      />
    </Form.Item>
  );
};

export default InputComponent;
