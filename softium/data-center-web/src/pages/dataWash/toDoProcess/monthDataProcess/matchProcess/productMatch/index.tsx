import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  message,
  Popconfirm,
  Space,
  Col,
  Row,
  Spin,
} from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  getProductMatchList,
  getProductMatchRightList,
  exportUnMatch,
  getMatchCount,
  cancelCheckForProduct,
  matchSubmitForProduct,
  getDictionary,
} from '@/services/matchProcess';
import { getUntreatedPeriod, getPeriodList } from '@/services/initResource';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized, Table } from '@vulcan/utils';
import styles from './index.less';
import { downloadFile } from '@/utils/exportFile.ts';
import { FormInstance } from 'antd/lib/form';
import { withRouter } from 'react-router-dom';
import { getDataCleanQuery } from '@/services/ruleIntercept';
import { getCleanBtnStatusQuery } from '@/services/monthDataManagement/inspectDataManagement';

interface ProductMatchProps {
  productMatch: any;
  dispatch: any;
  history: any;
  location: any;
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
  productProduct?: string;
  saleDate?: string;
  saleYear?: string;
}

const { Option } = Select;

const ProductMatch: React.FC<ProductMatchProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [saleCount, setSaleCount] = useState({
    treated: '',
    untreated: '',
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [periodList, setPeriodList] = useState([]);
  const matchSearchType = storage.get('pocketData').matchSearchType;
  const businessAllTypeName = storage.get('pocketData').businessAllTypeName;
  const [disabledForCleanBtn, setDisabledForCleanBtn] = useState(false);
  const [dictionary, setDictionary] = useState({
    State: [],
    Region: [],
    City: [],
  });
  const [periodId, setPeriodId] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [searchParams, setSearchParams] = useState<any>({});
  const [regionData, setRegionData] = useState({
    province: [],
    city: [],
  });

  useEffect(() => {
    getPeriodListFunc();
    getDictionaryFunc({ systemCodes: ['Region', 'State'] });
    getUntreatedPeriod().then((res: any) => {
      setPageVisible(true);
      setPeriodId(storage.get('defaultPeriod'));
      ref.current?.setFieldsValue({
        matchBusinessType: businessAllTypeName[0].value,
        matchRinseStatus: 'FAIL',
        provinceNameList: undefined,
        cityNameList: undefined,
      });
      //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      if (state && state.periodId) {
        ref.current?.setFieldsValue({
          matchPeriodId: state.periodId,
        });
        history.replace({});
      } else {
        ref.current?.setFieldsValue({
          matchPeriodId: storage.get('defaultPeriod'),
        });
      }
      getSaleCount();
    });
  }, []);

  const getPeriodListFunc = async () => {
    try {
      const res = await getPeriodList({});
      setPeriodList(res.data);
      //????????????????????????load?????????????????????????????????
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
      message.warning('??????????????????????????????');
    }
  };

  const setaArchiveFunc = (status: any) => {
    if (status === 'Archive') {
      setDisabledForIsSeal(true);
      setDisabledForCleanBtn(true); //??????????????????
    } else {
      setDisabledForIsSeal(false);
      getCleanBtnStatusQuery().then((res: any) => {
        if (res && res.success && res.success === true) {
          setDisabledForCleanBtn(res.data.cleanButton); //???true????????????false??????
        }
      });
    }
  };

  const getDictionaryFunc = async (params: any) => {
    try {
      let optionData: any = { ...dictionary, City: [] };
      const res = await getDictionary(params);
      if (res.data && res.data.list) {
        res.data.list.forEach((item: any) => {
          if (item.systemCode === 'State') {
            optionData.State = item.entries;
          } else if (item.systemCode === 'Region') {
            optionData.Region = item.entries;
          } else {
            optionData.City = optionData.City.concat([...item.entries]);
          }
        });
      }
      setDictionary({ ...optionData });
    } catch (error) {
      message.error('??????????????????');
    }
  };

  const columns1: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'matchBusinessType',
      hideInTable: true,
      renderFormItem: (_, { value, onChange }) => {
        return (
          <Select placeholder="?????????" style={{ width: '100%' }}>
            {(businessAllTypeName || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'matchPeriodId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            showSearch
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="?????????"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              ref.current?.setFieldsValue({
                matchPeriodId: e,
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
      title: '?????????????????????',
      dataIndex: 'standardInstitutionName',
      copyable: true,
      valueType: 'text',
      fixed: 'left',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '?????????????????????',
      dataIndex: 'matchStandardInstitutionName',
      copyable: true,
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????',
      dataIndex: 'provinceNameList',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            allowClear
            showSearch
            showArrow
            mode={'multiple'}
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="?????????"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              //???????????????
              ref.current?.setFieldsValue({
                provinceNameList: e,
              });
              //????????????????????????
              form.resetFields(['cityNameList']);
              //???????????????????????????
              let optionData: any = { ...dictionary, City: [] };
              setDictionary(optionData);
              //????????????????????????????????????????????????e???????????????name
              if (e.length > 0) {
                let provinceNameList: any = [];
                getDictionaryFunc({ codes: e });
                e.forEach((i: any) => {
                  dictionary.Region.forEach((j: any) => {
                    if (i === j.value) {
                      provinceNameList.push(j.name);
                    }
                  });
                });
                setRegionData({ ...regionData, province: provinceNameList });
              } else {
                form.resetFields(['provinceNameList']);
                setRegionData({ province: [], city: [] });
              }
            }}
          >
            {(dictionary.Region || []).map((res: any) => (
              <Option value={res.value}>{res.name}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'cityNameList',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select
            allowClear
            showSearch
            showArrow
            mode={'multiple'}
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="?????????"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              //???e???????????????name
              if (e.length > 0) {
                let cityNameList: any = [];
                e.forEach((i: any) => {
                  dictionary.City.forEach((j: any) => {
                    if (i === j.value) {
                      cityNameList.push(j.name);
                    }
                  });
                });
                setRegionData({ ...regionData, city: cityNameList });
              } else {
                form.resetFields(['cityNameList']);
                setRegionData({ ...regionData, city: [] });
              }
            }}
          >
            {(dictionary.City || []).map((res: any) => (
              <Option value={res.value}>{res.name}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'productName',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'matchProductName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'productSpec',
      valueType: 'text',
      width: '12%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'matchProductSpec',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'originalProducer',
      valueType: 'text',
      width: '12%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'originalProducer',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      width: '12%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'matchStandardProductCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductName',
      valueType: 'text',
      width: '15%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'matchStandardProductName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      width: '12%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'matchStandardProductSpec',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProducer',
      valueType: 'text',
      width: '12%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProducer',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: '13%',
    },
    {
      title: '????????????',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: '13%',
    },
    {
      title: '??????',
      dataIndex: 'productRinseStatus',
      valueType: 'text',
      width: '12%',
      hideInSearch: true,
      valueEnum: transformArray('matchSearchType', 'label', 'value'),
    },
    {
      title: '??????',
      dataIndex: 'matchRinseStatus',
      hideInTable: true,
      renderFormItem: (_, { value, onChange }) => {
        return (
          <Select placeholder="?????????" style={{ width: '100%' }}>
            {(matchSearchType || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'action',
      hideInSearch: true,
      width: '8%',
      fixed: 'right',
      render: (text: any, record: any, index: any) => (
        <div>
          {record.productRinseStatus === 'FAIL' && '--'}
          {record.productRinseStatus === 'SUCCESS' && (
            <Authorized code={'monthProdMatch-revert'}>
              <Popconfirm
                onConfirm={() => cancelMatch(record)}
                title={'????????????????????????????????????'}
                disabled={disabledForIsSeal}
              >
                <a
                  type="link"
                  style={{ color: disabledForIsSeal ? '#aaaaaa' : '#FF9300' }}
                >
                  ????????????
                </a>
              </Popconfirm>
            </Authorized>
          )}
        </div>
      ),
    },
  ];

  const columns2: ProColumns<GithubIssueItem>[] = [
    {
      title: '??????',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'left',
      width: '5%',
      render: (text: any, record: any, index: any) => (
        <div>
          <Authorized code={'monthProdMatch-clean'}>
            <Popconfirm
              onConfirm={() => {
                submitMatch(record);
              }}
              title={'??????????????????'}
              disabled={disabledForIsSeal}
            >
              <a
                type="link"
                style={{ color: disabledForIsSeal ? '#aaaaaa' : '#FF9300' }}
              >
                ??????
              </a>
            </Popconfirm>
          </Authorized>
        </div>
      ),
    },
    {
      title: '??????????????????',
      dataIndex: 'name',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '??????????????????',
      dataIndex: 'specification',
      valueType: 'text',
      width: '8%',
    },
    {
      title: '??????',
      dataIndex: 'manufacturer',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '?????????',
      dataIndex: 'tradeName',
      valueType: 'text',
      width: '8%',
      hideInSearch: true,
    },
    {
      title: '?????????',
      dataIndex: 'commonName',
      valueType: 'text',
      width: '8%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'code',
      valueType: 'text',
      width: '8%',
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '????????????',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '??????',
      dataIndex: 'state',
      valueType: 'text',
      width: '8%',
      hideInSearch: true,
      render: text => transform(text),
    },
    {
      title: '??????',
      dataIndex: 'state',
      hideInTable: true,
      renderFormItem: (_, { value, onChange }) => {
        return (
          <Select allowClear placeholder="?????????" style={{ width: '100%' }}>
            {(dictionary.State || []).map((res: any) => (
              <Option value={res.value}>{res.name}</Option>
            ))}
          </Select>
        );
      },
    },
  ];

  const transform = (text: any) => {
    let showText: any = null;
    dictionary.State.forEach((i: any) => {
      if (i.value === text) {
        showText = i.name;
      }
    });
    return showText;
  };

  const cancelMatch = async (record: any) => {
    let submitData: any = {
      inspectSaleDTOList: [
        {
          ...record,
        },
      ],
      dataTypeDesc: 'MONTH',
    };
    try {
      await cancelCheckForProduct(submitData);
      message.success('????????????');
      actionRef1?.current?.reload();
      getSaleCount();
      setSelectedRowKeys([]);
      setSelectedRowData([]);
    } catch (e) {
      message.error('????????????????????????');
    }
  };

  const getSaleCount = () => {
    getMatchCount({
      status: 'product',
      periodId: ref.current?.getFieldValue('matchPeriodId'),
      businessType: ref.current?.getFieldValue('matchBusinessType'),
    }).then((res: any) => {
      setSaleCount(res.data);
      setPageLoading(false);
    });
  };

  //??????
  const exportUnMatchFunc = (filter: any) => {
    const item: any = periodList.filter((i: any) => {
      return ref.current?.getFieldValue('matchPeriodId') === i.id;
    });
    exportUnMatch({
      statusList: 'product',
      periodId: ref.current?.getFieldValue('matchPeriodId'),
      periodName: item[0].periodName,
      businessType: ref.current?.getFieldValue('matchBusinessType'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  const submitMatch = async (record: any) => {
    setPageLoading(true);
    setButtonLoading(true);
    try {
      if (selectedRowData.length > 0) {
        let submitData: any = {
          inspectSaleDTOList: [...selectedRowData],
          productDTO: {
            ...record,
          },
          dataTypeDesc: 'MONTH',
        };
        const res: any = await matchSubmitForProduct(submitData);
        if (res.success) {
          setTimeout(() => {
            message.success('????????????');
            actionRef1?.current?.reload();
            getSaleCount();
            setSelectedRowKeys([]);
            setSelectedRowData([]);
            setButtonLoading(false);
          }, 3000);
        }
      } else {
        message.warning('??????????????????????????????');
        setButtonLoading(false);
        setPageLoading(false);
      }
    } catch (e) {
      // message.warning('????????????');
      setButtonLoading(false);
      setPageLoading(false);
    }
  };

  //???????????????????????????
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    selectedRows: selectedRowData,
    tableAlertRender: false,
    tableAlertOptionRender: false,
    onChange: (selectedRowKeys?: any, selectedRows?: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRowData(selectedRows);
    },
    getCheckboxProps: (record?: any) => {
      return {
        disabled: record.productRinseStatus === 'SUCCESS',
      };
    },
  };

  //??????????????????
  const allDataClean = () => {
    const params = { businessType: '', periodId: '' };
    params.businessType = searchParams.matchBusinessType
      ? searchParams.matchBusinessType
      : businessAllTypeName[0].value;
    params.periodId = searchParams.matchPeriodId
      ? searchParams.matchPeriodId
      : storage.get('defaultPeriod');
    setDisabledForCleanBtn(true);
    getDataCleanQuery(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('????????????');
      }
    });
  };

  const actionRef1 = useRef<ActionType>();
  const actionRef2 = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  const ref2 = useRef<FormInstance>();
  return (
    <div
      id="components-form-demo-advanced-search"
      className={styles.container}
      style={{ background: '#ffffff' }}
    >
      <Spin spinning={pageLoading}>
        <Row>
          <Col span={12}>
            <div className="search-result-list">
              {pageVisible && (
                <Table<GithubIssueItem>
                  code="toDoProcess-month-productMatch1"
                  saveSearchValue
                  loading={buttonLoading}
                  tableAlertRender={false}
                  columns={columns1}
                  rowSelection={rowSelection}
                  scroll={{ x: 1600 }}
                  sticky={true}
                  pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                  }}
                  search={{
                    span: 12,
                    labelWidth: 120,
                  }}
                  actionRef={actionRef1}
                  formRef={ref}
                  request={(params, sort, filter) => {
                    return getProductMatchList({
                      ...params,
                      ...sort,
                      ...filter,
                      matchPeriodId: ref.current?.getFieldValue(
                        'matchPeriodId',
                      ),
                      matchBusinessType: ref.current?.getFieldValue(
                        'matchBusinessType',
                      ),
                      matchRinseStatus: ref.current?.getFieldValue(
                        'matchRinseStatus',
                      ),
                      provinceNameList: regionData.province,
                      cityNameList: regionData.city,
                    });
                  }}
                  rowKey={'id'}
                  // rowKey={(record, index) => JSON.stringify(index)}
                  dateFormatter="string"
                  onReset={() => {
                    ref.current?.setFieldsValue({
                      matchPeriodId: periodId,
                      matchBusinessType: businessAllTypeName[0].value,
                      matchRinseStatus: 'FAIL',
                    });
                    //?????????????????????????????????????????????????????????
                    let item: any = periodList.filter((i: any) => {
                      return periodId === i.id;
                    });
                    setaArchiveFunc(item[0].isSeal);
                  }}
                  // params={searchParams}
                  onSubmit={params => {
                    setSearchParams(params);
                    setPageLoading(true);
                    getSaleCount();
                    //???????????????????????????????????????????????????
                    setaArchiveFunc(archiveStatus);
                  }}
                  headerTitle={
                    <div>
                      <Space style={{ display: 'flex' }}>
                        <h3>????????????{saleCount.untreated}</h3>
                        <h3>????????????{saleCount.treated}</h3>
                      </Space>
                      <Space>
                        <Authorized code={'monthProdMatch-export'}>
                          <Button
                            type="primary"
                            key={'export'}
                            onClick={filter => exportUnMatchFunc(filter)}
                          >
                            ???????????????
                          </Button>
                        </Authorized>
                        <Authorized code={'monthProdMatch-allClean'}>
                          <Button
                            type="default"
                            onClick={() => allDataClean()}
                            disabled={disabledForCleanBtn}
                          >
                            ??????????????????
                          </Button>
                        </Authorized>
                      </Space>
                    </div>
                  }
                  toolBarRender={() => []}
                />
              )}
            </div>
          </Col>
          <Col span={12}>
            <div className="search-result-list">
              {dictionary.State.length > 0 && (
                <Table<GithubIssueItem>
                  code="toDoProcess-month-productMatch2"
                  saveSearchValue
                  tableAlertRender={false}
                  columns={columns2}
                  scroll={{ x: 1300 }}
                  sticky={true}
                  loading={buttonLoading}
                  pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                  }}
                  search={{
                    span: 12,
                    labelWidth: 120,
                  }}
                  actionRef={actionRef2}
                  formRef={ref2}
                  onReset={() => {
                    ref2.current?.setFieldsValue({
                      code: undefined,
                      manufacturer: undefined,
                      name: undefined,
                      specification: undefined,
                      state: undefined,
                    });
                  }}
                  request={(params, sort, filter) => {
                    return getProductMatchRightList({
                      ...params,
                      ...sort,
                      ...filter,
                    });
                  }}
                  rowKey="id"
                  dateFormatter="string"
                  toolBarRender={() => []}
                />
              )}
            </div>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default withRouter(
  connect(({ dispatch, productMatch }: ProductMatchProps) => ({
    productMatch,
    dispatch,
  }))(ProductMatch),
);
