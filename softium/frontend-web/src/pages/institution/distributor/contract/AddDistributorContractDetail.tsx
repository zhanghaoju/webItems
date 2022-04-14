import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Form, Row, Col, message } from 'antd';
import { getInstitutionList } from '@/services/priceControl';
import { productTree } from '@/services/priceControl';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import { addContractDetail } from '@/services/distributorContract';
import { formItemLayout1, handleColumnsData } from '@/pages/institution/util';
import components from '@/components';
import { layout12 } from '@/utils/utils';

export default forwardRef((props: any, ref) => {
  const { distributorId, contractId, actionRef, allFields } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [okLoading, setOkLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<any[]>([]);
  const [lastLevel, setLastLevel] = useState<any>({});

  const [form] = Form.useForm();

  const toggleVisible = () => {
    form.resetFields();
    if (!visible) {
      productTree().then(({ data }: any) => {
        setProductList(data);
      });
      const lastLevel = (getDictionaryBySystemCode('ProductLevel') || []).find(
        (item: any) => item.systemValue === 'SKU',
      );
      setLastLevel(lastLevel);
    }
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    toggleVisible,
  }));

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setOkLoading(true);
      await addContractDetail({
        ...values,
        distributorId,
        contractId,
      });
      message.success('添加明细成功');
      actionRef?.current?.reload();
      toggleVisible();
      setOkLoading(false);
    } catch (e) {
      console.log(e);
      setOkLoading(false);
    }
  };

  const loopTreeData = (data: any[]): any[] => {
    return data.map((item: any) => {
      return {
        ...item,
        title: item.name,
        value: item.id,
        children:
          (item.children &&
            item.children.length > 0 &&
            loopTreeData(item.children)) ||
          null,
        disabled: item.level !== lastLevel.value,
      };
    });
  };

  const treeSelectChange = (value: string, label: any[], extra: any) => {
    const {
      triggerNode: { props },
    } = extra;
    form.setFields([
      {
        name: 'productCode',
        value: props.code,
      },
      {
        name: 'productId',
        value: props.id,
      },
      {
        name: 'specification',
        value: props.specification,
      },
      {
        name: 'manufacturer',
        value: props.manufacturer,
      },
    ]);
  };

  const fields = [
    {
      itemType: 'select',
      name: 'upInstitutionName',
      label: '上游客户',
      args: {
        remoteSearch: true,
        itemLayout: layout12,
        request: getInstitutionList,
        selectSearch: {
          nameKey: 'likeField',
          nameKeyType: 'array',
          params: {
            pageSize: 40,
            state: 'Active',
          },
        },
        fillFn: ({ val, form, initOptions }: any) => {
          const findRes: any =
            initOptions.find((item: any) => item.id === val) || {};
          form.setFields([
            {
              name: 'upInstitutionCode',
              value: findRes?.code,
            },
            {
              name: 'upInstitutionId',
              value: findRes?.id,
            },
          ]);
        },
      },
    },
    {
      name: 'upInstitutionCode',
      label: '上游编码',
      args: {
        disabled: true,
      },
    },
    {
      itemType: 'treeSelect',
      name: 'productName',
      label: '产品名称',
      args: {
        required: true,
        options: loopTreeData(productList),
        fillFn: (value: string, label: any[], extra: any) => {
          treeSelectChange(value, label, extra);
        },
      },
    },
    {
      itemType: 'text',
      name: 'productCode',
      label: '产品编码',
      args: {
        disabled: true,
      },
    },
    {
      itemType: 'text',
      name: 'specification',
      label: '产品规格',
      args: {
        disabled: true,
      },
    },
    {
      itemType: 'text',
      name: 'manufacturer',
      label: '生产厂家',
      args: {
        disabled: true,
      },
    },
    {
      itemType: 'inputNumber',
      name: 'price',
      label: '采购价',
      attr: {
        min: 0,
        step: 0.0001,
      },
      rules: [
        {
          pattern: /^\d+(\.\d{1,4})?$/,
          message: '小数点后只允许四位',
        },
        {
          validator: (rule: any, value: any) =>
            new Promise((resolve, reject) => {
              if (value) {
                `${value}`.length > 14 ? reject('不可超过14位') : resolve('');
              }
              resolve('');
            }),
        },
      ],
    },
    {
      itemType: 'inputNumber',
      name: 'quota',
      label: '指标',
      attr: {
        min: 0,
        step: 0.0001,
      },
      rules: [
        {
          pattern: /^\d+(\.\d{1,4})?$/,
          message: '小数点后只允许四位',
        },
        {
          validator: (rule: any, value: any) =>
            new Promise((resolve, reject) => {
              if (value) {
                `${value}`.length > 14 ? reject('不可超过14位') : resolve('');
              }
              resolve('');
            }),
        },
      ],
    },
    {
      itemType: 'textarea',
      name: 'remark1',
      label: '备注1',
      args: {
        span: 24,
      },
    },
    {
      itemType: 'textarea',
      name: 'remark2',
      label: '备注2',
      args: {
        span: 24,
      },
    },
    {
      itemType: 'textarea',
      name: 'remark3',
      label: '备注3',
      args: {
        span: 24,
      },
    },
    {
      itemType: 'textarea',
      name: 'remark4',
      label: '备注4',
      args: {
        span: 24,
      },
    },
    {
      itemType: 'textarea',
      name: 'remark5',
      label: '备注5',
      args: {
        span: 24,
      },
    },
  ];

  const hideShowFields = [
    {
      itemType: 'text',
      name: 'upInstitutionId',
      label: '上游客户ID',
      hideShow: true,
    },
    {
      itemType: 'text',
      name: 'productId',
      label: '产品ID',
      hideShow: true,
    },
  ];

  return (
    <Modal
      title="添加明细"
      visible={visible}
      onCancel={toggleVisible}
      width="60%"
      onOk={onSubmit}
      confirmLoading={okLoading}
    >
      <Form form={form} {...formItemLayout} autoComplete="off">
        <Row>
          {[...handleColumnsData(fields, allFields), ...hideShowFields].map(
            (item: any, key: number) => {
              const Component = (components as any)[item.itemType || 'text'];
              return (
                <Col
                  span={item.args?.span || 12}
                  key={key}
                  style={{ display: item.hideShow ? 'none' : '' }}
                >
                  <Component {...item} form={form} />
                </Col>
              );
            },
          )}
        </Row>
      </Form>
    </Modal>
  );
});
