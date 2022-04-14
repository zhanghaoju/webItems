import React, { useEffect, useState } from 'react';
import { formItemLayout } from '@/pages/institution/util';
import { Form, Radio } from 'antd';
import { getDictionary } from '@/utils/utils';

const RadioComponent = (props: any) => {
  const [options, setOptions] = useState<any[]>([]);
  const { args, itemLayout, name, label } = props;
  const { dictionary, disabled } = args || {};
  const formItem = itemLayout || formItemLayout;

  useEffect(() => setOptions(getDictionary(dictionary)), [dictionary]);

  return (
    <Form.Item {...formItem} name={name} label={label}>
      <Radio.Group disabled={!!disabled}>
        {options.map((item: any) => {
          return (
            <Radio key={item.value} value={item.value}>
              {item.name || item.label}
            </Radio>
          );
        })}
      </Radio.Group>
    </Form.Item>
  );
};

export default RadioComponent;
