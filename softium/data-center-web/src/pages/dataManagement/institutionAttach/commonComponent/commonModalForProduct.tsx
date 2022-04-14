import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  message,
  Popconfirm,
  Space,
  Modal,
  Card,
  Form,
  Tabs,
  Row,
  Col,
  Input,
  Menu,
  Dropdown,
  Drawer,
  InputNumber,
} from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  attachProductDetail,
  saveProductAttachAdd,
  saveProductAttachEdit,
  productSearch,
} from '@/services/institutionAttach';
import storage from '@/utils/storage';
import { Authorized } from '@vulcan/utils';
import styles from './index.less';
import { downloadFile } from '@/utils/exportFile.ts';
import { ExclamationCircleFilled } from '@ant-design/icons';
import Item from 'antd/lib/list/Item';

interface GithubIssueItem {
  id?: string;
  score?: number;
  code?: string;
  name?: string;
  alias?: string;
  province?: string;
  city?: string;
}

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const CommonModalForProduct = (props: any) => {
  const {
    fatherCurrentData,
    openType,
    goBackAndRefreshPage,
    propsFromForm,
  } = props;
  const [buttonLoading, setButtonLoading] = useState(false);
  const [productPocket1, setProductPocket1] = useState<any>([]);
  const [productPocket2, setProductPocket2] = useState<any>([]);
  const [choiceProduct1, setchoiceProduct1] = useState<any>({});
  const [choiceProduct2, setchoiceProduct2] = useState<any>({});
  const [falseVisible, setFalseVisible] = useState(false);
  const [productLinks, setProductLinks] = useState<any>([]);

  const [form2] = Form.useForm();

  useEffect(() => {
    if (openType === 2 || openType === 3) {
      loadDetail();
    }
  }, []);

  const loadDetail = async () => {
    try {
      const res = await attachProductDetail(fatherCurrentData);
      form2.setFieldsValue({
        attachProductCode: res.data.attachProductCode,
        attachProductName: res.data.attachProductName,
        attachProductSpec: res.data.attachProductSpec,
        productCode: res.data.productCode,
        productName: res.data.productName,
        productSpec: res.data.productSpec,
        originalRatio: res.data.originalRatio,
        attachRatio: res.data.attachRatio,
        remark: res.data.remark,
      });
      setchoiceProduct1({
        name: res.data.attachProductName,
        code: res.data.attachProductCode,
      });
      setchoiceProduct2({
        name: res.data.productName,
        code: res.data.productCode,
      });
      setProductPocket1([
        {
          code: res.data.attachProductCode,
          id: res.data.attachProductCode,
        },
      ]);
      setProductPocket2([
        {
          code: res.data.productCode,
          id: res.data.productCode,
        },
      ]);
    } catch (error) {
      message.error('详情查询失败');
    }
  };

  const submitAttachData = async () => {
    await form2.validateFields();
    setButtonLoading(true);
    setProductLinks([]);
    let submitData: any = {
      ...form2.getFieldsValue(),
      attachProductCode: choiceProduct1.code,
      productCode: choiceProduct2.code,
      ...propsFromForm,
    };
    try {
      let res: any = {};
      if (openType === 1) {
        res = await saveProductAttachAdd({ ...submitData });
      }
      if (openType === 2) {
        res = await saveProductAttachEdit({
          ...submitData,
          id: fatherCurrentData.id,
        });
      }
      if (res.data.success === false) {
        setProductLinks([...res.data.productLinks]);
        setButtonLoading(false);
        setFalseVisible(true);
      } else {
        message.success('保存成功');
        setButtonLoading(false);
        goBackAndRefreshPage();
      }
    } catch (error) {
      message.error('保存失败');
      setButtonLoading(false);
    }
  };

  const handleSearch = async (e: any, source: any) => {
    let searchData = {
      code: e,
    };
    const res = await productSearch(searchData);
    if (source === 1) {
      setProductPocket1(res.data);
    }
    if (source === 2) {
      setProductPocket2(res.data);
    }
  };

  const handleChange = (e: any, source: any) => {
    if (source === 1) {
      productPocket1.forEach((item: any) => {
        if (e === item.id) {
          form2.setFieldsValue({
            attachProductName: item.name,
            attachProductSpec: item.specification,
          });
          setchoiceProduct1(item);
        }
      });
    }
    if (source === 2) {
      productPocket2.forEach((item: any) => {
        if (e === item.id) {
          form2.setFieldsValue({
            productName: item.name,
            productSpec: item.specification,
          });
          setchoiceProduct2(item);
        }
      });
    }
  };

  /* 限制数字输入框只能输入整数 */
  const limitNumber = (value: any) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]/g, '') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : '';
    } else {
      return '';
    }
  };

  const columns3: ProColumns<GithubIssueItem>[] = [
    // {
    //   title: '挂靠类型',
    //   dataIndex: 'kind',
    //   valueType: 'text',
    //   width: '15%',
    // },
    {
      title: '挂靠前产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '挂靠前产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      width: '10',
    },
    {
      title: '挂靠前产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '挂靠后产品名称',
      dataIndex: 'attachProductName',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '挂靠后产品编码',
      dataIndex: 'attachProductCode',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '挂靠后产品规格',
      dataIndex: 'attachProductSpec',
      valueType: 'text',
      width: '10%',
    },
  ];

  //添加、编辑、查看状态变量
  const isAdd = openType === 1;
  const isEdit = openType === 2;
  const isView = openType === 3;
  //编辑、查看、添加（省和市都选择的情况下菜显示下面的）
  const isShowAnotherForAttach =
    isEdit || isView || (isAdd && !!form2.getFieldValue('attachProductName'));
  const isShowAnotherForOrigin =
    isEdit || isView || (isAdd && !!form2.getFieldValue('productName'));
  const actionRef = useRef<ActionType>();
  return (
    <div id="components-form-demo-advanced-search" className={styles.container}>
      <Form
        form={form2}
        {...formLayout}
        // onFinish={values => submitMasterData(values)}
      >
        <Row>
          <Col span="12">
            <FormItem
              label="挂靠后产品编码"
              name="attachProductCode"
              rules={[
                {
                  required: true,
                  message: '挂靠后产品编码必填',
                },
              ]}
            >
              <Select
                showSearch
                filterOption={false}
                disabled={isView || isEdit}
                onSearch={e => handleSearch(e, 1)}
                onChange={e => handleChange(e, 1)}
              >
                {(productPocket1 || []).map((res: any) => (
                  <Option value={res.id}>{res.code}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          {isShowAnotherForAttach && (
            <Col span="12">
              <FormItem label="挂靠后产品名称" name="attachProductName">
                <Input disabled />
              </FormItem>
            </Col>
          )}
          {isShowAnotherForAttach && <Col span="12"></Col>}
          {isShowAnotherForAttach && (
            <Col span="12">
              <FormItem label="挂靠后产品规格" name="attachProductSpec">
                <Input disabled />
              </FormItem>
            </Col>
          )}
          <Col span="12">
            <FormItem
              label="原始流向产品编码"
              name="productCode"
              rules={[
                {
                  required: true,
                  message: '原始流向产品编码必填',
                },
              ]}
            >
              <Select
                showSearch
                filterOption={false}
                disabled={isView || isEdit}
                onSearch={e => handleSearch(e, 2)}
                onChange={e => handleChange(e, 2)}
              >
                {(productPocket2 || []).map((res: any) => (
                  <Option value={res.id}>{res.code}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          {isShowAnotherForOrigin && (
            <Col span="12">
              <FormItem label="原始流向产品名称" name="productName">
                <Input disabled />
              </FormItem>
            </Col>
          )}
          {isShowAnotherForOrigin && <Col span="12"></Col>}
          {isShowAnotherForOrigin && (
            <Col span="12">
              <FormItem label="原始流向产品规格" name="productSpec">
                <Input disabled />
              </FormItem>
            </Col>
          )}
          {isShowAnotherForOrigin && (
            <Col span="12">
              {/* <span
                style={{
                  display: ' inline-block',
                  marginRight: '4px',
                  color: '#ff4d4f',
                  fontSize: '14px',
                  fontFamily: 'SimSun,sans-serif',
                  lineHeight: 1,
                  content: '*',
                }}
              >
                *
              </span> */}
              <FormItem
                label={'换算关系'}
                className="add-required"
                rules={[
                  {
                    required: true,
                    message: '换算关系必填',
                  },
                ]}
              >
                <Row
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Col span="18">
                    <span>{'挂靠前产品名称' + '  x'}</span>
                  </Col>
                  <Col span="6">
                    <FormItem
                      name="originalRatio"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: '换算关系必填',
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={99999}
                        formatter={limitNumber}
                        parser={limitNumber}
                        disabled={isView}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          )}
          {isShowAnotherForOrigin && (
            <Col span="12">
              <FormItem>
                <Row
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Col span="18">
                    <span>{'=  ' + '挂靠后产品名称' + '  x'}</span>
                  </Col>
                  <Col span="6">
                    <FormItem
                      name="attachRatio"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: '换算关系必填',
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={99999}
                        formatter={limitNumber}
                        parser={limitNumber}
                        disabled={isView}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          )}
          <Col span="24">
            <FormItem
              label="备注"
              name="remark"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <TextArea disabled={isView} />
            </FormItem>
          </Col>
        </Row>
      </Form>
      {(isAdd || isEdit) && (
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '10px',
          }}
        >
          <Space>
            <Button
              type="default"
              key={'export'}
              onClick={() => goBackAndRefreshPage()}
            >
              取消
            </Button>
            <Button
              type="primary"
              loading={buttonLoading}
              onClick={() => {
                submitAttachData();
              }}
            >
              提交
            </Button>
          </Space>
        </Row>
      )}
      {falseVisible && productLinks.length > 0 && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '40%',
            height: '521px',
            zIndex: 1001,
            background: '#ffffff',
            padding: '5px',
          }}
        >
          <Card title={'产品串联信息'}>
            <div className="search-result-list">
              <ProTable<GithubIssueItem, String[]>
                columns={columns3}
                options={false}
                scroll={{ x: '100%', y: '240px' }}
                search={false}
                // actionRef={actionRef}
                pagination={false}
                dataSource={productLinks || []}
                rowKey="id"
                dateFormatter="string"
              />
            </div>
          </Card>
          <Row>
            <Col offset={20}>
              <Button
                type="primary"
                onClick={() => {
                  setFalseVisible(false);
                }}
              >
                确认
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default CommonModalForProduct;
