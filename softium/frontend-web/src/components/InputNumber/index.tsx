import React from 'react';
import { formItemLayout } from '@/pages/institution/util';
import { Form, InputNumber } from 'antd';

const InputNumberComponent = (props: any) => {
  const {
    placeholder,
    disabled,
    allowClear,
    itemLayout,
    name,
    label,
    required,
    rules = [],
    attr,
    args,
  } = props;
  const { unit } = args || {};
  const formItem = itemLayout || formItemLayout;
  return (
    <div className="tax-rate">
      <Form.Item
        {...formItem}
        name={name}
        rules={
          required
            ? [{ required: true, message: `${label}不可以为空` }, ...rules]
            : rules
        }
        label={label}
      >
        <InputNumber
          disabled={disabled}
          placeholder={placeholder || `请输入${label}`}
          style={{ width: '100%' }}
          {...attr}
        />
      </Form.Item>
      <span className="tax-rate-unit">{unit}</span>
    </div>
  );
};

export default InputNumberComponent;
