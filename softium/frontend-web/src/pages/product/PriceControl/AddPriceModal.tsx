import React, { useState } from 'react';
import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  TreeSelect,
  InputNumber,
  Space,
  Typography,
  message,
} from 'antd';
import DebounceSelect from '@/components/DebounceSelect';
import {
  getDistributorLevelInfo,
  addPrice,
  getInstitutionList,
} from '@/services/priceControl';
import { ActivitiesColumnsProps } from './index';
import { find } from 'lodash';

interface AddPriceModalProps {
  visible: boolean;
  setAddVisible: Function;
  systemCodeDictionary?: any;
  product?: any[];
  skuValue?: string;
  activitiesColumns?: ActivitiesColumnsProps[];
  currentYear: string | null;
  actionRef?: any;
  getList?: any;
}

export default (props: AddPriceModalProps) => {
  const [form] = Form.useForm();

  const {
    visible,
    setAddVisible,
    systemCodeDictionary,
    product,
    skuValue,
    activitiesColumns = [],
    currentYear,
    actionRef,
    getList,
  } = props;
  const [columns, setColumns] = useState([...activitiesColumns]);
  const [allValue, setAllValue] = useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [generated, setGenerated] = useState<boolean>(false);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  const onSearch = (value: string) => {
    return getInstitutionList({
      pageSize: 40,
      likeField: value ? [value] : null,
      state: 'Active',
    });
  };

  const onDistributorSearch = (value: string) => {
    return getInstitutionList({
      pageSize: 40,
      likeField: value ? [value] : null,
      state: 'Active',
      type: ['Distributor'],
    });
  };

  const selectChange = (value: string, option: any) => {
    form.setFields([
      {
        name: 'institutionCode',
        value: option?.code,
      },
      {
        name: 'institutionCategory',
        value: (systemCodeDictionary['InstitutionCategory'] || []).find(
          (item: any) => item.value === option?.type,
        )?.name,
      },
      {
        name: 'institutionType',
        value: option?.type,
      },
    ]);
  };

  const selectDistributorChange = (value: string, option: any) => {
    form.setFields([
      {
        name: 'distributorCode',
        value: option?.code,
      },
    ]);
    const productCode = form.getFieldValue('productCode');
    if (productCode && value) {
      getDistributorLevelInfo({
        institutionId: value,
        likeField: productCode,
      }).then(res => {
        const list = res?.data?.list || [];
        if (list.length > 0) {
          const levelInfo = list[0];
          form.setFields([
            {
              name: 'distributorLevelId',
              value: levelInfo.id,
            },
            {
              name: 'distributorLevelName',
              value: find(systemCodeDictionary['SubclassDealerLevel'] || [], [
                'value',
                levelInfo.level,
              ])?.name,
            },
          ]);
        } else {
          form.setFields([
            {
              name: 'distributorLevelId',
              value: null,
            },
            {
              name: 'distributorLevelName',
              value: null,
            },
          ]);
        }
      });
    }
  };

  const loopData = (data: any) => {
    return data.map((item: any) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          title: `${item.name}${(item.specification &&
            `（${item.specification}）`) ||
            ''}`,
          value: item.id,
          selectable: item.level === skuValue,
          children: loopData(item.children),
          disabled: item.level !== skuValue,
        };
      }
      return {
        ...item,
        title: `${item.name}${(item.specification &&
          `（${item.specification}）`) ||
          ''}`,
        value: item.id,
        selectable: item.level === skuValue,
        disabled: item.level !== skuValue,
      };
    });
  };

  const productChange = (value: string, label: any, extra: any) => {
    form.setFields([
      {
        name: 'productCode',
        value: extra?.triggerNode?.props?.code,
      },
      {
        name: 'specification',
        value: extra?.triggerNode?.props?.code,
      },
      {
        name: 'distributorId',
        value: undefined,
      },
      {
        name: 'distributorCode',
        value: undefined,
      },
      {
        name: 'distributorLevelId',
        value: undefined,
      },
      {
        name: 'distributorLevelName',
        value: undefined,
      },
    ]);
  };

  const generateValue = () => {
    setGenerated(true);
    setColumns(value => {
      const newValue = [...value];
      return newValue.map((item: any) => ({
        ...item,
        numberValue: allValue,
      }));
    });
  };

  const setNumberValue = (value: any, key: string) => {
    setColumns(values => {
      const newValue = [...values];
      return newValue.map(item => {
        return item.key === key
          ? {
              ...item,
              numberValue: value,
            }
          : { ...item };
      });
    });
  };

  const submitPrice = async () => {
    try {
      setConfirmLoading(true);
      if (!generated && allValue !== null) {
        message.error('请点击生成全年每月二次议价后进行提交！');
        setConfirmLoading(false);
        return;
      }
      const values = await form.validateFields();
      columns.forEach(item => {
        values[item.key] = item.numberValue;
      });
      await addPrice({
        ...values,
        financialYearId: currentYear,
        unifiedPrice: allValue,
      });
      message.success('添加成功');
      setConfirmLoading(false);
      getList({}, true);
      setAddVisible(false);
      setGenerated(false);
    } catch (e) {
      setConfirmLoading(false);
      console.log(e);
    }
  };

  return (
    <Modal
      title="添加二次议价"
      width="60%"
      visible={visible}
      onCancel={() => setAddVisible(false)}
      onOk={submitPrice}
      confirmLoading={confirmLoading}
    >
      <Form form={form} {...layout} autoComplete="off">
        <Row>
          <Col span={12}>
            <Form.Item
              label="选择机构"
              name="institutionId"
              rules={[
                {
                  required: true,
                  message: '请选择机构',
                },
              ]}
            >
              <DebounceSelect
                placeholder="请选择"
                fetchOptions={onSearch}
                onChange={selectChange}
              />
            </Form.Item>
          </Col>
          <Col span={12} />
          <Col span={12}>
            <Form.Item label="机构编码" name="institutionCode">
              <Input disabled />
            </Form.Item>
          </Col>
          <Form.Item noStyle={true} name="institutionType" />
          <Col span={12}>
            <Form.Item label="机构类型" name="institutionCategory">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="选择产品"
              name="productId"
              rules={[
                {
                  required: true,
                  message: '请选择产品',
                },
              ]}
            >
              <TreeSelect
                placeholder="请选择"
                treeData={loopData(product)}
                allowClear
                onChange={productChange}
                showSearch
                filterTreeNode={(inputValue, option: any) => {
                  return option.name.indexOf(inputValue) > -1;
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12} />
          <Col span={12}>
            <Form.Item label="产品编码" name="productCode">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="产品品规" name="specification">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="选择经销商"
              name="distributorId"
              rules={[
                {
                  required: true,
                  message: '请选择经销商',
                },
              ]}
            >
              <DebounceSelect
                placeholder="请选择"
                fetchOptions={onDistributorSearch}
                onChange={selectDistributorChange}
              />
            </Form.Item>
          </Col>
          <Col span={12} />
          <Col span={12}>
            <Form.Item label="经销商编码" name="distributorCode">
              <Input disabled />
            </Form.Item>
          </Col>
          <Form.Item noStyle={true} name="distributorLevelId" />
          <Col span={12}>
            <Form.Item label="经销商级别" name="distributorLevelName">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="全年每月二次议价">
              <Space>
                <InputNumber
                  formatter={(value: any) =>
                    `${
                      String(value).indexOf('.') > -1
                        ? String(value).substring(
                            0,
                            String(value).indexOf('.') + 3,
                          )
                        : value
                    }`
                  }
                  parser={(value: any) => value}
                  min={0}
                  step={0.01}
                  onChange={value => setAllValue(value)}
                />
                <Typography.Link onClick={generateValue}>生成</Typography.Link>
              </Space>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="按月二次议价维护"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <Row>
                {columns?.map((item: ActivitiesColumnsProps, index: number) => {
                  return (
                    <Col
                      span={4}
                      key={item.key}
                      style={{ marginBottom: '10px' }}
                    >
                      <Space>
                        <span>{item.value}</span>
                        <InputNumber
                          formatter={(value: any) =>
                            `${
                              String(value).indexOf('.') > -1
                                ? String(value).substring(
                                    0,
                                    String(value).indexOf('.') + 3,
                                  )
                                : value
                            }`
                          }
                          parser={(value: any) => value}
                          min={0}
                          step={0.01}
                          value={item?.numberValue}
                          onChange={value => {
                            setNumberValue(value, item.key);
                          }}
                        />
                      </Space>
                    </Col>
                  );
                })}
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
