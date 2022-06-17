import React from 'react';

export interface Columns {
  label?: React.ReactNode;
  title: any;
  dataIndex: string;
  ellipsis?: boolean;
  fixed?: string;
  search?: false | { transform: (value: any) => any };
  tooltip?: string | false;
  hideInTable?: boolean;
  width?: string | number;
  valueType?: any;
  request?: () => void;
  onFilter?: boolean;
  fieldProps?: any;
  renderFormItem?: any;
  renderText?: any;
  render?: any;
  filters?: boolean;
  valueEnum?: any;
  order?: number;
  hideInSearch?: boolean;
}
