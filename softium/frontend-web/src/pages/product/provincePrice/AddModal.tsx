import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  Modal,
  Form,
  TreeSelect,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
} from 'antd';
import { getTree, getSkuLevel } from '@/services/product/product';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import { addPrice } from '@/services/provincePrice';

export default forwardRef((props: any, ref) => {
  const { actionRef } = props;

  const [visible, setVisible] = useState(false);
  const [productTreeList, setProductTreeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const getProductTree = async () => {
    try {
      const res = await getSkuLevel();
      const { data = [] } = await getTree();
      setProductTreeList(transformProductTree(data, res.data));
    } catch (e) {
      console.log(e);
    }
  };

  const transformProductTree = (data: any, skuLevel: string) => {
    return (data || []).map((item: any) => {
      return {
        ...item,
        value: item.id,
        title: item.name,
        disabled: item.level !== skuLevel,
        ...((item.children &&
          item.children.length > 0 && {
            children: transformProductTree(item.children, skuLevel),
          }) ||
          {}),
      };
    });
  };

  useEffect(() => {
    getProductTree();
  }, []);

  const toggleVisible = () => {
    form.resetFields();
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    toggleVisible,
  }));

  const productTreeChange = (value: string, label: any, extra: any) => {
    const {
      triggerNode: {
        props: { specification, code },
      },
    } = extra;
    form.setFields([
      {
        name: 'specification',
        value: specification,
      },
      {
        name: 'productCode',
        value: code,
      },
    ]);
  };

  const provinceChange = (value: string, option: any) => {
    form.setFields([
      {
        name: 'province',
        value: option.children,
      },
    ]);
  };

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await addPrice({
        ...values,
        ...((values.date &&
          values.date.length > 0 && {
            startDate: values.date[0],
            endDate: values.date[1],
          }) ||
          {}),
      });
      setLoading(false);
      message.success('添加成功');
      toggleVisible();
      actionRef?.current?.reload();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="添加省份价格"
      visible={visible}
      onCancel={toggleVisible}
      width="60%"
      onOk={onOk}
      confirmLoading={loading}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Row>
          <Col span={8}>
            <Form.Item
              label="产品名称"
              name="productId"
              rules={[
                {
                  required: true,
                  message: '请选择产品名称',
                },
              ]}
            >
              <TreeSelect
                placeholder="请选择产品名称"
                treeData={productTreeList}
                filterTreeNode={(inputValue, option) => {
                  return (
                    (option &&
                      option.title &&
                      (option.title as string).indexOf(inputValue) > -1) ||
                    false
                  );
                }}
                showSearch
                onChange={productTreeChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="产品规格" name="specification">
              <Input placeholder="产品规格" disabled={true} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="产品编码" name="productCode">
              <Input placeholder="产品编码" disabled={true} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="province" noStyle />
            <Form.Item
              label="省份"
              name="provinceId"
              rules={[
                {
                  required: true,
                  message: '请选择省份',
                },
              ]}
            >
              <Select placeholder="请选择省份" onChange={provinceChange}>
                {(getDictionaryBySystemCode('Region') || []).map(
                  (item: any) => (
                    <Select.Option value={item.value} key={item.value}>
                      {item.name}
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} />
          <Col span={8} />
          <Col span={8}>
            <Form.Item
              label="供货价"
              name="price"
              rules={[
                {
                  required: true,
                  message: '请输入供货价',
                },
                {
                  pattern: /^\d*(?:\.\d{0,4})?$/g,
                  message: '小数点不可编辑超出4位、不可为负数',
                },
              ]}
            >
              <InputNumber placeholder="供货价" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="起止日期"
              name="date"
              rules={[
                {
                  required: true,
                  message: '请选择起止日期',
                },
              ]}
            >
              <DatePicker.RangePicker />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});
