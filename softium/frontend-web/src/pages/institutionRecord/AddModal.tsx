import React, { useImperativeHandle, useState, forwardRef } from 'react';
import { Modal, Form, Row, Col, Input, TreeSelect } from 'antd';
import DebounceSelect from '@/components/DebounceSelect';
import { getInstitutionList } from '@/services/priceControl';
import {
  getDictionaryBySystemCode,
  getNameByValue,
} from '@/utils/dataConversion';

export default forwardRef((props: any, ref: React.Ref<any>) => {
  const {
    columnList,
    productList,
    territoryTree,
    onOk,
    loopData,
    loopDataTree,
  } = props;
  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const toggleLoading = () => {
    setLoading(!loading);
  };

  useImperativeHandle(ref, () => ({
    setVisible: toggleVisible,
    form,
    toggleLoading,
  }));

  const onSearch = (value: string, type: string) => {
    return getInstitutionList({
      pageSize: 40,
      likeField: value ? [value] : null,
      type: type ? [type] : null,
      state: 'Active',
    });
  };

  const institutionChange = (value: any, record: any, type: string) => {
    let fields = [];
    switch (type) {
      case 'Agent':
        fields = [
          {
            name: 'agentCode',
            value: record.code,
          },
          {
            name: 'agentContacts',
            value: record.contacts,
          },
        ];
        break;
      case 'Distributor':
        fields = [
          {
            name: 'distributorCode',
            value: record.code,
          },
        ];
        break;
      default:
        fields = [
          {
            name: 'institutionCode',
            value: record.code,
          },
          {
            name: 'institutionCategory',
            value: getNameByValue(
              getDictionaryBySystemCode('InstitutionCategory'),
              record.type,
            ),
          },
        ];
        break;
    }
    form.setFields(fields);
  };

  const productChange = (check: any, values: any, record: any) => {
    const {
      triggerNode: {
        props: { code, specification, manufacturer },
      },
    } = record;
    form.setFields([
      {
        name: 'productCode',
        value: code,
      },
      {
        name: 'specification',
        value: specification,
      },
      {
        name: 'manufacturer',
        value: manufacturer,
      },
    ]);
  };

  const territoryTreeChange = (check: any, values: any, record: any) => {
    const {
      triggerNode: {
        props: { code, staffName },
      },
    } = record;
    form.setFields([
      {
        name: 'nodeCode',
        value: code,
      },
      {
        name: 'nodeHead',
        value: staffName,
      },
    ]);
  };

  const columnRender: any = {
    institutionName: {
      rules: [
        {
          required: true,
          message: '请选择机构',
        },
      ],
      component: (
        <DebounceSelect
          fetchOptions={onSearch}
          placeholder="请选择机构"
          onChange={institutionChange}
        />
      ),
    },
    institutionCode: {
      disabled: true,
      placeholder: '机构编码',
    },
    institutionCategory: {
      disabled: true,
      placeholder: '机构类型',
    },
    productName: {
      rules: [
        {
          required: true,
          message: '请选择产品',
        },
      ],
      component: (
        <TreeSelect
          placeholder="请选择产品"
          onChange={productChange}
          treeData={loopData(productList)}
          showSearch
          filterTreeNode={(inputValue, option) => {
            return option?.name.indexOf(inputValue) >= 0;
          }}
        />
      ),
    },
    productCode: {
      disabled: true,
      placeholder: '产品编码',
    },
    specification: {
      disabled: true,
      placeholder: '规格',
    },
    manufacturer: {
      disabled: true,
      placeholder: '生产厂家',
    },
    nodeName: {
      component: (
        <TreeSelect
          placeholder="请选择辖区"
          treeData={loopDataTree(territoryTree)}
          showSearch
          filterTreeNode={(inputValue, option) => {
            return option?.name.indexOf(inputValue) >= 0;
          }}
          onChange={territoryTreeChange}
        />
      ),
    },
    nodeCode: {
      disabled: true,
      placeholder: '辖区编码',
    },
    nodeHead: {
      disabled: true,
      placeholder: '辖区负责人',
    },
    agentName: {
      component: (
        <DebounceSelect
          fetchOptions={(value: string) => onSearch(value, 'Agent')}
          placeholder="请选择代理商"
          onChange={(value: any, record: any) =>
            institutionChange(value, record, 'Agent')
          }
        />
      ),
    },
    agentCode: {
      disabled: true,
      placeholder: '代理商编码',
    },
    agentContacts: {
      disabled: true,
      placeholder: '代理商联系人',
    },
    distributorName: {
      component: (
        <DebounceSelect
          fetchOptions={(value: string) => onSearch(value, 'Distributor')}
          placeholder="请选择配送商"
          onChange={(value: any, record: any) =>
            institutionChange(value, record, 'Distributor')
          }
        />
      ),
    },
    distributorCode: {
      disabled: true,
      placeholder: '配送商编码',
    },
  };

  const okClick = async () => {
    try {
      const values = await form.validateFields();
      toggleLoading();
      onOk && onOk(values);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      title="添加机构备案"
      visible={visible}
      width="70%"
      destroyOnClose
      onCancel={() => {
        form.resetFields();
        toggleVisible();
      }}
      onOk={okClick}
      confirmLoading={loading}
    >
      <Form
        form={form}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 6 }}
        autoComplete="off"
      >
        <Row>
          {columnList
            .filter((item: any) => !item.isHidden)
            .map((item: any) => {
              const itemData: any = columnRender[item.name];
              return (
                <Col span={8} key={item.name}>
                  <Form.Item
                    label={item.dispName}
                    name={item.name === 'nodeName' ? 'nodeName_fox' : item.name}
                    rules={(itemData && itemData.rules) || []}
                  >
                    {itemData && itemData.component ? (
                      itemData.component
                    ) : (
                      <Input
                        disabled={itemData && itemData.disabled}
                        placeholder={
                          (itemData && itemData.placeholder) || '请输入'
                        }
                      />
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
