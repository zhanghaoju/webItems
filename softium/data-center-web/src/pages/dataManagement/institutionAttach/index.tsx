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
      //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
    //??????loadconfig???????????????????????????????????????????????????????????????
    try {
      const res = await getPeriodConfig();
      let defaultSelectPeriodName: any = '';
      res.data.availablePeriods.forEach((item: any) => {
        if (item.value === storage.get('defaultPeriod')) {
          defaultSelectPeriodName = item.label;
        }
      });
      //??????????????????value???label
      setDefaultSelectPeriod({
        ...res.data.defaultSelectPeriod,
        label: defaultSelectPeriodName,
        value: storage.get('defaultPeriod'),
      });
      //????????????????????????value???label
      setDefaultSelectKind(res.data.defaultSelectKind);

      //?????????????????????
      setPeriodList(res.data.availablePeriods);
      setInstitutionAttachKind(res.data.institutionAttachKind);
      //??????????????????????????????
      //??????????????????????????????????????????????????????
      form.setFieldsValue({
        periodId: storage.get('defaultPeriod'),
        kind: res.data.defaultSelectKind.value,
      });
    } catch (error) {
      message.error('?????????????????????');
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '?????????????????????',
      dataIndex: 'institutionAttachCode',
      copyable: true,
      ellipsis: true,
      valueType: 'text',
      width: '20%',
      fixed: 'left',
    },
    {
      title: '?????????????????????',
      dataIndex: 'institutionAttachName',
      copyable: true,
      ellipsis: true,
      valueType: 'text',
      width: '20%',
      fixed: 'left',
    },
    {
      title: '????????????????????????',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '????????????????????????',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '????????????',
      dataIndex: 'productBrandCount',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '????????????',
      dataIndex: 'productSpecCount',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '?????????',
      dataIndex: 'updateByName',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '????????????',
      dataIndex: 'updateTime',
      valueType: 'text',
      width: '15%',
      hideInSearch: true,
      fixed: 'right',
    },
    {
      title: '??????',
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
            ??????
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
              ??????
            </a>
          </Authorized>
          <Authorized code={'insAttach-dell'}>
            <Popconfirm
              onConfirm={() => handleDelete(record)}
              title={'??????????????????????????????'}
            >
              <a style={{ marginRight: '6px' }}>??????</a>
            </Popconfirm>
          </Authorized>
        </div>
      ),
    },
  ];

  const columnsForProduct: ProColumns<GithubIssueItem>[] = [
    {
      title: '?????????????????????',
      dataIndex: 'attachProductCode',
      ellipsis: true,
      valueType: 'text',
      width: '20%',
      fixed: 'left',
    },
    {
      title: '?????????????????????',
      dataIndex: 'attachProductName',
      ellipsis: true,
      valueType: 'text',
      width: '20%',
      fixed: 'left',
    },
    {
      title: '?????????????????????',
      dataIndex: 'attachProductSpec',
      ellipsis: true,
      valueType: 'text',
      width: '13%',
      hideInSearch: true,
    },
    {
      title: '????????????????????????',
      dataIndex: 'productCode',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '????????????????????????',
      dataIndex: 'productName',
      valueType: 'text',
      width: '20%',
    },
    {
      title: '????????????????????????',
      dataIndex: 'productSpec',
      valueType: 'text',
      width: '15%',
      hideInSearch: true,
    },
    {
      title: '????????????',
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
      title: '?????????',
      dataIndex: 'updateByName',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '????????????',
      dataIndex: 'updateTime',
      valueType: 'text',
      width: '15%',
      hideInSearch: true,
      fixed: 'right',
    },
    {
      title: '??????',
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
            ??????
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
              ??????
            </a>
          </Authorized>
          <Authorized code={'prodAttach-del'}>
            <Popconfirm
              onConfirm={() => handleDeleteForProduct(record)}
              title={'??????????????????????????????'}
            >
              <a style={{ marginRight: '6px' }}>??????</a>
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
        message.success('????????????');
        if (activeKey === '1') {
          actionRef1?.current?.reload();
        } else {
          actionRef2?.current?.reload();
        }
      } else {
        message.warning('????????????');
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
        message.success('????????????');
        if (activeKey === '1') {
          actionRef1?.current?.reload();
        } else {
          actionRef2?.current?.reload();
        }
      } else {
        message.warning('????????????');
      }
    });
  };

  //????????????  ??????
  const exportTamplateForProduct = (filter: any) => {
    exportProductAttach({
      periodId: form.getFieldValue('periodId'),
      kind: form.getFieldValue('kind'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  //????????????  ??????
  const exportTamplateForInstitution = (filter: any) => {
    exportInstitutionAttach({
      periodId: form.getFieldValue('periodId'),
      kind: form.getFieldValue('kind'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  //??????
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

  //??????
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
        //????????????????????????value???label
        setDefaultSelectKind({
          ...defaultSelectKind,
          label: i.label,
          value: i.value,
        });
      }
    });
    periodList.forEach((i: any) => {
      if (i.value === values.periodId) {
        //??????????????????value???label
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

  //????????????
  const instAttachCompute = () => {
    getInstitutionRelyQuery().then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('??????????????????');
      } else {
        message.warning('??????????????????');
      }
    });
  };

  //????????????
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
                  {defaultSelectKind.label}?????????{defaultSelectPeriod.label}
                </span>
              ) : (
                <span>???????????????{defaultSelectPeriod.label}</span>
              )}
              <Button
                type="link"
                onClick={() => {
                  setCutVisible(true);
                }}
              >
                ??????
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Popconfirm
                onConfirm={() => instAttachCompute()}
                title={'??????????????????????????????'}
              >
                <Button type="primary">????????????</Button>
              </Popconfirm>
            </Col>
          </div>
          <Tabs
            defaultActiveKey="1"
            type="card"
            onChange={key => onChangeTabKey(key)}
          >
            <TabPane tab="????????????" key="1">
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
                              ??????
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
                              ??????
                            </Button>
                          </Authorized>
                          <Authorized code={'insAttach-export'}>
                            <Button
                              type="default"
                              key={'export'}
                              onClick={filter => exportUnFunc(filter)}
                            >
                              ??????
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
                                      ????????????
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
            <TabPane tab="????????????" key="2">
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
                              ??????
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
                              ??????
                            </Button>
                          </Authorized>
                          <Authorized code={'prodAttach-export'}>
                            <Button
                              type="default"
                              key={'export'}
                              onClick={filter => exportUnFuncForProduct(filter)}
                            >
                              ??????
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
                                      ????????????
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
            title={'???????????????'}
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
                  label="????????????"
                  name="kind"
                  rules={[
                    {
                      required: true,
                      message: '??????????????????',
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
                label="??????"
                name="periodId"
                rules={[
                  {
                    required: true,
                    message: '????????????',
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
                    ??????
                  </Button>
                  <Button type="primary" htmlType="submit">
                    ??????
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
                ? '??????????????????'
                : openType === 2
                ? '??????????????????'
                : '??????????????????'
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
                ? '??????????????????'
                : openType === 2
                ? '??????????????????'
                : '??????????????????'
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
