import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, message, Popconfirm, Space, Spin } from 'antd';
import { Table } from '@vulcan/utils';
import { withRouter } from 'react-router-dom';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getDateRuleInterceptList,
  monthlyDateRuleIntercepDelete,
  monthlyDateRuleIntercepCancel,
  monthlyDateRuleIntercepgetSaleCount,
  monthlyDateRuleIntercepAllCancel,
  getDataCleanQuery,
} from '@/services/ruleIntercept';
import { getUntreatedPeriod, getPeriodList } from '@/services/initResource';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import styles from './index.less';
import { FormInstance } from 'antd/lib/form';
import { getCleanBtnStatusQuery } from '@/services/monthDataManagement/inspectDataManagement';

interface DateRuleInterceptProps {
  dateRuleIntercept: any;
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

const DateRuleIntercept: React.FC<DateRuleInterceptProps> = props => {
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
  const billPrintSearch = storage.get('pocketData').billPrintSearch;
  const businessAllTypeName = storage.get('pocketData').businessAllTypeName;
  const [periodId, setPeriodId] = useState('');
  const [pageVisible, setPageVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [searchParams, setSearchParams] = useState<any>({});
  const [disabledForCleanBtn, setDisabledForCleanBtn] = useState(false);

  useEffect(() => {
    getPeriodListFunc();
    getUntreatedPeriod().then((res: any) => {
      setPageVisible(true);
      setPeriodId(storage.get('defaultPeriod'));
      ref.current?.setFieldsValue({
        businessType: businessAllTypeName[0].value,
        conformPeriodStatus: 'FAIL',
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
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {/* {(businessAllTypeName || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))} */}
            <Option value={'SD'}>{'销售'}</Option>
            <Option value={'PD'}>{'采购'}</Option>
            <Option value={'DD'}>{'发货'}</Option>
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
      title: '销售年月',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      width: '10%',
    },
    {
      title: '日期',
      dataIndex: 'pageDate',
      valueType: 'text',
      hideInSearch: true,
      width: '12%',
    },
    {
      title: '日期',
      dataIndex: 'saleDate',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '原始经销商编码',
      dataIndex: 'fromInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
    },
    {
      title: '原始经销商名称',
      dataIndex: 'fromInstitutionName',
      valueType: 'text',
      width: '15%',
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
      hideInSearch: true,
      width: '15%',
    },
    {
      title: '原始产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '原始产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '原始单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
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
      dataIndex: 'conformPeriodStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('billPrintSearch', 'label', 'value'),
      width: '6%',
    },
    {
      title: '状态',
      dataIndex: 'conformPeriodStatus',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
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
      width: '12%',
      fixed: 'right',
      render: (text: any, record: any, index: any) => (
        <div>
          <a
            type="link"
            style={{ marginRight: '10px' }}
            onClick={() => {
              if (record.businessType === 'SD') {
                history.push(
                  `/dataManagement/monthlyDataManagement/inspectDataManagement/saleInspect/detail/${record.id}?sourceTabIndex=1&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
                );
              }
              if (record.businessType === 'PD') {
                history.push(
                  `/dataManagement/monthlyDataManagement/inspectDataManagement/purchaseInspect/detail/${record.id}?sourceTabIndex=1&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
                );
              }
              if (record.businessType === 'ID') {
                history.push(
                  `/dataManagement/monthlyDataManagement/inspectDataManagement/inventoryInspect/detail/${record.id}?sourceTabIndex=1&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
                );
              }
              if (record.businessType === 'DD') {
                history.push(
                  `/dataManagement/monthlyDataManagement/inspectDataManagement/consignmentInspect/detail/${record.id}?sourceTabIndex=1&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
                );
              }
            }}
          >
            查看
          </a>
          {record.conformPeriodStatus !== 'CANCELED_INTERCEPT' && (
            <Authorized code={'dateRuleIntercept-delete'}>
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
          {record.conformPeriodStatus !== 'CANCELED_INTERCEPT' && (
            <Authorized code={'dateRuleIntercept-cancel'}>
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
      status: 'period',
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
    monthlyDateRuleIntercepCancel({
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

  const handleAllCancel = (source: any, record?: any) => {
    monthlyDateRuleIntercepAllCancel({
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
              code="toDoProcess-month-dateRuleIntercept"
              saveSearchValue
              tableAlertRender={false}
              scroll={{ x: 2500 }}
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
                  statusList: 'period',
                  periodId: ref.current?.getFieldValue('periodId'),
                  businessType: ref.current?.getFieldValue('businessType'),
                  conformPeriodStatus: ref.current?.getFieldValue(
                    'conformPeriodStatus',
                  ),
                });
              }}
              rowKey="id"
              dateFormatter="string"
              onReset={() => {
                ref.current?.setFieldsValue({
                  periodId: periodId,
                  businessType: businessAllTypeName[0].value,
                  conformPeriodStatus: 'FAIL',
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
                      <Authorized code={'dateRuleIntercept-batchDel'}>
                        <Button
                          type="primary"
                          onClick={() => handleBatchDelete(2)}
                          disabled={disabledForIsSeal}
                        >
                          批量删除
                        </Button>
                      </Authorized>
                    ) : (
                      <Authorized code={'dateRuleIntercept-batchDel'}>
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
                      <Authorized code={'dateRuleIntercept-batchCel'}>
                        <Button
                          type="default"
                          onClick={() => handleBatchCancel(2)}
                          disabled={disabledForIsSeal}
                        >
                          批量取消拦截
                        </Button>
                      </Authorized>
                    ) : (
                      <Authorized code={'dateRuleIntercept-batchCel'}>
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
                    <Authorized code={'dateRuleIntercept-allCel'}>
                      <Popconfirm
                        onConfirm={() => handleAllCancel(2)}
                        title={'确认取消拦截全量数据吗？'}
                        disabled={disabledForIsSeal}
                      >
                        <Button type="default" disabled={disabledForIsSeal}>
                          全量取消拦截
                        </Button>
                      </Popconfirm>
                    </Authorized>
                    <Authorized code={'dateRuleIntercept-allClean'}>
                      <Button
                        type="default"
                        key={'export'}
                        onClick={() => allDataClean()}
                        disabled={disabledForCleanBtn}
                      >
                        全部数据清洗
                      </Button>
                    </Authorized>
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
  connect(({ dispatch, dateRuleIntercept }: DateRuleInterceptProps) => ({
    dateRuleIntercept,
    dispatch,
  }))(DateRuleIntercept),
);
