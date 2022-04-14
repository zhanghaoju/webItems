import React from 'react';
import { InputNumber, Space } from 'antd';
import { InputNumberProps } from 'antd/es/input-number';

export default ({
  suffix,
  prefix,
  ...props
}: InputNumberProps & {
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}) => {
  return (
    <Space style={{ width: '180px' }}>
      {prefix}
      <InputNumber {...props} />
      {suffix}
    </Space>
  );
};
