import React, { useCallback, useEffect, useState } from 'react';
import { Form, Select, Spin } from 'antd';
import _ from 'lodash';
import { getDictionary, getOptions, layout1 } from '@/utils/utils';

const SelectComponent = (props: any) => {
  const [initOptions, setOptions] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const {
    label,
    value,
    name,
    args,
    attr = {},
    rules = [],
    onChange,
    form,
  } = props;
  const {
    dictionary,
    parentKey,
    childKey,
    localSearch,
    remoteSearch,
    allowClear,
    disabled,
    span,
    request,
    required,
    placeholder,
    selectSearch,
    fillFn,
    options,
    itemLayout,
  } = args || {};
  const layout: any = itemLayout || (span === 24 ? layout1 : {});
  delete attr.allowClear;
  const handleChina = useCallback(() => {
    const result: any =
      getOptions(
        getDictionary(dictionary) || [],
        form.getFieldValue(parentKey),
      ) || {};
    setOptions(result.children || []);
  }, [form, parentKey, dictionary]);

  useEffect(() => {
    parentKey
      ? handleChina()
      : setOptions(options || getDictionary(dictionary));
  }, [dictionary, parentKey, handleChina]);

  const handleChange = (val: any) => {
    !fillFn && onChange && onChange(val);
    fillFn && fillFn({ val, form, initOptions });
    childKey && form.resetFields(childKey.split(','));
  };
  const { nameKey = 'name', paramsKey, nameKeyType, params } =
    selectSearch || {};
  const handleSearch = (val: string) => {
    if (val.trim()) {
      const searchParams: any = form.getFieldsValue(paramsKey);
      setFetching(true);
      request({
        [nameKey]: nameKeyType === 'array' ? [val] : val,
        ...params,
        ...searchParams,
      })
        .then((res: any) => {
          const data: any[] = _.isArray(res.data)
            ? res.data
            : _.isArray(res?.data?.list)
            ? res?.data.list
            : [];
          setOptions([...data]);
        })
        .finally(() => setFetching(false));
    }
  };

  if (required)
    rules.unshift({ required: true, message: placeholder || `请选择${label}` });

  return (
    <Form.Item
      style={{ width: '100%' }}
      {...layout}
      label={label}
      name={value || name}
      rules={rules}
    >
      <Select
        style={{ width: '100%' }}
        placeholder={placeholder || `请选择${label}`}
        disabled={disabled}
        {...attr}
        notFoundContent={fetching && <Spin size="small" />}
        allowClear={typeof allowClear === 'boolean' ? allowClear : true}
        showSearch={remoteSearch || localSearch}
        onSearch={request && _.debounce(handleSearch, 500)}
        filterOption={
          remoteSearch
            ? false
            : (input, option: any) =>
                (option.label || option.children)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA: any, optionB: any) =>
          !remoteSearch &&
          localSearch &&
          (optionA.label || optionA.children)
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
        onChange={value => handleChange(value)}
      >
        {(initOptions || []).map((item: any) => {
          return (
            <Select.Option
              key={item.value || item.id}
              value={item.value || item.id}
            >
              {item.name || item.label}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
};

export default SelectComponent;
