import React, { useImperativeHandle, useState } from 'react';
import { Modal, Form, Select, Cascader, Spin } from 'antd';
import { institutionSearch } from '@/services/global';
import { useModel } from 'umi';

import { debounce } from 'lodash';
import { transFormProductOption } from '@/pages/YearConfig/utils';
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const DefectInsProdAdd: React.FC<ModalFormControl.Props<
  DefectInsProd.ListItem
>> = ({ actionRef, onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const [fetching, setFetching] = React.useState(false);
  const [institutionOptions, setInstitutionOptions] = useState<
    {
      key?: string;
      label: React.ReactNode;
      value: string;
    }[]
  >([]);

  const fetchRef = React.useRef(0);

  const fetchOptions = async (value?: string) => {
    let res = [];
    if (value) {
      const searchRes = await institutionSearch(value);
      res = searchRes?.data?.map((t: { name: any; code: any }) => ({
        label: t.name,
        value: t.code,
        key: t.code,
      }));
    }
    return res;
  };

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setInstitutionOptions([]);
      setFetching(true);

      fetchOptions(value).then(newOptions => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setInstitutionOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, 800);
  }, [fetchOptions]);

  const { pockets } = useModel('useOptions');

  const products = pockets?.productOption || [];
  const show = () => {
    form.resetFields();
    setVisible(true);
  };

  useImperativeHandle(actionRef, () => ({
    show,
    hide: () => setVisible(false),
  }));

  const handleSubmit = async () => {
    const values = await form?.validateFields();

    onSubmit({
      institutionCode: values?.institutionCode,
      productCode: [...values?.productCode]?.pop(),
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      destroyOnClose={true}
      title={'新增缺品缺规名单'}
      onOk={handleSubmit}
    >
      <Form form={form} {...formLayout}>
        <Form.Item
          name={'institutionCode'}
          label={'经销商'}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            showSearch={true}
            options={institutionOptions}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={debounceFetcher}
            placeholder={'请输入经销商名称查询'}
          />
        </Form.Item>
        <Form.Item
          name={'productCode'}
          label={'产品'}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Cascader
            placeholder={'请选择'}
            options={transFormProductOption(products)}
            fieldNames={{
              label: 'name',
              value: 'code',
              children: 'children',
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DefectInsProdAdd;
