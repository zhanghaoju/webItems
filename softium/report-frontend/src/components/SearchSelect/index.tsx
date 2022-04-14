import React, { useState } from 'react';
import { Select, Spin } from 'antd';
import { SelectProps } from 'antd/es/select';
import request from '@/utils/request';
import { useDebounceFn } from 'ahooks';
import { FormInstance } from 'antd/es/form';

export interface SearchSelectProps extends SelectProps<any> {
  searchurl: string;
  allowinput?: boolean;
  fieldsProps?: {
    label: string;
    value?: string;
  };
  baseurl?: string;
  searchkey: string;
  form: FormInstance;
  name: string | number | (string | number)[];
}

const SearchSelect: React.FC<SearchSelectProps> = props => {
  const {
    fieldsProps,
    searchurl,
    searchkey,
    form,
    name,
    allowinput,
    baseurl,
  } = props;

  const [fetching, setFetching] = useState<boolean>(false);
  const { label, value } = fieldsProps || {
    label: 'label',
  };

  const handleChange = async (value: string) => {
    if (value) {
      if (allowinput) {
        form.setFields([
          {
            name,
            value: { label: value, value: undefined },
          },
        ]);
      }
      await run(value);
    }
  };

  const [data, setData] = useState<any[]>([]);
  const fetchOptions = async (value: string) => {
    setFetching(true);
    try {
      const res = await request({
        url: searchurl,
        method: 'GET',
        params: {
          [searchkey]: value,
        },
        baseURL: baseurl,
      });
      setFetching(false);
      setData(res?.data);
    } catch (e) {
      setFetching(false);
      throw e;
    }
  };

  const { run } = useDebounceFn(fetchOptions, { wait: 500 });

  return (
    <Select
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      showSearch={true}
      labelInValue={true}
      onSearch={handleChange}
      allowClear={true}
      {...props}
    >
      {data?.map(t => {
        return (
          <Select.Option
            key={(value && t[value]) || JSON.stringify(t)}
            value={(value && t[value]) || JSON.stringify(t)}
          >
            {t[label] || t?.label}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default SearchSelect;
