import React from 'react';
import { Cascader } from 'antd';
import { CascaderProps } from 'antd/lib/cascader';

interface DCalendarProps extends CascaderProps {}

export default (props: DCalendarProps) => {
  return <Cascader changeOnSelect {...props} />;
};
