import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  message,
  Popconfirm,
  Space,
  Modal,
  Drawer,
  Spin,
  Tag,
} from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getFromOrganizationMatchList,
  exportUnMatch,
  getMatchCount,
  cancelCheckForOrganization,
  smartMatchFunc,
  getCleanIndustryMatchQuery,
  getDictionary,
} from '@/services/matchProcess';
import {
  getUntreatedPeriod,
  getPeriodList,
  getIsDisplay,
} from '@/services/initResource';
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
import { dcrStatus } from '@/../constant';
import { getDataCleanQuery } from '@/services/ruleIntercept';
import { getCleanBtnStatusQuery } from '@/services/monthDataManagement/inspectDataManagement';

interface OrganizationMatchProps {
  organizationMatch: any;
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

const OrganizationMatch: React.FC<OrganizationMatchProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [saleCount, setSaleCount] = useState({
    treated: '',
    untreated: '',
  });
  const [matchVisible, setMatchVisible] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(null);
  const [periodList, setPeriodList] = useState([]);
  const [isDisplay, setIsDisplay] = useState({
    intelligence: 0,
    recommend: 0,
  });
  const matchSearchType = storage.get('pocketData').matchSearchType;
  const businessAllTypeName = storage.get('pocketData').businessAllTypeName;
  const [periodId, setPeriodId] = useState('');
  const [pageVisible, setPageVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [searchParams, setSearchParams] = useState<any>({});
  const [cleanIndustryMatchBtn, setCleanIndustryMatchBtn] = useState(false);
  const [disabledForCleanBtn, setDisabledForCleanBtn] = useState(false);
  const [dictionary, setDictionary] = useState({
    Region: [],
    City: [],
  });
  const [regionData, setRegionData] = useState({
    province: [],
    city: [],
  });
  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    getPeriodListFunc();
    getIsDisplayFunc();
    getDictionaryFunc({ systemCodes: ['Region'] });
    ifSmartMatchBtnDisabled();
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

  //?????????????????????????????????????????????
  const ifSmartMatchBtnDisabled = () => {
    getCleanIndustryMatchQuery().then((res: any) => {
      if (res && res.success && res.success === true && res.data === true) {
        //res.data???true ????????? false ??????
        setCleanIndustryMatchBtn(false);
      } else {
        setCleanIndustryMatchBtn(true);
      }
    });
  };

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

  const getIsDisplayFunc = async () => {
    try {
      const res = await getIsDisplay();
      setIsDisplay(res.data);
    } catch (e) {
      message.warning('???????????????????????????');
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    // {
    //   title: '??????DCR',
    //   dataIndex: 'dcr',
    //   hideInTable: true,
    //   renderFormItem: (_, { value, onChange }) => {
    //     return (
    //       <Select placeholder="?????????" style={{ width: '100%' }}>
    //         <Option value={1}>{'???'}</Option>
    //         <Option value={0}>{'???'}</Option>
    //       </Select>
    //     );
    //   },
    // },
    {
      title: '????????????',
      dataIndex: 'matchBusinessType',
      hideInTable: true,
      renderFormItem: (_, { value, onChange }) => {
        return (
          <Select placeholder="?????????" style={{ width: '100%' }}>
            {/* {(businessAllTypeName || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))} */}
            <Option value={'SD'}>{'??????'}</Option>
            <Option value={'PD'}>{'??????'}</Option>
            <Option value={'DD'}>{'??????'}</Option>
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
      width: '15%',
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
      dataIndex: 'toInstitutionName',
      valueType: 'text',
      hideInSearch: true,
      width: '18%',
      fixed: 'left',
      render: (text: any, record: any, index: any) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: '80%', fontWeight: 'bolder' }}>
            {record.toInstitutionName}
          </div>
          <div>
            {record.dcrTag ? (
              <Tag
                color={
                  dcrStatus.filter((item: any) => {
                    return item.value === record.dcrTag;
                  })[0]?.color
                }
              >
                {
                  dcrStatus.filter((item: any) => {
                    return item.value === record.dcrTag;
                  })[0]?.name
                }
              </Tag>
            ) : (
              <Tag color={'#ffffff'}></Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '??????????????????',
      dataIndex: 'matchToInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardCustomerCode',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
    },
    {
      title: '??????????????????',
      dataIndex: 'matchStandardCustomerCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardCustomerName',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
    },
    {
      title: '??????????????????',
      dataIndex: 'matchStandardCustomerName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????',
      dataIndex: 'standardCustomerProvince',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '??????',
      dataIndex: 'standardCustomerCity',
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
      width: '10%',
    },
    {
      title: '????????????',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: '10%',
    },
    {
      title: '??????',
      dataIndex: 'toInstitutionRinseStatus',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
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
      fixed: 'right',
      width: '7%',
      render: (text: any, record: any, index: any) => (
        <div>
          {record.toInstitutionRinseStatus === 'FAIL' && !disabledForIsSeal && (
            <Authorized code={'monthOrgMatch-clean'}>
              <a
                type="link"
                onClick={() => {
                  setCurrentData(record);
                  setCurrentIndex(index);
                  getIsDisplayFunc();
                  setMatchVisible(true);
                }}
              >
                ??????
              </a>
            </Authorized>
          )}
          {record.toInstitutionRinseStatus === 'FAIL' && disabledForIsSeal && (
            <Authorized code={'monthOrgMatch-clean'}>
              <Popconfirm
                onConfirm={() => cancelMatch(record)}
                title={'??????????????????????????????'}
                disabled={disabledForIsSeal}
              >
                <a
                  type="link"
                  onClick={() => {}}
                  style={{ color: disabledForIsSeal ? '#aaaaaa' : '#FF9300' }}
                >
                  ??????
                </a>
              </Popconfirm>
            </Authorized>
          )}
          {record.toInstitutionRinseStatus === 'SUCCESS' && (
            <Authorized code={'monthOrgMatch-revert'}>
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
    let submitData: any = {
      inspectSaleDTO: {
        ...record,
      },
      dataTypeDesc: 'MONTH',
    };
    try {
      await cancelCheckForOrganization(submitData);
      message.success('??????????????????');
      actionRef?.current?.reload();
      getSaleCount();
    } catch (e) {
      message.error('??????????????????????????????');
    }
  };

  const getSaleCount = () => {
    getMatchCount({
      status: 'toInstitution',
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
      statusList: 'toInstitution',
      periodId: ref.current?.getFieldValue('matchPeriodId'),
      periodName: item[0].periodName,
      businessType: ref.current?.getFieldValue('matchBusinessType'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  const goBackAndRefreshPage = () => {
    setMatchVisible(false);
    actionRef?.current?.reload();
    getSaleCount();
  };

  const smartMatch = async () => {
    let submitData: any = {
      matchTabName: 'mechanism',
      periodId: ref.current?.getFieldValue('matchPeriodId'),
      businessType: ref.current?.getFieldValue('matchBusinessType'),
      dataTypeDesc: 'MONTH',
    };
    try {
      await smartMatchFunc(submitData);
      message.success('??????????????????');
      actionRef?.current?.reload();
      getSaleCount();
      ifSmartMatchBtnDisabled();
    } catch (e) {
      message.error('??????????????????????????????');
    }
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
              code="toDoProcess-month-organizationMatch"
              saveSearchValue
              tableAlertRender={false}
              columns={columns}
              sticky={true}
              pagination={{
                defaultPageSize: 10,
                showQuickJumper: true,
              }}
              search={{
                span: 8,
                labelWidth: 160,
              }}
              scroll={{ x: 1700 }}
              actionRef={actionRef}
              formRef={ref}
              request={(params, sort, filter) => {
                return getFromOrganizationMatchList({
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
              postData={(data: any) => {
                setDataSource(data);
                return data;
              }}
              rowKey="id"
              dateFormatter="string"
              onReset={() => {
                ref.current?.setFieldsValue({
                  matchPeriodId: periodId,
                  matchBusinessType: businessAllTypeName[0].value,
                  matchRinseStatus: 'FAIL',
                  matchStandardInstitutionName: undefined,
                  matchToInstitutionName: undefined,
                  matchStandardCustomerCode: undefined,
                  matchStandardCustomerName: undefined,
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
                    <Authorized code={'monthOrgMatch-export'}>
                      <Button
                        type="primary"
                        key={'export'}
                        onClick={filter => exportUnMatchFunc(filter)}
                      >
                        ???????????????
                      </Button>
                    </Authorized>
                    {!!isDisplay.intelligence && (
                      <Popconfirm
                        onConfirm={() => smartMatch()}
                        title={'?????????????????????????????????'}
                        disabled={
                          parseInt(saleCount.untreated) <= 0 ||
                          disabledForIsSeal ||
                          cleanIndustryMatchBtn
                        }
                      >
                        <Button
                          type="default"
                          disabled={
                            parseInt(saleCount.untreated) <= 0 ||
                            disabledForIsSeal ||
                            cleanIndustryMatchBtn
                          }
                        >
                          ?????????????????????
                        </Button>
                      </Popconfirm>
                    )}
                    <Authorized code={'monthOrgMatch-allClean'}>
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
        <Drawer
          width={'65%'}
          destroyOnClose
          title={'??????'}
          visible={matchVisible}
          onClose={() => {
            setPageLoading(true);
            setMatchVisible(false);
            actionRef?.current?.reload();
            getSaleCount();
          }}
          maskClosable={false}
        >
          <MatchModal
            fatherCurrentData={currentData}
            fatherCurrentIndex={currentIndex}
            fatherDataSource={dataSource}
            pageSource={2}
            isDisplay={isDisplay}
            goBackAndRefreshPage={goBackAndRefreshPage}
          />
        </Drawer>
      </Spin>
    </div>
  );
};

export default withRouter(
  connect(({ dispatch, organizationMatch }: OrganizationMatchProps) => ({
    organizationMatch,
    dispatch,
  }))(OrganizationMatch),
);
