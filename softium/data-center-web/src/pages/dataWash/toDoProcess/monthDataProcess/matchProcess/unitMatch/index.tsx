import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  message,
  Popconfirm,
  Space,
  Modal,
  Drawer,
  Form,
  Input,
  Col,
  Row,
  InputNumber,
  Spin,
} from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getUnitMatchList,
  exportUnMatch,
  getMatchCount,
  cancelCheckForUnit,
  matchSubmitForUnit,
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
import MatchModal from './../commonComponent/commonModal';
import { FormInstance } from 'antd/lib/form';
import { withRouter } from 'react-router-dom';
import { getDataCleanQuery } from '@/services/ruleIntercept';
import { getCleanBtnStatusQuery } from '@/services/monthDataManagement/inspectDataManagement';

interface UnitMatchProps {
  unitMatch: any;
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
  productUnit?: string;
  saleDate?: string;
  saleYear?: string;
}

const { Option } = Select;
const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 14 },
};

const UnitMatch: React.FC<UnitMatchProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [saleCount, setSaleCount] = useState({
    treated: '',
    untreated: '',
  });
  const [currentData, setCurrentData] = useState<any>({});
  const [manualMatchVisible, setManualMatchVisible] = useState(false);
  const [selectedRowDataKeys, setSelectedRowDataKeys] = useState<any>([]);
  const [selectedRowData, setSelectedRowData] = useState<any>([]);
  const [isBatchMatch, setIsBatchMatch] = useState(0);
  const [periodList, setPeriodList] = useState([]);
  const matchSearchType = storage.get('pocketData').matchSearchType;
  const businessAllTypeName = storage.get('pocketData').businessAllTypeName;
  const [periodId, setPeriodId] = useState('');
  const [pageVisible, setPageVisible] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [searchParams, setSearchParams] = useState<any>({});
  const [disabledForCleanBtn, setDisabledForCleanBtn] = useState(false);
  const [dictionary, setDictionary] = useState({
    Region: [],
    City: [],
  });
  const [regionData, setRegionData] = useState({
    province: [],
    city: [],
  });

  const [form] = Form.useForm();

  useEffect(() => {
    getPeriodListFunc();
    getDictionaryFunc({ systemCodes: ['Region'] });
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

  const getDictionaryFunc = async (params: any) => {
    try {
      let optionData: any = { ...dictionary, City: [] };
      const res = await getDictionary(params);
      if (res.data && res.data.list) {
        res.data.list.forEach((item: any) => {
          if (item.systemCode === 'Region') {
            optionData.Region = item.entries;
          } else {
            optionData.City = optionData.City.concat([...item.entries]);
          }
        });
      }
      setDictionary(optionData);
    } catch (error) {
      message.error('????????????????????????');
    }
  };

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

  const columns: ProColumns<GithubIssueItem>[] = [
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
      valueType: 'text',
      hideInSearch: true,
      width: '13%',
      fixed: 'left',
    },
    {
      title: '?????????????????????',
      dataIndex: 'matchStandardInstitutionName',
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
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
      width: '13%',
      fixed: 'left',
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
      hideInSearch: true,
      width: '13%',
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
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProducer',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '????????????',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '????????????',
      dataIndex: 'matchProductUnit',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'matchStandardProductUnit',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'standardProductUnit',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '????????????',
      dataIndex: 'relationShip',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: '11%',
    },
    {
      title: '????????????',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: '11%',
    },
    {
      title: '??????',
      dataIndex: 'productUnitRinseStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('matchSearchType', 'label', 'value'),
      width: '7%',
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
      width: '7%',
      fixed: 'right',
      render: (text: any, record: any, index: any) => (
        <div>
          {record.productUnitRinseStatus === 'FAIL' && !disabledForIsSeal && (
            <Authorized code={'monthUnitMatch-clean'}>
              <a
                type="link"
                onClick={() => {
                  form.resetFields();
                  setCurrentData(record);
                  setManualMatchVisible(true);
                  setIsBatchMatch(0);
                  form.setFieldsValue({
                    relationShip: record.relationShip,
                    productUnitFormat: record.standardProductUnit,
                  });
                }}
              >
                ??????
              </a>
            </Authorized>
          )}
          {record.productUnitRinseStatus === 'FAIL' && disabledForIsSeal && (
            <Authorized code={'monthUnitMatch-clean'}>
              <a
                type="link"
                onClick={() => {}}
                style={{ color: disabledForIsSeal ? '#aaaaaa' : '#FF9300' }}
              >
                ??????
              </a>
            </Authorized>
          )}
          {record.productUnitRinseStatus === 'SUCCESS' && (
            <Authorized code={'monthUnitMatch-revert'}>
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

  const cancelMatch = async (record: any) => {
    setPageLoading(true);
    let submitData: any = {
      inspectSaleDTOList: [
        {
          ...record,
        },
      ],
      dataTypeDesc: 'MONTH',
    };
    try {
      await cancelCheckForUnit(submitData);
      message.success('??????????????????');
      actionRef?.current?.reload();
      getSaleCount();
      setSelectedRowDataKeys([]);
      setSelectedRowData([]);
    } catch (e) {
      message.error('??????????????????????????????');
    }
  };

  const getSaleCount = () => {
    getMatchCount({
      status: 'unit',
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
      statusList: 'unit',
      periodId: ref.current?.getFieldValue('matchPeriodId'),
      periodName: item[0].periodName,
      businessType: ref.current?.getFieldValue('matchBusinessType'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  const submitMatch = async (values: any) => {
    if (!values.originalRatio) {
      message.warning('??????????????????');
      return false;
    }
    if (!values.standardRatio) {
      message.warning('??????????????????');
      return false;
    }
    setPageLoading(true);
    setButtonLoading(true);
    try {
      let submitData: any = {
        inspectSaleDTOList: [],
        productDTO: { ...values },
        dataTypeDesc: 'MONTH',
      };
      //???????????????????????????????????????
      if (isBatchMatch === 0) {
        submitData.inspectSaleDTOList = [
          {
            ...currentData,
          },
        ];
      }
      //?????????????????????????????????
      if (isBatchMatch === 1) {
        submitData.inspectSaleDTOList = selectedRowData;
      }
      const res: any = await matchSubmitForUnit(submitData);
      if (res.success) {
        setTimeout(() => {
          message.success('????????????');
          setManualMatchVisible(false);
          actionRef?.current?.reload();
          getSaleCount();
          setSelectedRowDataKeys([]);
          setSelectedRowData([]);
          setButtonLoading(false);
        }, 3000);
      }
    } catch (e) {
      // message.warning('????????????');
      setButtonLoading(false);
    }
  };

  //???????????????????????????
  const rowSelection = {
    selectedRowKeys: selectedRowDataKeys,
    selectedRows: selectedRowData,
    tableAlertRender: false,
    tableAlertOptionRender: false,
    onChange: (selectedRowKeys?: any, selectedRows?: any) => {
      //???????????????????????????????????????
      if (selectedRows.length <= 1) {
        setSelectedRowDataKeys(selectedRowKeys);
        setSelectedRowData(selectedRows);
      }
      //2021???3???11???????????????????????????????????????????????????????????????????????????????????????????????????
      //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      if (selectedRows.length > 1 && selectedRowData.length > 0) {
        //????????????
        let isSame = true;
        //????????????????????????????????????????????????????????????????????????????????????????????????????????????
        selectedRows.forEach((item1: any, index1: any) => {
          for (
            let index = 0;
            index < selectedRows.length - index1 - 1;
            index++
          ) {
            if (
              // selectedRows[index1].standardProductCode !==
              //   selectedRows[index1 + index + 1].standardProductCode ||
              selectedRows[index1].standardProductUnit !==
                selectedRows[index1 + index + 1].standardProductUnit ||
              selectedRows[index1].productUnit !==
                selectedRows[index1 + index + 1].productUnit
            ) {
              isSame = false;
            }
          }
        });
        if (isSame) {
          if (
            // selectedRowData[0].standardProductCode ===
            //   selectedRows[selectedRows.length - 1].standardProductCode &&
            selectedRowData[0].standardProductUnit ===
              selectedRows[selectedRows.length - 1].standardProductUnit &&
            selectedRowData[0].productUnit ===
              selectedRows[selectedRows.length - 1].productUnit
          ) {
            setSelectedRowDataKeys(selectedRowKeys);
            setSelectedRowData(selectedRows);
          }
          if (
            // selectedRowData[0].standardProductCode ===
            //   selectedRows[selectedRows.length - 1].standardProductCode &&
            selectedRowData[0].standardProductUnit ===
              selectedRows[selectedRows.length - 1].standardProductUnit &&
            selectedRowData[0].productUnit !==
              selectedRows[selectedRows.length - 1].productUnit
          ) {
            message.warning('????????????????????????????????????');
            setSelectedRowDataKeys(selectedRowDataKeys);
            setSelectedRowData(selectedRowData);
          }
          if (
            // selectedRowData[0].standardProductCode !==
            //   selectedRows[selectedRows.length - 1].standardProductCode &&
            selectedRowData[0].standardProductUnit !==
              selectedRows[selectedRows.length - 1].standardProductUnit &&
            selectedRowData[0].productUnit ===
              selectedRows[selectedRows.length - 1].productUnit
          ) {
            message.warning('????????????????????????????????????');
            setSelectedRowDataKeys(selectedRowDataKeys);
            setSelectedRowData(selectedRowData);
          }
          if (
            // selectedRowData[0].standardProductCode !==
            //   selectedRows[selectedRows.length - 1].standardProductCode &&
            selectedRowData[0].standardProductUnit !==
              selectedRows[selectedRows.length - 1].standardProductUnit &&
            selectedRowData[0].productUnit !==
              selectedRows[selectedRows.length - 1].productUnit
          ) {
            message.warning('??????????????????????????????????????????????????????');
            setSelectedRowDataKeys(selectedRowDataKeys);
            setSelectedRowData(selectedRowData);
          }
        } else {
          // message.warning(
          //   '?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
          // );
          message.warning(
            '?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
          );
          setSelectedRowDataKeys(selectedRowDataKeys);
          setSelectedRowData(selectedRowData);
        }
      }
      //?????????????????????????????????????????????????????????????????????
      if (selectedRows.length > 1 && selectedRowData.length === 0) {
        //????????????
        let isSame = true;
        //????????????????????????????????????????????????????????????????????????????????????????????????????????????
        selectedRows.forEach((item1: any, index1: any) => {
          for (
            let index = 0;
            index < selectedRows.length - index1 - 1;
            index++
          ) {
            if (
              // selectedRows[index1].standardProductCode !==
              //   selectedRows[index1 + index + 1].standardProductCode ||
              selectedRows[index1].standardProductUnit !==
                selectedRows[index1 + index + 1].standardProductUnit ||
              selectedRows[index1].productUnit !==
                selectedRows[index1 + index + 1].productUnit
            ) {
              isSame = false;
            }
          }
        });
        if (isSame) {
          setSelectedRowDataKeys(selectedRowKeys);
          setSelectedRowData(selectedRows);
        } else {
          // message.warning(
          //   '?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
          // );
          message.warning(
            '?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
          );
          setSelectedRowDataKeys(selectedRowDataKeys);
          setSelectedRowData(selectedRowData);
        }
      }
    },
    getCheckboxProps: (record?: any) => {
      return {
        disabled: record.productUnitRinseStatus === 'SUCCESS',
        // ||
        // record.productUnitRinseStatus === 'SUCCESS'
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

  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  return (
    <div id="components-form-demo-advanced-search" className={styles.container}>
      <Spin spinning={pageLoading}>
        <div className="search-result-list">
          {pageVisible && (
            <Table<GithubIssueItem>
              code="toDoProcess-month-unitMatch"
              saveSearchValue
              tableAlertRender={false}
              columns={columns}
              sticky={true}
              rowSelection={rowSelection}
              pagination={{
                defaultPageSize: 10,
                showQuickJumper: true,
              }}
              search={{
                span: 8,
                labelWidth: 160,
              }}
              scroll={{ x: 2000 }}
              actionRef={actionRef}
              formRef={ref}
              request={(params, sort, filter) => {
                return getUnitMatchList({
                  ...params,
                  ...sort,
                  ...filter,
                  matchPeriodId: ref.current?.getFieldValue('matchPeriodId'),
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
              // rowKey={(record, index) => JSON.stringify(index)}
              rowKey={'id'}
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
              onSubmit={params => {
                setSearchParams(params);
                setPageLoading(true);
                getSaleCount();
                //???????????????????????????????????????????????????
                setaArchiveFunc(archiveStatus);
              }}
              // params={searchParams}
              headerTitle={
                <div>
                  <Space style={{ display: 'flex' }}>
                    <h3>????????????{saleCount.untreated}</h3>
                    <h3>????????????{saleCount.treated}</h3>
                  </Space>
                  <Space>
                    <Authorized code={'monthUnitMatch-batClean'}>
                      <Button
                        type="primary"
                        onClick={() => {
                          if (selectedRowData.length > 0) {
                            setIsBatchMatch(1);
                            form.resetFields();
                            setManualMatchVisible(true);
                          } else {
                            message.warning('??????????????????????????????');
                          }
                        }}
                        disabled={disabledForIsSeal}
                      >
                        ????????????
                      </Button>
                    </Authorized>
                    <Authorized code={'monthUnitMatch-export'}>
                      <Button
                        type="primary"
                        key={'export'}
                        onClick={filter => exportUnMatchFunc(filter)}
                      >
                        ???????????????
                      </Button>
                    </Authorized>
                    <Authorized code={'monthUnitMatch-allClean'}>
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
      </Spin>
      <Modal
        title={'????????????'}
        visible={manualMatchVisible}
        destroyOnClose={true}
        width={'50%'}
        onCancel={() => setManualMatchVisible(false)}
        footer={null}
        maskClosable={false}
      >
        <Form
          form={form}
          {...formLayout}
          onFinish={values => submitMatch(values)}
        >
          <Row>
            <Col span={12}>
              <FormItem
                label="????????????"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                style={{ textAlign: 'end' }}
                rules={[
                  {
                    required: true,
                    message: '??????????????????',
                  },
                ]}
              >
                <FormItem name="originalRatio" noStyle>
                  <InputNumber min={0} />
                </FormItem>
                <span className="ant-form-text">
                  {'????????????(' +
                    (selectedRowData.length > 0 && isBatchMatch === 1
                      ? selectedRowData[0].productUnit
                      : !!currentData && isBatchMatch === 0
                      ? currentData.productUnit
                      : '') +
                    ')='}
                </span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label=""
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 14 }}
                rules={[
                  {
                    required: true,
                    message: '????????????(???)??????',
                  },
                ]}
              >
                <FormItem name="standardRatio" noStyle>
                  <InputNumber min={0} />
                </FormItem>
                <span className="ant-form-text">
                  {'????????????(' +
                    (selectedRowData.length > 0 && isBatchMatch === 1
                      ? selectedRowData[0].standardProductUnit
                      : !!currentData && isBatchMatch === 0
                      ? currentData.standardProductUnit
                      : '') +
                    ')'}
                </span>
              </FormItem>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
            <Space>
              <Button
                htmlType="button"
                onClick={() => setManualMatchVisible(false)}
              >
                ??????
              </Button>
              <Button type="primary" htmlType="submit" loading={buttonLoading}>
                ??????
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default withRouter(
  connect(({ dispatch, unitMatch }: UnitMatchProps) => ({
    unitMatch,
    dispatch,
  }))(UnitMatch),
);
