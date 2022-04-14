import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  TreeSelect,
  Input,
  InputNumber,
  DatePicker,
  message,
} from 'antd';
import { getSkuLevel, getTree } from '@/services/product/product';
import DebounceSelect from '@/components/DebounceSelect';
import { getInstitutionList } from '@/services/priceControl';
import { getColumns } from '@/pages/institution/util';
import { addTerminalPrice } from '@/services/product/terminalPrice';

export default forwardRef((props: any, ref) => {
  const { actionRef } = props;

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productTreeList, setProductTreeList] = useState([]);
  const [columns, setColumns] = useState([]);

  const getProductTree = async () => {
    try {
      const res = await getSkuLevel();
      const { data = [] } = await getTree();
      setProductTreeList(transformProductTree(data, res.data));
    } catch (e) {
      console.log(e);
    }
  };

  const onSearch = (value: string, type: string) => {
    return getInstitutionList({
      pageSize: 40,
      likeField: value ? [value] : null,
      type: type ? [type] : null,
      state: 'Active',
    });
  };

  const transformProductTree = (data: any, skuLevel: string) => {
    return (data || []).map((item: any) => {
      return {
        ...item,
        value: item.code,
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
    getPriceColumns();
  }, []);

  const getPriceColumns = async () => {
    const fields: any = await getColumns('t_sfe_terminal_price');
    setColumns((fields.allFields || []).filter((item: any) => !item.isHidden));
  };

  const [form] = Form.useForm();

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
        props: { id },
      },
    } = extra;
    form.setFields([
      {
        name: 'productId',
        value: id,
      },
    ]);
  };

  const institutionChange = (value: any, record: any, type: string) => {
    if (type === 'terminal') {
      form.setFields([
        {
          name: 'terminalId',
          value: record.id,
        },
      ]);
    } else {
      form.setFields([
        {
          name: 'upInstitutionId',
          value: record.id,
        },
      ]);
    }
  };

  const columnRender: any = {
    upInstitutionCode: {
      rules: [
        {
          required: true,
          message: '请选择上游机构',
        },
      ],
      component: (
        <DebounceSelect
          fetchOptions={onSearch}
          placeholder="请选择上游机构"
          onChange={institutionChange}
          byCode={true}
        />
      ),
    },
    terminalCode: {
      component: (
        <DebounceSelect
          fetchOptions={onSearch}
          placeholder="请选择终端"
          onChange={(value: string, record: any) =>
            institutionChange(value, record, 'terminal')
          }
          byCode={true}
        />
      ),
    },
    productCode: {
      rules: [
        {
          required: true,
          message: '请选择产品',
        },
      ],
      component: (
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
      ),
    },
    evaluationPrice: {
      rules: [
        {
          pattern: /^\d*(?:\.\d{0,4})?$/g,
          message: '小数点不可编辑超出4位、不可为负数',
        },
      ],
      component: (
        <InputNumber placeholder="请输入考核价" style={{ width: '100%' }} />
      ),
    },
    invoicePrice: {
      rules: [
        {
          pattern: /^\d*(?:\.\d{0,4})?$/g,
          message: '小数点不可编辑超出4位、不可为负数',
        },
      ],
      component: (
        <InputNumber placeholder="请输入开票价" style={{ width: '100%' }} />
      ),
    },
    discount: {
      rules: [
        {
          pattern: /^\d*(?:\.\d{0,4})?$/g,
          message: '小数点不可编辑超出4位、不可为负数',
        },
      ],
      component: (
        <InputNumber placeholder="请输入折扣率" style={{ width: '100%' }} />
      ),
    },
    price: {
      rules: [
        {
          pattern: /^\d*(?:\.\d{0,4})?$/g,
          message: '小数点不可编辑超出4位、不可为负数',
        },
        {
          required: true,
          message: '请输入销售价',
        },
      ],
      component: (
        <InputNumber placeholder="请输入销售价" style={{ width: '100%' }} />
      ),
    },
    startDate: {
      rules: [
        {
          required: true,
          message: '请选择生效日期',
        },
        {
          validator: (rule: any, value: any) =>
            new Promise((resolve, reject) => {
              const endDate = form.getFieldValue('endDate');
              if (endDate && endDate.isBefore(value) && value) {
                reject('生效日期应小于结束日期');
              }
              resolve('');
            }),
        },
      ],
      component: <DatePicker />,
    },
    endDate: {
      rules: [
        {
          required: true,
          message: '请选择结束日期',
        },
        {
          validator: (rule: any, value: any) =>
            new Promise((resolve, reject) => {
              const startDate = form.getFieldValue('startDate');
              if (startDate && startDate.isAfter(value) && value) {
                reject('结束日期应大于生效日期');
              }
              resolve('');
            }),
        },
      ],
      component: <DatePicker />,
    },
  };

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await addTerminalPrice({
        ...values,
      });
      message.success('添加成功');
      toggleVisible();
      actionRef.current.reload();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={toggleVisible}
      width="60%"
      title="添加经销商价格"
      confirmLoading={loading}
      onOk={onOk}
    >
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Form.Item noStyle name="upInstitutionId" />
        <Form.Item noStyle name="terminalId" />
        <Form.Item noStyle name="productId" />
        <Row>
          {(columns || []).map((item: any) => {
            const render = columnRender[item.name] || {};
            return (
              <Col span={8} key={item.name}>
                <Form.Item
                  label={item.dispName}
                  name={item.name}
                  rules={render.rules || []}
                >
                  {render.component || (
                    <Input placeholder={`请输入${item.dispName}`} />
                  )}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </Modal>
  );
});
