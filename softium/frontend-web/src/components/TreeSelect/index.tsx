import React from 'react';
import { Form, TreeSelect } from 'antd';
import { formItemLayout } from '@/pages/institution/util';

export default (props: any) => {
  const { label, itemLayout, name, rules = [], args } = props;
  const { options, required, fillFn } = args || {};
  const formItem = itemLayout || formItemLayout;
  const onChange = (value: string, label: any[], extra: any) =>
    fillFn && fillFn(value, label, extra);
  required && rules.unshift({ required: true, message: `${label}不可以为空` });
  return (
    <Form.Item {...formItem} name={name} rules={rules} label={label}>
      <TreeSelect
        treeData={options}
        onChange={onChange}
        placeholder={`请选择${label}`}
        showSearch
        filterTreeNode={(inputValue, option) => {
          return option?.name.indexOf(inputValue) >= 0;
        }}
      />
    </Form.Item>
  );
};
