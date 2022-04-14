import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  message,
  Popconfirm,
  Space,
  Modal,
  Drawer,
  Tabs,
  Form,
  Dropdown,
  Menu,
  Col,
  Row,
} from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getFromInstitutionAttachList,
  exportAttach,
  getPeriodConfig,
  attachDelete,
  getFromProductAttachList,
  saveProductAttachAdd,
  saveProductAttachEdit,
  productAttachExport,
  attachProductDelete,
  exportInstitutionAttach,
  exportProductAttach,
  getInstitutionRelyQuery,
} from '@/services/institutionAttach';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized, Table } from '@vulcan/utils';
import styles from './index.less';
import { downloadFile } from '@/utils/exportFile.ts';
import MatchModal from './commonComponent/commonModal';
import CommonModalForProduct from './commonComponent/commonModalForProduct';
import { FormInstance } from 'antd/lib/form';
import { getUntreatedPeriod, getPeriodList } from '@/services/initResource';

interface InstitutionAttachProps {
  institutionAttach: any;
  dispatch: any;
  location: any;
  history: any;
}

interface GithubIssueItem {
  id?: string;
  fileId?: string;
  fileName?: string;
  projectName?: string;
  companyName?: string;
  institutionFileCode?: string;
  institutionFileName?: string;
  productCode?: string;
  customerName?: string;
  productName?: string;
  productSpec?: string;
  quantity?: string;
  productUnit?: string;
  saleDate?: string;
  saleYear?: string;
}

const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const InstitutionAttach: React.FC<InstitutionAttachProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [saleCount, setSaleCount] = useState({
    treated: '',
    untreated: '',
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailVisibleForModal, setDetailVisibleForModal] = useState(false);
  const [cutVisible, setCutVisible] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [searchParams, setSearchParams] = useState({});
  const [productSearchParams, setProductSearchParams] = useState({});
  const [defaultSelectPeriod, setDefaultSelectPeriod] = useState({
    label: '',
    value: '',
  });
  const [defaultSelectKind, setDefaultSelectKind] = useState({
    label: '',
    value: '',
  });
  const [periodList, setPeriodList] = useState([]);
  const [institutionAttachKind, setInstitutionAttachKind] = useState([]);
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [periodId, setPeriodId] = useState('');
  const [openType, setOpenType] = useState(1);
  const [activeKey, setActiveKey] = useState('1');
  const [pageVisible, setPageVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    load();
    getUntreatedPeriod().then((res: any) => {
      setPageVisible(true);
      setPeriodId(storage.get('defaultPeriod'));
      //如果是从工作台跳转过来，销售年月赋值为带过来的账期，否则为页面初始化默认账期
      if (state && state.periodId) {
        ref.current?.setFieldsValue({
          periodId: state.periodId,
        });
        history.replace({});
      } else {
        ref.current?.setFieldsValue({
          periodId: storage.get('defaultPeriod'),
        });
      }
    });
  }, []);

  const load = async () => {
    //调用loadconfig的接口，拿下拉框数据以及默认账期和挂靠类型
    try {
      const res = await getPeriodConfig();
      let defaultSelectPeriodName: any = '';
      res.data.availablePeriods.forEach((item: any) => {
        if (item.value === storage.get('defaultPeriod')) {
          defaultSelectPeriodName = item.label;
        }
      });
      //存储默认账期value和label
      setDefaultSelectPeriod({
        ...res.data.defaultSelectPeriod,
        label: defaultSelectPeriodName,
        value: storage.get('defaultPeriod'),
      });
      //存储默认挂靠类型value和label
      setDefaultSelectKind(res.data.defaultSelectKind);

      //存储下拉框数据
      setPeriodList(res.data.availablePeriods);
      setInstitutionAttachKind(res.data.institutionAttachKind);
      //初始化表单查询的数据
      //初始化切换账期和挂靠类型弹窗表单数据
      form.setFieldsValue({
        periodId: storage.get('defaultPeriod'),
        kind: res.data.defaultSelectKind.value,
      });
    } catch (error) {
      message.error('初始化账期失败');
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '挂靠后机构编码',
      dataIndex: 'institutionAttachCode',
      copyable: true,
      ellipsis: true,
      valueType: 'text',
      width: '20%',
      fixed: 'left',
    },
    {
      title: '挂靠后机构名称',
      dataIndex: 'institutionAttachName',
      copyable: true,
      ellipsis: true,
      valueType: 'text',
      width: '20%',
      fixed: 'left',
    },
    {
      title: '原始流向机构编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '原始流向机构名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '产品品种',
      dataIndex: 'productBrandCount',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '产品品规',
      dataIndex: 'productSpecCount',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '维护人',
      dataIndex: 'updateByName',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '维护时间',
      dataIndex: 'updateTime',
      valueType: 'text',
      width: '15%',
      hideInSearch: true,
      fixed: 'right',
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: '15%',
      render: (text: any, record: any, index: any) => (
        <div>
          <a
            style={{ marginRight: '6px' }}
            onClick={() => {
              setCurrentData(record);
              setDetailVisible(true);
              setOpenType(3);
            }}
          >
            查看
          </a>
          <Authorized code={'insAttach-edit'}>
            <a
              style={{ marginRight: '6px' }}
              onClick={() => {
                setCurrentData(record);
                setDetailVisible(true);
                setOpenType(2);
              }}
            >
              编辑
            </a>
          </Authorized>
          <Authorized code={'insAttach-dell'}>
            <Popconfirm
              onConfirm={() => handleDelete(record)}
              title={'确认删除选中数据吗？'}
            >
              <a style={{ marginRight: '6px' }}>删除</a>
            </Popconfirm>
          </Authorized>
        </div>
      ),
    },
  ];

  const columnsForProduct: ProColumns<GithubIssueItem>[] = [
    {
      title: '挂靠后产品编码',
      dataIndex: 'attachProductCode',
      ellipsis: true,
      valueType: 'text',
      width: '20%',
      fixed: 'left',
    },
    {
      title: '挂靠后产品名称',
      dataIndex: 'attachProductName',
      ellipsis: true,
      valueType: 'text',
      width: '20%',
      fixed: 'left',
    },
    {
      title: '挂靠后产品规格',
      dataIndex: 'attachProductSpec',
      ellipsis: true,
      valueType: 'text',
      width: '13%',
      hideInSearch: true,
    },
    {
      title: '原始流向产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '原始流向产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '原始流向产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      width: '15%',
      hideInSearch: true,
    },
    {
      title: '换算关系',
      dataIndex: 'conversionRelation',
      valueType: 'text',
      width: '15%',
      hideInSearch: true,
      render: (text: any, record: any, index: any) => (
        <div>
          {record.productCode +
            'x' +
            record.originalRatio +
            '=' +
            record.attachProductCode +
            'x' +
            record.attachRatio}
        </div>
      ),
    },
    {
      title: '维护人',
      dataIndex: 'updateByName',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '维护时间',
      dataIndex: 'updateTime',
      valueType: 'text',
      width: '15%',
      hideInSearch: true,
      fixed: 'right',
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: '15%',
      render: (text: any, record: any, index: any) => (
        <div>
          <a
            style={{ marginRight: '6px' }}
            onClick={() => {
              setCurrentData(record);
              setDetailVisibleForModal(true);
              setOpenType(3);
            }}
          >
            查看
          </a>
          <Authorized code={'prodAttach-edit'}>
            <a
              style={{ marginRight: '6px' }}
              onClick={() => {
                setCurrentData(record);
                setDetailVisibleForModal(true);
                setOpenType(2);
              }}
            >
              编辑
            </a>
          </Authorized>
          <Authorized code={'prodAttach-del'}>
            <Popconfirm
              onConfirm={() => handleDeleteForProduct(record)}
              title={'确认删除选中数据吗？'}
            >
              <a style={{ marginRight: '6px' }}>删除</a>
            </Popconfirm>
          </Authorized>
        </div>
      ),
    },
  ];

  const handleDelete = (record?: any) => {
    attachDelete({
      ...record,
      periodId: form.getFieldValue('periodId'),
      kind: form.getFieldValue('kind'),
    }).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('删除成功');
        if (activeKey === '1') {
          actionRef1?.current?.reload();
        } else {
          actionRef2?.current?.reload();
        }
      } else {
        message.warning('删除失败');
      }
    });
  };

  const handleDeleteForProduct = (record?: any) => {
    attachProductDelete({
      // ...record,
      id: record.id,
      periodId: form.getFieldValue('periodId'),
    }).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('删除成功');
        if (activeKey === '1') {
          actionRef1?.current?.reload();
        } else {
          actionRef2?.current?.reload();
        }
      } else {
        message.warning('删除失败');
      }
    });
  };

  //下载模板  产品
  const exportTamplateForProduct = (filter: any) => {
    exportProductAttach({
      periodId: form.getFieldValue('periodId'),
      kind: form.getFieldValue('kind'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  //下载模板  机构
  const exportTamplateForInstitution = (filter: any) => {
    exportInstitutionAttach({
      periodId: form.getFieldValue('periodId'),
      kind: form.getFieldValue('kind'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  //导出
  const exportUnFunc = (filter: any) => {
    const params = Object.assign(
      {
        periodId: form.getFieldValue('periodId'),
        kind: form.getFieldValue('kind'),
      },
      searchParams,
    );
    exportAttach(params).then((res: any) => {
      downloadFile(res);
    });
  };

  //导出
  const exportUnFuncForProduct = (filter: any) => {
    const params = Object.assign(
      { periodId: form.getFieldValue('periodId') },
      productSearchParams,
    );
    productAttachExport(params).then((res: any) => {
      downloadFile(res);
    });
  };

  const goBackAndRefreshPage = () => {
    setDetailVisible(false);
    setDetailVisibleForModal(false);
    if (activeKey === '1') {
      actionRef1?.current?.reload();
    } else {
      actionRef2?.current?.reload();
    }
  };

  const onSubmit = (values: any) => {
    institutionAttachKind.forEach((i: any) => {
      if (i.value === values.kind) {
        //存储默认挂靠类型value和label
        setDefaultSelectKind({
          ...defaultSelectKind,
          label: i.label,
          value: i.value,
        });
      }
    });
    periodList.forEach((i: any) => {
      if (i.value === values.periodId) {
        //存储默认账期value和label
        setDefaultSelectPeriod({
          ...defaultSelectPeriod,
          label: i.label,
          value: i.value,
        });
      }
    });
    if (activeKey === '1') {
      actionRef1?.current?.reload();
    } else {
      actionRef2?.current?.reload();
    }
    setCutVisible(false);
  };

  const onChangeTabKey = (key: any) => {
    setActiveKey(key);
    if (key === '1') {
      actionRef1?.current?.reload();
    } else {
      actionRef2?.current?.reload();
    }
  };

  //挂靠计算
  const instAttachCompute = () => {
    getInstitutionRelyQuery().then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('挂靠计算成功');
      } else {
        message.warning('挂靠计算失败');
      }
    });
  };

  //重置表单
  const onReset = () => {
    setSearchParams({});
    setProductSearchParams({});
  };

  const actionRef1 = useRef<ActionType>();
  const actionRef2 = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  return (
    <div id="components-form-demo-advanced-search" className={styles.container}>
      {pageVisible && (
        <div style={{ background: '#ffffff' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '60px',
              padding: '10px',
              fontSize: '20px',
            }}
          >
            <Col span={12}>
              {activeKey === '1' ? (
                <span style={{ fontSize: 30, fontWeight: 500 }}>
                  {defaultSelectKind.label}挂靠：{defaultSelectPeriod.label}
                </span>
              ) : (
                <span>产品挂靠：{defaultSelectPeriod.label}</span>
              )}
              <Button
                type="link"
                onClick={() => {
                  setCutVisible(true);
                }}
              >
                切换
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Popconfirm
                onConfirm={() => instAttachCompute()}
                title={'确认进行挂靠计算吗？'}
              >
                <Button type="primary">挂靠计算</Button>
              </Popconfirm>
            </Col>
          </div>
          <Tabs
            defaultActiveKey="1"
            type="card"
            onChange={key => onChangeTabKey(key)}
          >
            <TabPane tab="机构挂靠" key="1">
              <div className="search-result-list">
                {defaultSelectPeriod.value && (
                  <Table<GithubIssueItem>
                    code="dataManage-attach-institution"
                    saveSearchValue
                    tableAlertRender={false}
                    columns={columns}
                    scroll={{ x: 1400 }}
                    pagination={{
                      defaultPageSize: 10,
                      showQuickJumper: true,
                    }}
                    search={{
                      span: 8,
                      labelWidth: 160,
                    }}
                    onSubmit={params => {
                      setSearchParams(params);
                    }}
                    actionRef={actionRef1}
                    formRef={ref}
                    request={(params, sort, filter) => {
                      return getFromInstitutionAttachList({
                        ...params,
                        ...sort,
                        ...filter,
                        periodId: form.getFieldValue('periodId'),
                        kind: form.getFieldValue('kind'),
                      });
                    }}
                    onReset={() => {
                      onReset();
                      // ref.current?.setFieldsValue({
                      //   periodId: defaultSelectPeriod.value,
                      //   kind: defaultSelectKind.value,
                      // });
                    }}
                    rowKey="id"
                    dateFormatter="string"
                    headerTitle={
                      <div>
                        <Space>
                          <Authorized code={'insAttach-add'}>
                            <Button
                              type="primary"
                              key={'export'}
                              onClick={() => {
                                setOpenType(1);
                                setDetailVisible(true);
                              }}
                            >
                              添加
                            </Button>
                          </Authorized>
                          <Authorized code={'insAttach-import'}>
                            <Button
                              type="default"
                              key={'export'}
                              onClick={() =>
                                history.push({
                                  pathname:
                                    '/dataManagement/institutionAttach/import',
                                  state: {
                                    periodId: form.getFieldValue('periodId'),
                                    kind: form.getFieldValue('kind'),
                                    source: 1,
                                  },
                                })
                              }
                            >
                              导入
                            </Button>
                          </Authorized>
                          <Authorized code={'insAttach-export'}>
                            <Button
                              type="default"
                              key={'export'}
                              onClick={filter => exportUnFunc(filter)}
                            >
                              导出
                            </Button>
                          </Authorized>
                          <Authorized code={'insAttach-down'}>
                            <Dropdown
                              key="menu"
                              overlay={
                                <Menu>
                                  <Menu.Item key="1">
                                    <a
                                      type="link"
                                      key={'export'}
                                      onClick={filter =>
                                        exportTamplateForInstitution(filter)
                                      }
                                    >
                                      下载模板
                                    </a>
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <a>
                                <EllipsisOutlined />
                              </a>
                            </Dropdown>
                          </Authorized>
                        </Space>
                      </div>
                    }
                    toolBarRender={() => []}
                  />
                )}
              </div>
            </TabPane>
            <TabPane tab="产品挂靠" key="2">
              <div className="search-result-list">
                {defaultSelectPeriod.value && (
                  <Table<GithubIssueItem>
                    code="dataManage-attach-product"
                    saveSearchValue
                    tableAlertRender={false}
                    columns={columnsForProduct}
                    scroll={{ x: 1500 }}
                    pagination={{
                      defaultPageSize: 10,
                      showQuickJumper: true,
                    }}
                    search={{
                      span: 8,
                      labelWidth: 160,
                    }}
                    onSubmit={params => {
                      setProductSearchParams(params);
                    }}
                    actionRef={actionRef2}
                    formRef={ref}
                    request={(params, sort, filter) => {
                      return getFromProductAttachList({
                        ...params,
                        ...sort,
                        ...filter,
                        periodId: form.getFieldValue('periodId'),
                        // kind: form.getFieldValue('kind'),
                      });
                    }}
                    onReset={() => {
                      onReset();
                      // ref.current?.setFieldsValue({
                      //   periodId: defaultSelectPeriod.value,
                      //   kind: defaultSelectKind.value,
                      // });
                    }}
                    rowKey="id"
                    dateFormatter="string"
                    headerTitle={
                      <div>
                        <Space>
                          <Authorized code={'prodAttach-add'}>
                            <Button
                              type="primary"
                              key={'export'}
                              onClick={() => {
                                setOpenType(1);
                                setDetailVisibleForModal(true);
                              }}
                            >
                              添加
                            </Button>
                          </Authorized>
                          <Authorized code={'prodAttach-import'}>
                            <Button
                              type="default"
                              key={'export'}
                              onClick={() =>
                                history.push({
                                  pathname:
                                    '/dataManagement/institutionAttach/import',
                                  state: {
                                    periodId: form.getFieldValue('periodId'),
                                    source: 2,
                                  },
                                })
                              }
                            >
                              导入
                            </Button>
                          </Authorized>
                          <Authorized code={'prodAttach-export'}>
                            <Button
                              type="default"
                              key={'export'}
                              onClick={filter => exportUnFuncForProduct(filter)}
                            >
                              导出
                            </Button>
                          </Authorized>
                          <Authorized code={'prodAttach-down'}>
                            <Dropdown
                              key="menu"
                              overlay={
                                <Menu>
                                  <Menu.Item key="1">
                                    <a
                                      type="link"
                                      key={'export'}
                                      onClick={filter =>
                                        exportTamplateForProduct(filter)
                                      }
                                    >
                                      下载模板
                                    </a>
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <a>
                                <EllipsisOutlined />
                              </a>
                            </Dropdown>
                          </Authorized>
                        </Space>
                      </div>
                    }
                    toolBarRender={() => []}
                  />
                )}
              </div>
            </TabPane>
          </Tabs>
          <Modal
            title={'机构及月份'}
            visible={cutVisible}
            destroyOnClose={true}
            width={'50%'}
            onCancel={() => {
              setCutVisible(false);
              form.setFieldsValue({
                periodId: defaultSelectPeriod.value,
                kind: defaultSelectKind.value,
              });
            }}
            footer={null}
            maskClosable={false}
          >
            <Form
              form={form}
              {...formLayout}
              // initialValues={tableValues}
              onFinish={values => onSubmit(values)}
            >
              {activeKey === '1' && (
                <FormItem
                  label="挂靠类型"
                  name="kind"
                  rules={[
                    {
                      required: true,
                      message: '挂靠类型必填',
                    },
                  ]}
                >
                  <Select>
                    {(institutionAttachKind || []).map((res: any) => (
                      <Option value={res.value}>{res.label}</Option>
                    ))}
                  </Select>
                </FormItem>
              )}
              <FormItem
                label="月份"
                name="periodId"
                rules={[
                  {
                    required: true,
                    message: '月份必填',
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {(periodList || []).map((res: any) => (
                    <Option value={res.value}>{res.label}</Option>
                  ))}
                </Select>
              </FormItem>
              <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
                <Space>
                  <Button
                    htmlType="button"
                    onClick={() => {
                      setCutVisible(false);
                      form.setFieldsValue({
                        periodId: periodId,
                        kind: defaultSelectKind.value,
                      });
                    }}
                  >
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
          <Drawer
            // width={'50%'}
            width={'59%'}
            destroyOnClose
            title={
              openType === 1
                ? '添加机构挂靠'
                : openType === 2
                ? '编辑机构挂靠'
                : '查看机构挂靠'
            }
            visible={detailVisible}
            onClose={() => {
              setDetailVisible(false);
              actionRef1?.current?.reload();
            }}
            maskClosable={false}
          >
            <MatchModal
              fatherCurrentData={currentData}
              openType={openType}
              goBackAndRefreshPage={goBackAndRefreshPage}
              propsFromForm={{
                periodId: form.getFieldValue('periodId'),
                kind: form.getFieldValue('kind'),
              }}
            />
          </Drawer>
          <Modal
            // width={'50%'}
            width={'59%'}
            destroyOnClose
            title={
              openType === 1
                ? '添加产品挂靠'
                : openType === 2
                ? '编辑产品挂靠'
                : '查看产品挂靠'
            }
            visible={detailVisibleForModal}
            afterClose={() => {
              setDetailVisibleForModal(false);
              actionRef2?.current?.reload();
            }}
            maskClosable={false}
            footer={null}
            onCancel={() => {
              setDetailVisibleForModal(false);
            }}
          >
            <CommonModalForProduct
              fatherCurrentData={currentData}
              openType={openType}
              goBackAndRefreshPage={goBackAndRefreshPage}
              propsFromForm={{
                periodId: form.getFieldValue('periodId'),
              }}
            />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default InstitutionAttach;
