import React, { useState, useRef, useEffect } from 'react';
import { Table } from '@vulcan/utils';
import { Button, Select, Space, Popconfirm, Modal, Spin, message } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  getPurchaseInspectList,
  getPurchaseCleanDetailList,
  getPurchaseInspectDataExportRequest,
  getUntreatedPeriod,
  getCancelMatchQuery,
  getDataCleanQuery,
  getCleanDetailList,
  getCleanBtnStatusQuery,
} from '@/services/monthDataManagement/inspectDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import { downloadFile } from '@/utils/exportFile';
import { FormInstance } from 'antd/lib/form';
import { getPeriodList } from '@/services/initResource';
import _ from 'lodash';
import { getDictionary } from '@/services/matchProcess';

interface PurchaseInspectProps {
  PurchaseInspect: any;
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

const PurchaseInspect: React.FC<PurchaseInspectProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [cleanDetailModalVisible, setCleanDetailModalVisible] = useState(false);
  const [cleanDetailData, setCleanDetailData] = useState([]);
  const [dataId, setDataId] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const fileStatusValuePocket = storage.get('pocketData').failCausePocket;
  const periodNameValuePocket = storage.get('pocketData').periodNamePocket;
  const baseInspectStatusPocket = storage.get('pocketData').baseInspectStatus;
  const [searchParams, setSearchParams] = useState<any>({ periodId: '' });
  const [initialPeriodName, setInitialPeriodName] = useState('');
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [periodList, setPeriodList] = useState([]);
  const [dictionary, setDictionary] = useState({
    Region: [],
    City: [],
  });
  const [regionData, setRegionData] = useState({
    city: [],
  });
  const [province, setProvince] = useState([]);

  useEffect(() => {
    getPeriodListFunc();
    getDictionaryFunc({ systemCodes: ['Region'] });
    //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    if (state && state.periodId) {
      ref?.current?.setFieldsValue({
        periodId: state.periodId,
      });
      setSearchParams({ periodId: state.periodId });
      history.replace({});
    } else {
      ref?.current?.setFieldsValue({
        periodId: storage.get('defaultPeriod'),
      });
      setSearchParams({ periodId: storage.get('defaultPeriod') });
    }
    setInitialPeriodName(storage.get('defaultPeriod'));
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

  const getCleanBtnStatus = () => {
    getCleanBtnStatusQuery().then((res: any) => {
      if (res && res.success && res.success === true) {
        setDisabledForIsSeal(res.data.cleanButton);
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
    } else {
      getCleanBtnStatusQuery().then((res: any) => {
        if (res && res.success && res.success === true) {
          setDisabledForIsSeal(res.data.cleanButton); //???true????????????false??????
        }
      });
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'periodId',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
          },
        ],
      },
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
              ref?.current?.setFieldsValue({
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
      title: '????????????',
      dataIndex: 'periodName',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      ellipsis: true,
      width: '6%',
    },
    {
      title: '????????????',
      dataIndex: 'purchaseDate',
      valueType: 'date',
      hideInSearch: true,
      width: '6%',
    },
    {
      title: '????????????',
      dataIndex: 'purchaseDate',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'accessType',
      valueType: 'text',
      hideInTable: true,
      valueEnum: transformArray('accessTypePocket', 'label', 'value'),
    },
    {
      title: '?????????????????????',
      dataIndex: 'toInstitutionName', //??????
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '?????????????????????',
      dataIndex: 'fromInstitutionName', //??????
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'productName', //??????
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionCode', //??????
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionCode', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionName', //??????
      valueType: 'text',
      hideInTable: true,
      width: '10%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionName', //??????
      hideInSearch: true,
      valueType: 'text',
      ellipsis: true,
      width: '10%',
    },
    // {
    //   title: '??????',
    //   dataIndex: 'standardInstitutionProvinceName',
    //   valueType: 'text',
    //   hideInTable: true,
    // },
    // {
    //   title: '??????',
    //   dataIndex: 'standardInstitutionCityName',
    //   valueType: 'text',
    //   hideInTable: true,
    // },
    {
      title: '??????',
      dataIndex: 'provinceNameList',
      hideInTable: true,
      valueType: 'select',
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
            labelInValue={true}
            placeholder="?????????"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              //????????????????????????
              form.resetFields(['cityNameList']);
              //???????????????????????????
              let optionData: any = { ...dictionary, City: [] };
              setDictionary(optionData);
              //????????????????????????????????????????????????e???????????????name
              if (e.length > 0) {
                let provinceNameList: any = [];
                let params: any = [];
                e.forEach((item: any) => {
                  provinceNameList.push(item.label);
                  params.push(item.value);
                });
                getDictionaryFunc({ codes: params });
                setProvince(provinceNameList);
              } else {
                form.resetFields(['provinceNameList']);
                setProvince([]);
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
      title: '?????????????????????', //??????
      dataIndex: 'standardVendorCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '?????????????????????', //??????
      dataIndex: 'standardVendorCode',
      hideInSearch: true,
      valueType: 'text',
      width: '7%',
    },
    {
      title: '?????????????????????', //??????
      dataIndex: 'standardVendorName',
      hideInTable: true,
      valueType: 'text',
    },
    {
      title: '?????????????????????', //??????
      dataIndex: 'standardVendorName',
      hideInSearch: true,
      valueType: 'text',
      width: '10%',
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInTable: true,
      width: '6%',
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductName',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProducer',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '????????????',
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '????????????',
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'toInstitutionCode', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'toInstitutionName', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'fromInstitutionCode', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'fromInstitutionName', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '??????????????????',
      dataIndex: 'productCode', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '??????????????????',
      dataIndex: 'productName', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '??????????????????',
      dataIndex: 'productSpec', //??????
      valueType: 'text',
      width: '5%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'originalProducer', //??????
      valueType: 'text',
      width: '5%',
      hideInSearch: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'productQuantity', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '??????????????????',
      dataIndex: 'productUnit', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '??????????????????',
      dataIndex: 'failCause',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            mode="multiple"
            allowClear
            placeholder="?????????"
            style={{ width: '100%' }}
          >
            {(fileStatusValuePocket || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'dataStatus',
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
    {
      title: '??????',
      dataIndex: 'dataStatus',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select allowClear placeholder="?????????" style={{ width: '100%' }}>
            {(baseInspectStatusPocket || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '?????????',
      dataIndex: 'fileName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????id',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'fileTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '??????',
      dataIndex: 'action',
      hideInSearch: true,
      fixed: 'right',
      width: '5%',
      render: (text: any, record: any, index: any) => [
        <a
          type="link"
          onClick={() =>
            history.push(
              `/dataManagement/monthlyDataManagement/inspectDataManagement/purchaseInspect/detail/${record.id}?sourceTabIndex=2&sourcePage=/dataManagement/monthlyDataManagement/inspectDataManagement`,
            )
          }
        >
          ??????
        </a>,
        <Button type="link" onClick={() => handleCleanDetailList(record)}>
          ????????????
        </Button>,
      ],
    },
  ];

  //?????????column
  const cleanDetailColumns = [
    {
      title: '?????????',
      dataIndex: 'cleanOptions',
      key: 'cleanOptions',
    },
    {
      title: '????????????',
      dataIndex: 'cleanStatus',
      key: 'cleanStatus',
    },
    {
      title: '??????',
      dataIndex: 'operation',
      render: (text: any, record: any) => {
        if (
          record.ifMatch === 'SUCCESS' &&
          !(record.cleanType === 'DATE' || record.cleanType === 'BILL_PRINT')
        ) {
          return (
            <Popconfirm
              title="???????????????????"
              onConfirm={() => handleCancelMatch(record)}
            >
              <Button type="link" style={{ marginLeft: -16 }}>
                ????????????
              </Button>
            </Popconfirm>
          );
        } else if (
          record.ifMatch === 'SUCCESS' &&
          (record.cleanType === 'DATE' || record.cleanType === 'BILL_PRINT')
        ) {
          return <span>-</span>;
        } else {
          return (
            <Button type="link" disabled={true} style={{ marginLeft: -16 }}>
              ????????????
            </Button>
          );
        }
      },
    },
  ];

  //????????????
  const handleCleanDetailList = (record: any) => {
    setDataId(record.id);
    getPurchaseCleanDetailList({ id: record.id }).then((response: any) => {
      if (response && response.success && response.success === true) {
        setCleanDetailModalVisible(true);
        if (response.data.length > 0) {
          response.data.forEach((item?: any, i?: any) => {
            item.ifMatch = item.cleanStatus;
            item.cleanStatus = transformText(
              'matchStatusPocket',
              'label',
              'value',
              'cleanStatus',
              item,
            );
          });
        }
        setCleanDetailData(response.data);
      }
    });
  };

  //????????????
  const handleCancelMatch = (record: any) => {
    const params = {
      id: dataId,
      cleanType: record.cleanType,
      businessType: 'PM',
    };
    setLoading(true);
    getCancelMatchQuery(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        //?????????????????????????????????????????????????????????????????????????????????????????????????????????
        setTimeout(async () => {
          try {
            const response = await getPurchaseCleanDetailList({ id: dataId });
            if (response.data.length > 0) {
              response.data.forEach((item?: any, i?: any) => {
                item.ifMatch = item.cleanStatus;
                item.cleanStatus = transformText(
                  'matchStatusPocket',
                  'label',
                  'value',
                  'cleanStatus',
                  item,
                );
              });
            }
            setCleanDetailData(response.data);
            setLoading(false);
          } catch (e) {
            setLoading(false);
            message.error('?????????????????????');
          }
        }, 2000);
      } else {
        setLoading(false);
        message.error('?????????????????????');
      }
    });
  };

  //??????
  const purchaseInspectExport = () => {
    setExportLoading(true);
    const checkedPeriodId = searchParams.periodId;
    const item: any = _.find(periodList, ['id', checkedPeriodId]) || {};
    const params = Object.assign({ periodName: item.periodName }, searchParams);
    getPurchaseInspectDataExportRequest(params).then((res: any) => {
      downloadFile(res);
      setTimeout(() => {
        setExportLoading(false);
      }, 3000);
    });
  };

  //??????????????????
  const allDataClean = () => {
    const params = { businessType: 'PM', periodId: '' };
    if (searchParams.periodId === '') {
      //?????????????????????
      params.periodId = ref?.current?.getFieldValue('periodId');
    } else {
      params.periodId = searchParams.periodId;
    }
    setDisabledForIsSeal(true);
    getDataCleanQuery(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('????????????');
      }
    });
  };

  //????????????
  const onReset = () => {
    ref?.current?.resetFields();
    ref?.current?.setFieldsValue({
      periodId: initialPeriodName,
    });
    setProvince([]);
    setRegionData({ city: [] });
  };

  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  return (
    <div id="components-form-demo-advanced-search">
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="dataManage-month-purchaseInspect"
            saveSearchValue
            tableAlertRender={false}
            onSubmit={params => {
              setSearchParams(params);
              //???????????????????????????????????????????????????
              setaArchiveFunc(archiveStatus);
            }}
            columns={columns}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            sticky={true}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            scroll={{ x: 4500 }}
            actionRef={actionRef}
            formRef={ref}
            onReset={() => {
              onReset();
              //?????????????????????????????????????????????????????????
              let item: any = periodList.filter((i: any) => {
                return searchParams.periodId === i.id;
              });
              setaArchiveFunc(item[0].isSeal);
            }}
            request={(params, sort, filter) => {
              return getPurchaseInspectList({
                provinceNameList: province,
                cityNameList: regionData.city,
                periodId: ref?.current?.getFieldValue('periodId'),
                ...params,
                ...sort,
                ...filter,
              });
            }}
            headerTitle={
              <Space>
                <Authorized code={'monthInsPurch-allClean'}>
                  <Button
                    type="primary"
                    key={'export'}
                    onClick={() => allDataClean()}
                    disabled={disabledForIsSeal}
                  >
                    ??????????????????
                  </Button>
                </Authorized>
                <Authorized code={'monthInsPurch-export'}>
                  <Button
                    type="default"
                    key={'export'}
                    onClick={() => purchaseInspectExport()}
                    loading={exportLoading}
                  >
                    ??????
                  </Button>
                </Authorized>
              </Space>
            }
            rowKey="id"
            dateFormatter="string"
          />
        </div>
        <div>
          <Modal
            title="????????????"
            width={750}
            visible={cleanDetailModalVisible}
            onCancel={() => {
              setLoading(false);
              setCleanDetailModalVisible(false);
            }}
            onOk={() => {
              setLoading(false);
              setCleanDetailModalVisible(false);
            }}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  setLoading(false);
                  setCleanDetailModalVisible(false);
                  actionRef?.current?.reload();
                }}
              >
                ??????
              </Button>,
            ]}
          >
            <Spin spinning={loading}>
              <ProTable
                columns={cleanDetailColumns}
                dataSource={cleanDetailData}
                pagination={false}
                search={false}
                options={false}
              />
            </Spin>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ dispatch, PurchaseInspect }: PurchaseInspectProps) => ({
    PurchaseInspect,
    dispatch,
  }),
)(PurchaseInspect);
