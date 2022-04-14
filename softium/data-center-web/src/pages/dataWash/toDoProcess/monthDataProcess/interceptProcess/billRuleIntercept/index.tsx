import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  message,
  Popconfirm,
  Space,
  Spin,
  Dropdown,
  Menu,
} from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getDateRuleInterceptList,
  monthlyDateRuleIntercepDelete,
  monthlyBillRuleIntercepCancel,
  monthlyDateRuleIntercepgetSaleCount,
  exportUnExistInstitution,
  monthlyBillRRuleIntercepAllCancel,
  exportBillData,
  getDataCleanQuery,
} from '@/services/ruleIntercept';
import { getUntreatedPeriod, getPeriodList } from '@/services/initResource';
import { history } from 'umi';
import { connect } from 'dva';
import { Authorized, Table } from '@vulcan/utils';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import styles from './index.less';
import { downloadFile } from '@/utils/exportFile.ts';
import { FormInstance } from 'antd/lib/form';
import { withRouter } from 'react-router-dom';
import { getCleanBtnStatusQuery } from '@/services/monthDataManagement/inspectDataManagement';

interface BillRuleInterceptProps {
  billRuleIntercept: any;
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
  businessType?: string;
  quantity?: string;
  productUnit?: string;
  saleDate?: string;
  saleYear?: string;
}

const { Option } = Select;

const BillRuleIntercept: React.FC<BillRuleInterceptProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [periodList, setPeriodList] = useState([]);
  const [saleCount, setSaleCount] = useState({
    treated: '',
    untreated: '',
  });
  const [periodId, setPeriodId] = useState('');
  const billPrintSearch = storage.get('pocketData').billPrintSearch;
  const businessAllTypeName = storage.get('pocketData').businessAllTypeName;
  const ptintInterceptionStatus = storage.get('pocketData')
    .ptintInterceptionStatus;
  const [pageVisible, setPageVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const pageElements = storage.get('pageElements').pageElements;
  const [searchParams, setSearchParams] = useState<any>({});
  const [disabledForCleanBtn, setDisabledForCleanBtn] = useState(false);

  useEffect(() => {
    getPeriodListFunc();
    getUntreatedPeriod().then((res: any) => {
      setPageVisible(true);
      setPeriodId(storage.get('defaultPeriod'));
      ref.current?.setFieldsValue({
        businessType: businessAllTypeName[0].value,
        conformBillPrintStatus: 'FAIL',
      });
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
      getSaleCount();
    });
  }, []);

  const getPeriodListFunc = async () => {
    try {
      const res = await getPeriodList({});
      setPeriodList(res.data);
      //在这里做页面首次load时判断账期是否已经封板
      let item: any = null;
      if (state && state.periodId) {
        item = res.data.filter((i: any) => {
          return state.periodId === i.id;
        });
      } else {
        item = res.data.filter((i: any) => {
          return storage.get('defaultPeriod') === i.id;
        });
      }
      setaArchiveStatus(item[0].isSeal);
      setaArchiveFunc(item[0].isSeal);
    } catch (e) {
      message.warning('获取账期下拉数据失败');
    }
  };

  const setaArchiveFunc = (status: any) => {
    if (status === 'Archive') {
      setDisabledForIsSeal(true);
      setDisabledForCleanBtn(true); //清洗按钮置灰
    } else {
      setDisabledForIsSeal(false);
      getCleanBtnStatusQuery().then((res: any) => {
        if (res && res.success && res.success === true) {
          setDisabledForCleanBtn(res.data.cleanButton); //为true，置灰，false可点
        }
      });
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '数据类型',
      dataIndex: 'businessType',
      hideInTable: true,
      renderFormItem: _ => {
        return (
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(businessAllTypeName || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '销售年月',
      dataIndex: 'periodId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            showSearch
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="请选择"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              ref.current?.setFieldsValue({
                periodId: e,
              });
              periodList.forEach((i: any) => {
                if (e === i.id) {
                  setaArchiveStatus(i.isSeal);
                }
              });
            }}
          >
            {(periodList || []).map((res: any) => (
              <Option value={res.id}>{res.periodName}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      fixed: 'left',
      width: '15%',
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      valueType: 'text',
      fixed: 'left',
      width: '15%',
    },
    {
      title: '日期',
      dataIndex: 'pageDate',
      valueType: 'text',
      hideInSearch: true,
      width: '12%',
    },
    {
      title: '原始机构编码',
      dataIndex: 'toInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
    },
    {
      title: '原始机构名称',
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      width: '15%',
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      width: '12%',
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
      width: '12%',
    },
    {
      title: '原始单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '原始数量',
      dataIndex: 'productQuantity',
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '采集方式',
      dataIndex: 'accessType',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('accessTypePocket', 'label', 'value'),
      width: '10%',
    },
    {
      title: '日期',
      dataIndex: 'saleDate',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '拦截原因',
      dataIndex: 'interceptionReason',
      hideInTable: true,
      renderFormItem: _ => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(ptintInterceptionStatus || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '拦截原因',
      dataIndex: 'billPrintInterceptorReason',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('ptintInterceptionStatus', 'label', 'value'),
      width: '10%',
    },
    {
      title: '状态',
      dataIndex: 'conformBillPrintStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('billPrintSearch', 'label', 'value'),
      width: '10%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      width: '12%',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      width: '12%',
    },
    {
      title: '状态',
      dataIndex: 'conformBillPrintStatus',
      hideInTable: true,
      renderFormItem: _ => {
        return (
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(billPrintSearch || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      width: '14%',
      fixed: 'right',
      render: (text: any, record: any, index: any) => (
        <div>
          <a
            type="link"
            style={{ marginRight: '10px' }}
            onClick={() => {
              if (record.businessType === 'SD') {
                history.push(
                  `/dataManagement/monthlyDataManagement/inspectDataManagement/saleInspect/detail/${record.id}?sourceTabIndex=3&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
                );
              }
              if (record.businessType === 'PD') {
                history.push(
                  `/dataManagement/monthlyDataManagement/inspectDataManagement/purchaseInspect/detail/${record.id}?sourceTabIndex=3&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
                );
              }
              if (record.businessType === 'ID') {
                history.push(
                  `/dataManagement/monthlyDataManagement/inspectDataManagement/inventoryInspect/detail/${record.id}?sourceTabIndex=3&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
                );
              }
              if (record.businessType === 'DD') {
                history.push(
                  `/dataManagement/monthlyDataManagement/inspectDataManagement/consignmentInspect/detail/${record.id}?sourceTabIndex=3&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
                );
              }
            }}
          >
            查看
          </a>
          {record.conformBillPrintStatus !== 'CANCELED_INTERCEPT' && (
            <Authorized code={'billRuleIntercept-delete'}>
              <Popconfirm
                onConfirm={() => handleBatchDelete(1, record)}
                title={'确认删除选中数据吗？'}
                disabled={record.isSeal === 1 || disabledForIsSeal}
              >
                <a
                  type="link"
                  style={{
                    marginRight: '10px',
                    color: disabledForIsSeal ? '#aaaaaa' : '#FF9300',
                  }}
                >
                  删除
                </a>
              </Popconfirm>
            </Authorized>
          )}

          {record.conformBillPrintStatus !== 'CANCELED_INTERCEPT' && (
            <Authorized code={'billRuleIntercept-cancel'}>
              <Popconfirm
                onConfirm={() => handleBatchCancel(1, record)}
                title={'确认取消拦截选中数据吗？'}
                disabled={record.isSeal === 1 || disabledForIsSeal}
              >
                <a
                  type="link"
                  style={{
                    marginRight: '10px',
                    color: disabledForIsSeal ? '#aaaaaa' : '#FF9300',
                  }}
                >
                  取消拦截
                </a>
              </Popconfirm>
            </Authorized>
          )}
        </div>
      ),
    },
  ];

  const rowSelection = {
    tableAlertRender: false,
    tableAlertOptionRender: false,
    onChange: (selectedRowKeys?: any, selectedRows?: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRowData(selectedRows);
    },
    getCheckboxProps: (record?: any) => {
      return {
        disabled: record.isSeal === 1,
      };
    },
  };

  const getSaleCount = () => {
    monthlyDateRuleIntercepgetSaleCount({
      status: 'bill',
      periodId: ref.current?.getFieldValue('periodId'),
      businessType: ref.current?.getFieldValue('businessType'),
    }).then((res: any) => {
      setSaleCount(res.data);
      setPageLoading(false);
    });
  };

  const handleBatchDelete = (source: any, record?: any) => {
    let dtos: any = [];
    if (source === 2 && selectedRowKeys.length === 0) {
      message.warning('请选择需要删除的信息');
      return false;
    }
    if (source === 2 && selectedRowKeys.length > 0) {
      selectedRowData.forEach((item: any) => {
        dtos.push({
          ...item,
          periodId: ref.current?.getFieldValue('periodId'),
        });
      });
    }
    if (source === 1) {
      dtos.push({
        ...record,
        periodId: ref.current?.getFieldValue('periodId'),
      });
    }
    monthlyDateRuleIntercepDelete({
      dtos,
      businessType: ref.current?.getFieldValue('businessType'),
      periodId: ref.current?.getFieldValue('periodId'),
    }).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('删除成功');
        actionRef?.current?.reload();
        getSaleCount();
        setSelectedRowKeys([]);
        setSelectedRowData([]);
      } else {
        message.warning('删除失败');
      }
    });
  };

  const handleBatchCancel = (source: any, record?: any) => {
    let dtos: any = [];
    if (source === 2 && selectedRowKeys.length === 0) {
      message.warning('请选择需要取消拦截的信息');
      return false;
    }
    if (source === 2 && selectedRowKeys.length > 0) {
      selectedRowData.forEach((item: any) => {
        dtos.push({
          ...item,
          periodId: ref.current?.getFieldValue('periodId'),
        });
      });
    }
    if (source === 1) {
      dtos.push({
        ...record,
        periodId: ref.current?.getFieldValue('periodId'),
      });
    }
    monthlyBillRuleIntercepCancel({
      dtos,
      businessType: ref.current?.getFieldValue('businessType'),
      periodId: ref.current?.getFieldValue('periodId'),
      dataTypeDesc: 'MONTH',
    }).then((res: any) => {
      if (res && res.success && res.success === true) {
        setTimeout(() => {
          message.success('拦截成功');
          actionRef?.current?.reload();
          getSaleCount();
          setSelectedRowKeys([]);
          setSelectedRowData([]);
        }, 3000);
      } else {
        message.warning('拦截失败');
      }
    });
  };

  //导出
  const exportUnExistInstitutionFunc = (filter: any) => {
    const item: any = periodList.filter((i: any) => {
      return ref.current?.getFieldValue('periodId') === i.id;
    });
    exportUnExistInstitution({
      periodId: ref.current?.getFieldValue('periodId'),
      periodName: item[0].periodName,
      businessType: ref.current?.getFieldValue('businessType'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  //导出拦截经销商
  const exportBillDataFunc = (filter: any) => {
    const item: any = periodList.filter((i: any) => {
      return ref.current?.getFieldValue('periodId') === i.id;
    });
    exportBillData({
      periodId: ref.current?.getFieldValue('periodId'),
      periodName: item[0].periodName,
      businessType: ref.current?.getFieldValue('businessType'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  const handleAllCancel = () => {
    monthlyBillRRuleIntercepAllCancel({
      businessType: ref.current?.getFieldValue('businessType'),
      periodId: ref.current?.getFieldValue('periodId'),
      dataTypeDesc: 'MONTH',
    }).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('全量取消拦截成功');
        actionRef?.current?.reload();
        getSaleCount();
        setSelectedRowKeys([]);
        setSelectedRowData([]);
      } else {
        message.warning('全量取消拦截失败');
      }
    });
  };

  //全部数据清洗
  const allDataClean = () => {
    const params = { businessType: '', periodId: '' };
    params.businessType = searchParams.businessType
      ? searchParams.businessType
      : businessAllTypeName[0].value;
    params.periodId = searchParams.periodId
      ? searchParams.periodId
      : storage.get('defaultPeriod');
    setDisabledForCleanBtn(true);
    getDataCleanQuery(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('清洗成功');
      }
    });
  };

  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  return (
    <div id="components-form-demo-advanced-search" className={styles.container}>
      <Spin
        spinning={pageLoading}
        // size={'large'}
      >
        <div className="search-result-list">
          {pageVisible && (
            <Table<GithubIssueItem>
              code="toDoProcess-month-billRuleIntercept"
              saveSearchValue
              tableAlertRender={false}
              scroll={{ x: 2400 }}
              sticky={true}
              columns={columns}
              rowSelection={{
                ...rowSelection,
              }}
              pagination={{
                defaultPageSize: 10,
                showQuickJumper: true,
              }}
              search={{
                span: 8,
                labelWidth: 160,
              }}
              actionRef={actionRef}
              formRef={ref}
              request={(params, sort, filter) => {
                return getDateRuleInterceptList({
                  ...params,
                  ...sort,
                  ...filter,
                  statusList: 'bill',
                  periodId: ref.current?.getFieldValue('periodId'),
                  businessType: ref.current?.getFieldValue('businessType'),
                  conformBillPrintStatus: ref.current?.getFieldValue(
                    'conformBillPrintStatus',
                  ),
                });
              }}
              rowKey="id"
              dateFormatter="string"
              onReset={() => {
                ref.current?.setFieldsValue({
                  periodId: periodId,
                  businessType: businessAllTypeName[0].value,
                  conformBillPrintStatus: 'FAIL',
                });
                //在这里做页面重置时判断账期是否已经封板
                let item: any = periodList.filter((i: any) => {
                  return periodId === i.id;
                });
                setaArchiveFunc(item[0].isSeal);
              }}
              onSubmit={params => {
                setSearchParams(params);
                setPageLoading(true);
                getSaleCount();
                //提交查询时设置全局按钮状态控制变量
                setaArchiveFunc(archiveStatus);
              }}
              // params={searchParams}
              headerTitle={
                <div>
                  <Space style={{ display: 'flex' }}>
                    <h3>待处理：{saleCount.untreated}</h3>
                    <h3>已处理：{saleCount.treated}</h3>
                  </Space>
                  <Space>
                    {selectedRowKeys.length === 0 ? (
                      <Authorized code={'billRuleIntercept-batchDel'}>
                        <Button
                          type="primary"
                          onClick={() => handleBatchDelete(2)}
                          disabled={disabledForIsSeal}
                        >
                          批量删除
                        </Button>
                      </Authorized>
                    ) : (
                      <Authorized code={'billRuleIntercept-batchDel'}>
                        <Popconfirm
                          onConfirm={() => handleBatchDelete(2)}
                          title={'确认删除选中数据吗？'}
                          disabled={disabledForIsSeal}
                        >
                          <Button type="primary" disabled={disabledForIsSeal}>
                            批量删除
                          </Button>
                        </Popconfirm>
                      </Authorized>
                    )}
                    {selectedRowKeys.length === 0 ? (
                      <Authorized code={'billRuleIntercept-batchCel'}>
                        <Button
                          type="default"
                          onClick={() => handleBatchCancel(2)}
                          disabled={disabledForIsSeal}
                        >
                          批量取消拦截
                        </Button>
                      </Authorized>
                    ) : (
                      <Authorized code={'billRuleIntercept-batchCel'}>
                        <Popconfirm
                          onConfirm={() => handleBatchCancel(2)}
                          title={'确认取消拦截选中数据吗？'}
                          disabled={disabledForIsSeal}
                        >
                          <Button type="default" disabled={disabledForIsSeal}>
                            批量取消拦截
                          </Button>
                        </Popconfirm>
                      </Authorized>
                    )}
                    <Authorized code={'billRuleIntercept-export'}>
                      <Button
                        type="default"
                        key={'export'}
                        onClick={filter => exportUnExistInstitutionFunc(filter)}
                      >
                        导出拦截数据
                      </Button>
                    </Authorized>
                    <Dropdown
                      key="menu"
                      overlay={
                        <Menu>
                          {pageElements.filter((item: any, i: any) => {
                            return item.code == 'billRuleIntercept-allCel';
                          }) && (
                            <Menu.Item key="1">
                              <Button
                                type="link"
                                onClick={() => handleAllCancel()}
                                disabled={disabledForIsSeal}
                              >
                                全量取消拦截
                              </Button>
                            </Menu.Item>
                          )}
                          {pageElements.filter((item: any, i: any) => {
                            return item.code == 'billRule-exportDealer';
                          }) && (
                            <Menu.Item key="2">
                              <Button
                                type="link"
                                key={'export'}
                                onClick={filter => exportBillDataFunc(filter)}
                              >
                                导出拦截经销商
                              </Button>
                            </Menu.Item>
                          )}
                          {pageElements.filter((item: any, i: any) => {
                            return item.code == 'billRule-allClean';
                          }) && (
                            <Menu.Item key="3">
                              <Button
                                type="link"
                                onClick={() => allDataClean()}
                                disabled={disabledForCleanBtn}
                              >
                                全部数据清洗
                              </Button>
                            </Menu.Item>
                          )}
                        </Menu>
                      }
                    >
                      <a>
                        <EllipsisOutlined />
                      </a>
                    </Dropdown>
                  </Space>
                </div>
              }
              toolBarRender={() => []}
            />
          )}
        </div>
      </Spin>
    </div>
  );
};

export default withRouter(
  connect(({ dispatch, billRuleIntercept }: BillRuleInterceptProps) => ({
    billRuleIntercept,
    dispatch,
  }))(BillRuleIntercept),
);
