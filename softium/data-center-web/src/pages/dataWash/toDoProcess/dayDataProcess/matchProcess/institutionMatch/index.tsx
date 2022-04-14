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
  getFromInstitutionMatchList,
  exportUnMatchForDay,
  getMatchCount,
  cancelCheck,
  smartMatchFunc,
  getDataCleanQuery,
  getCleanIndustryMatchQuery,
} from '@/services/dayMatchProcess';
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
import { dcrStatus } from '@/../constant';
import { getCleanBtnStatusQuery } from '@/services/monthDataManagement/inspectDataManagement';

interface InstitutionMatchProps {
  institutionMatch: any;
  dispatch: any;
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
  const [saleCount, setSaleCount] = useState({
    treated: '',
    untreated: '',
  });
  const [matchVisible, setMatchVisible] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [periodList, setPeriodList] = useState([]);
  const [isDisplay, setIsDisplay] = useState({
    intelligence: 0,
    recommend: 0,
  });
  const matchSearchType = storage.get('pocketData').matchSearchType;
  const businessAllTypeName = storage.get('pocketData').businessAllTypeName;
  const [pageVisible, setPageVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<any>({});
  const [disabledForCleanBtn, setDisabledForCleanBtn] = useState(false);
  const [cleanIndustryMatchBtn, setCleanIndustryMatchBtn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    getPeriodListFunc();
    getIsDisplayFunc();
    ifSmartMatchBtnDisabled();
    ifCleanBtnDisabled();
    getUntreatedPeriod().then((res: any) => {
      setPageVisible(true);
      ref.current?.setFieldsValue({
        matchBusinessType: businessAllTypeName[0].value,
        matchRinseStatus: 'FAIL',
      });
      getSaleCount();
    });
  }, []);

  //判断行业库智能匹配按钮是否置灰
  const ifSmartMatchBtnDisabled = () => {
    getCleanIndustryMatchQuery().then((res: any) => {
      if (res && res.success && res.success === true && res.data === true) {
        //res.data为true 可点击 false 置灰
        setCleanIndustryMatchBtn(false);
      } else {
        setCleanIndustryMatchBtn(true);
      }
    });
  };

  //判断全部数据清洗按钮是否置灰
  const ifCleanBtnDisabled = () => {
    getCleanBtnStatusQuery().then((res: any) => {
      if (res && res.success && res.success === true) {
        setDisabledForCleanBtn(res.data.cleanButton); //为true，置灰，false可点
      }
    });
  };

  const getPeriodListFunc = async () => {
    try {
      const res = await getPeriodList({});
      setPeriodList(res.data);
    } catch (e) {
      message.warning('获取账期下拉数据失败');
    }
  };

  const getIsDisplayFunc = async () => {
    try {
      const res = await getIsDisplay();
      setIsDisplay(res.data);
    } catch (e) {
      message.warning('获取行业库推荐失败');
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    // {
    //   title: '是否DCR',
    //   dataIndex: 'dcr',
    //   hideInTable: true,
    //   renderFormItem: (_, { value, onChange }) => {
    //     return (
    //       <Select placeholder="请选择" style={{ width: '100%' }}>
    //         <Option value={1}>{'是'}</Option>
    //         <Option value={0}>{'否'}</Option>
    //       </Select>
    //     );
    //   },
    // },
    {
      title: '数据类型',
      dataIndex: 'matchBusinessType',
      hideInTable: true,
      renderFormItem: (_, { value, onChange }) => {
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
      title: '原始经销商名称',
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
      title: '原始经销商名称',
      dataIndex: 'matchFromInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准经销商编码',
      dataIndex: 'standardInstitutionCode',
      valueType: 'text',
      hideInSearch: true,
      width: '15%',
      fixed: 'left',
    },
    {
      title: '标准经销商编码',
      dataIndex: 'matchStandardInstitutionCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      valueType: 'text',
      hideInSearch: true,
      width: '20%',
    },
    {
      title: '标准经销商名称',
      dataIndex: 'matchStandardInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '省份',
      dataIndex: 'standardInstitutionProvince',
      valueType: 'text',
      hideInSearch: true,
      width: '9%',
    },
    {
      title: '城市',
      dataIndex: 'standardInstitutionCity',
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: '10%',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: '10%',
    },
    {
      title: '状态',
      dataIndex: 'fromInstitutionRinseStatus',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
      valueEnum: transformArray('matchSearchType', 'label', 'value'),
    },
    {
      title: '状态',
      dataIndex: 'matchRinseStatus',
      hideInTable: true,
      renderFormItem: (_, { value, onChange }) => {
        return (
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(matchSearchType || []).map((res: any) => (
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
      fixed: 'right',
      width: '6%',
      render: (text: any, record: any, index: any) => (
        <div>
          {record.fromInstitutionRinseStatus === 'FAIL' && (
            <Authorized code={'dayInsMatch-clean'}>
              <a
                type="link"
                onClick={() => {
                  setCurrentData(record);
                  setCurrentIndex(index);
                  getIsDisplayFunc();
                  setMatchVisible(true);
                }}
              >
                匹配
              </a>
            </Authorized>
          )}
          {record.fromInstitutionRinseStatus === 'SUCCESS' && (
            <Authorized code={'dayInsMatch-revert'}>
              <Popconfirm
                onConfirm={() => cancelMatch(record)}
                title={'确认取消拦截选中数据吗？'}
              >
                <a type="link">撤销匹配</a>
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
      dataTypeDesc: 'DAY',
    };
    try {
      await cancelCheck(submitData);
      message.success('撤销匹配成功');
      actionRef?.current?.reload();
      getSaleCount();
    } catch (e) {
      message.error('撤销匹配失败请重试！');
    }
  };

  const getSaleCount = () => {
    getMatchCount({
      status: 'fromInstitution',
      businessType: ref.current?.getFieldValue('matchBusinessType'),
    }).then((res: any) => {
      setSaleCount(res.data);
      setPageLoading(false);
    });
  };

  //导出
  const exportUnMatchFunc = (filter: any) => {
    exportUnMatchForDay({
      statusList: 'fromInstitution',
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
      businessType: ref.current?.getFieldValue('matchBusinessType'),
      dataTypeDesc: 'DAY',
    };
    try {
      await smartMatchFunc(submitData);
      message.success('智能匹配成功');
      actionRef?.current?.reload();
      getSaleCount();
      ifSmartMatchBtnDisabled();
    } catch (e) {
      message.error('智能匹配失败请重试！');
    }
  };

  //全部数据清洗
  const allDataClean = () => {
    const params = { businessType: '' };
    params.businessType = searchParams.matchBusinessType
      ? searchParams.matchBusinessType
      : businessAllTypeName[0].value;
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
              code="toDoProcess-day-insMatch"
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
                  matchBusinessType: businessAllTypeName[0].value,
                  matchRinseStatus: 'FAIL',
                  matchFromInstitutionName: undefined,
                  matchStandardInstitutionCode: undefined,
                  matchStandardInstitutionName: undefined,
                });
              }}
              onSubmit={params => {
                setSearchParams(params);
                setPageLoading(true);
                getSaleCount();
              }}
              // params={searchParams}
              headerTitle={
                <div>
                  <Space style={{ display: 'flex' }}>
                    <h3>待处理：{saleCount.untreated}</h3>
                    <h3>已处理：{saleCount.treated}</h3>
                  </Space>
                  <Space>
                    <Authorized code={'dayInsMatch-export'}>
                      <Button
                        type="primary"
                        key={'export'}
                        onClick={filter => exportUnMatchFunc(filter)}
                      >
                        导出待匹配
                      </Button>
                    </Authorized>
                    {!!isDisplay.intelligence && (
                      <Popconfirm
                        onConfirm={() => smartMatch()}
                        title={'确认行业库智能匹配吗？'}
                        disabled={
                          parseInt(saleCount.untreated) <= 0 ||
                          cleanIndustryMatchBtn
                        }
                      >
                        <Button
                          type="default"
                          disabled={
                            parseInt(saleCount.untreated) <= 0 ||
                            cleanIndustryMatchBtn
                          }
                        >
                          行业库智能匹配
                        </Button>
                      </Popconfirm>
                    )}
                    <Authorized code={'dayInsMatch-allClean'}>
                      <Button
                        type="default"
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
        <Drawer
          width={'65%'}
          destroyOnClose
          title={'匹配'}
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

export default connect(
  ({ dispatch, institutionMatch }: InstitutionMatchProps) => ({
    institutionMatch,
    dispatch,
  }),
)(InstitutionMatch);
