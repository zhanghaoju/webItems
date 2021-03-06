import React, { useState, useRef, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
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
import { Table } from '@vulcan/utils';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getFromInstitutionMatchList,
  exportUnMatch,
  getMatchCount,
  cancelCheck,
  smartMatchFunc,
  getDataCleanQuery,
  getCleanIndustryMatchQuery,
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
import { Authorized } from '@vulcan/utils';
import styles from './index.less';
import { downloadFile } from '@/utils/exportFile.ts';
import MatchModal from './../commonComponent/commonModal';
import { FormInstance } from 'antd/lib/form';
import { dcrStatus } from '@/../constant';
import { getSaleTypeComputeQuery } from '@/services/monthDataManagement/deliveryDataManagement';
import { getCleanBtnStatusQuery } from '@/services/monthDataManagement/inspectDataManagement';

interface InstitutionMatchProps {
  institutionMatch: any;
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

const InstitutionMatch: React.FC<InstitutionMatchProps> = props => {
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
  const [dataSource, setDataSource] = useState<any>([]);
  const [disabledForCleanBtn, setDisabledForCleanBtn] = useState(false);

  useEffect(() => {
    getPeriodListFunc();
    getIsDisplayFunc();
    ifSmartMatchBtnDisabled();
    getUntreatedPeriod().then((res: any) => {
      setPageVisible(true);
      setPeriodId(storage.get('defaultPeriod'));
      ref.current?.setFieldsValue({
        matchBusinessType: businessAllTypeName[0].value,
        matchRinseStatus: 'FAIL',
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
      dataIndex: 'fromInstitutionName',
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
          <div style={{ width: '80%' }}>{record.fromInstitutionName}</div>
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
      title: '?????????????????????',
      dataIndex: 'matchFromInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
      fixed: 'left',
    },
    {
      title: '?????????????????????',
      dataIndex: 'matchStandardInstitutionCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionName',
      valueType: 'text',
      hideInSearch: true,
      width: '20%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'matchStandardInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????',
      dataIndex: 'standardInstitutionProvince',
      valueType: 'text',
      hideInSearch: true,
      width: '9%',
    },
    {
      title: '??????',
      dataIndex: 'standardInstitutionCity',
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '????????????',
      dataIndex: 'updateTime',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '??????',
      dataIndex: 'fromInstitutionRinseStatus',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
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
      width: '6%',
      render: (text: any, record: any, index: any) => (
        <div>
          {record.fromInstitutionRinseStatus === 'FAIL' && !disabledForIsSeal && (
            <Authorized code={'monthInsMatch-clean'}>
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
          {record.fromInstitutionRinseStatus === 'FAIL' && disabledForIsSeal && (
            <Authorized code={'monthInsMatch-clean'}>
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
          {record.fromInstitutionRinseStatus === 'SUCCESS' && (
            <Authorized code={'monthInsMatch-revert'}>
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
      await cancelCheck(submitData);
      message.success('??????????????????');
      actionRef?.current?.reload();
      getSaleCount();
    } catch (e) {
      message.error('??????????????????????????????');
    }
  };

  const getSaleCount = () => {
    getMatchCount({
      status: 'fromInstitution',
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
      statusList: 'fromInstitution',
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
      matchTabName: 'distrib',
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
      <Spin
        spinning={pageLoading}
        // size={'large'}
      >
        <div className="search-result-list">
          {pageVisible && (
            <Table<GithubIssueItem>
              code="toDoProcess-month-insMatch"
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
              scroll={{ x: 1800 }}
              actionRef={actionRef}
              formRef={ref}
              request={(params, sort, filter) => {
                return getFromInstitutionMatchList({
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
                  matchFromInstitutionName: undefined,
                  matchStandardInstitutionCode: undefined,
                  matchStandardInstitutionName: undefined,
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
                    <Authorized code={'monthInsMatch-export'}>
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
                    <Authorized code={'monthInsMatch-allClean'}>
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
            pageSource={1}
            isDisplay={isDisplay}
            goBackAndRefreshPage={goBackAndRefreshPage}
          />
        </Drawer>
      </Spin>
    </div>
  );
};

export default withRouter(
  connect(({ dispatch, institutionMatch }: InstitutionMatchProps) => ({
    institutionMatch,
    dispatch,
  }))(InstitutionMatch),
);
