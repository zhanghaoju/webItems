import React, { useEffect, useState } from 'react';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import { Select } from 'antd';

const CitySelect: React.FC<{
  state: {
    type: string;
  };
  value?: string;
  form: any;
  onChange: (value: string[]) => void;
  onFilter?: boolean;
}> = props => {
  const { state, onFilter } = props;
  let options = getDictionaryBySystemCode('Region') || [];
  const [value, setValue] = useState<string[] | undefined>(undefined);
  const [innerOptions, setOptions] = useState<
    {
      label: React.ReactNode;
      value: number;
    }[]
  >([]);
  useEffect(() => {
    const { type } = state || {};
    const region: any[] = options.filter((item: any) => item.value === type);
    const children: any[] =
      region && region.length > 0 ? region[0].children : [];
    setOptions(children);
    const res = props.form.getFieldsValue();
    const cityCode: string[] = res.cityCode;
    const isEmpty: boolean =
      !cityCode ||
      (cityCode &&
        cityCode.length > 0 &&
        !children.find(item => item.value === cityCode[0]));
    setValue(isEmpty ? undefined : cityCode);
    res.cityCode = isEmpty ? undefined : cityCode;
    props.form.setFieldsValue(res);
  }, [JSON.stringify(state)]);
  return (
    <Select
      placeholder="请选择"
      mode="multiple"
      value={value}
      filterOption={(input, option: any) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onChange={(value: string[]) => {
        setValue(value);
        props.onChange(value);
      }}
      allowClear
    >
      {(innerOptions || []).map((item: any) => {
        return (
          <Select.Option key={item.value} value={item.value}>
            {item.name}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default CitySelect;
