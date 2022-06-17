import React from 'react';
import { InputNumber } from 'antd';

export default (props: any) => {
  const { value, onChange, otherProps } = props;

  const change = (value: any) => {
    onChange && onChange(value);
  };

  return (
    <InputNumber
      {...otherProps}
      value={(typeof value === 'string' ? value.replace(',', '') : value) * 1}
      onChange={change}
      min={0}
      step={0.0001}
    />
  );
};
