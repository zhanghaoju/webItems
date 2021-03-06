import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, message, Popconfirm, Modal, Space } from 'antd';
import { Table } from '@vulcan/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getInventoryDeliveryDataExportRequest,
  getInventoryDeliveryList,
  getUntreatedPeriod,
  getDataSeal,
  getCleanStatus,
  getInstitutionRelyQuery,
} from '@/services/monthDataManagement/deliveryDataManagement';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized } from '@vulcan/utils';
import { downloadFile } from '@/utils/exportFile';
import { FormInstance } from 'antd/lib/form';
import _ from 'lodash';
import { getPeriodList } from '@/services/initResource';
import { getDictionary } from '@/services/dayMatchProcess';

interface InventoryDeliveryProps {
  InventoryDelivery: any;
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

const InventoryDelivery: React.FC<InventoryDeliveryProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [initialPeriod, setInitialPeriod] = useState('');
  const [sealPeriodName, setSealPeriodName] = useState('');
  const [sealPeriodId, setSealPeriodId] = useState('');
  const [isSealNotice, setIsSealNotice] = useState('');
  const [dataSealModal, setDataSealModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [initialDataSealBtnText, setInitialDataSealBtnText] = useState('');
  const [periodNameValuePocket, setPeriodNameValuePocket] = useState(
    storage.get('pocketData').periodNamePocket,
  );
  const [searchParams, setSearchParams] = useState<any>({ periodIds: [] });
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [periodList, setPeriodList] = useState([]);
  const [dictionary, setDictionary] = useState({
    InstitutionCategory: [], //??????????????????????????????
    SubclassDealerLevel: [], //??????????????????????????????
    Region: [], //???
    City: [],
  });
  const [regionData, setRegionData] = useState({
    city: [],
  });
  const [province, setProvince] = useState([]);
  const [exportBeforeStatus, setExportBeforeStatus] = useState(false);

  useEffect(() => {
    getPeriodListFunc();
    getDictionaryFunc();
    getUntreatedPeriod().then((res: any) => {
      if (res && res.success === true) {
        setInitialDataSealBtnText(res.data.isSeal);
      }
    });
    //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    if (state && state.periodId) {
      ref.current?.setFieldsValue({
        periodIds: [state.periodId],
      });
      const periodName: any =
        _.find(periodNameValuePocket, ['value', state.periodId]) || {};
      setSearchParams({ periodIds: [state.periodId] });
      setSealPeriodName(periodName.label);
      history.replace({});
    } else {
      ref.current?.setFieldsValue({
        periodIds: [storage.get('defaultPeriod')],
      });
      const periodName: any =
        _.find(periodNameValuePocket, [
          'value',
          storage.get('defaultPeriod'),
        ]) || {};
      setSearchParams({ periodIds: [storage.get('defaultPeriod')] });
      setSealPeriodName(periodName.label);
    }
    setInitialPeriod(storage.get('defaultPeriod'));
    setSealPeriodId(storage.get('defaultPeriod')); //????????????????????????????????????id
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
    } else {
      setDisabledForIsSeal(false);
    }
  };

  //?????????????????????????????????????????????--?????????????????????
  const getDictionaryFunc = async () => {
    try {
      let optionData: any = { ...dictionary };
      const res = await getDictionary({
        systemCodes: ['SubclassDealerLevel', 'InstitutionCategory', 'Region'],
      });
      if (res.data && res.data.list) {
        res.data.list.forEach((item: any) => {
          if (item.systemCode === 'SubclassDealerLevel') {
            optionData.SubclassDealerLevel = item.entries;
          }
          if (item.systemCode === 'InstitutionCategory') {
            optionData.InstitutionCategory = item.entries;
          }
          if (item.systemCode === 'Region') {
            optionData.Region = item.entries;
          }
        });
      }
      setDictionary(optionData);
    } catch (error) {
      message.error('?????????????????????????????????????????????????????????');
    }
  };

  //????????????
  const getDictionaryCity = async (params: any) => {
    try {
      let optionData: any = { ...dictionary, City: [] };
      const res = await getDictionary({
        codes: params,
      });
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

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'periodIds',
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
            mode={'multiple'}
            placeholder="?????????"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              if (e.length > 0 && e.length <= 6) {
                ref.current?.setFieldsValue({
                  periodIds: e,
                });
                periodList.forEach((i: any) => {
                  if (e[e.length - 1] === i.id) {
                    setaArchiveStatus(i.isSeal);
                  }
                });
              }
              if (e.length === 0) {
                setSearchParams({ periodIds: [initialPeriod] });
                ref.current?.setFieldsValue({
                  periodIds: [initialPeriod],
                });
              }
              if (e.length > 6) {
                message.warning('??????????????????6????????????');
                let arr: any = e;
                arr.pop();
                ref.current?.setFieldsValue({
                  periodIds: arr,
                });
                periodList.forEach((i: any) => {
                  if (e[e.length - 1] === i.id) {
                    setaArchiveStatus(i.isSeal);
                  }
                });
              }
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
      width: '5%',
      ellipsis: true,
    },
    {
      title: '????????????',
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
      width: '5%',
    },
    {
      title: '????????????',
      dataIndex: 'inventoryDate',
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
    },
    {
      dataIndex: 'fromInstitutionLevel',
      title: '???????????????',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            placeholder={'?????????'}
            allowClear={true}
            style={{ width: '100%' }}
            options={dictionary.SubclassDealerLevel?.map(
              (t: { name: any; value: any }) => ({
                label: t?.name,
                value: t?.value,
              }),
            )}
          />
        );
      },
    },
    {
      dataIndex: 'fromInstitutionType',
      title: '???????????????',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            placeholder={'?????????'}
            allowClear={true}
            style={{ width: '100%' }}
            options={dictionary.InstitutionCategory?.map(
              (t: { name: any; value: any }) => ({
                label: t?.name,
                value: t?.value,
              }),
            )}
          />
        );
      },
    },
    {
      title: '?????????????????????',
      dataIndex: 'standardInstitutionName', //??????
      hideInSearch: true,
      valueType: 'text',
      width: '8%',
    },
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
                getDictionaryCity(params);
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
      title: '??????????????????', //??????
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInTable: true,
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
      width: '8%',
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
      width: '8%',
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
      width: '8%',
    },
    {
      title: '??????????????????',
      dataIndex: 'productSpec', //??????
      valueType: 'text',
      hideInSearch: true,
      width: '5%',
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
      width: '3%',
      render: (text: any, record: any, index: any) => [
        <a
          type="link"
          onClick={() =>
            history.push(
              `/dataManagement/monthlyDataManagement/deliveryDataManagement/inventoryDelivery/detail/${record.id}?sourceTabIndex=3&sourcePage=/dataManagement/monthlyDataManagement/deliveryDataManagement`,
            )
          }
        >
          ??????
        </a>,
      ],
    },
  ];

  //??????????????????????????????????????????
  const checkDataCleanStatus = () => {
    if (searchParams.periodIds.length === 0) {
      message.warning('???????????????');
      return false;
    }
    if (searchParams.periodIds.length > 1) {
      message.warning('?????????????????????????????????????????????');
      return false;
    }
    if (searchParams.periodIds.length === 1) {
      let params = { periodId: sealPeriodId };
      getCleanStatus(params).then((res: any) => {
        if (res && res.data && res.data === true) {
          setIsSealNotice('true'); //???true?????????????????????????????????????????????????????????
          setDataSealModal(true);
        } else {
          setIsSealNotice('false'); //???false????????????????????????????????????????????????
          setDataSealModal(true);
        }
      });
    }
  };

  //??????????????????
  const submitDataSeal = () => {
    let params = { periodId: sealPeriodId }; //???????????????????????????????????????????????????????????????????????????????????????????????????
    getDataSeal(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        setDataSealModal(false);
        periodNameValuePocket.forEach((item: any) => {
          if (params.periodId === item.value) {
            item.isSeal = 'Archive';
            setInitialDataSealBtnText('Archive'); //???????????????????????????????????????
            setPeriodNameValuePocket(periodNameValuePocket); //??????????????????pocket?????????????????????isSeal?????????????????????????????????
          }
        });
      }
    });
  };

  //???????????????????????????????????????????????????????????????isSeal?????????????????????????????????????????????setInitialDataSealBtnText
  const getDataSealStatus = (params: any) => {
    periodNameValuePocket.forEach((item: any) => {
      if (params.periodIds[0] === item.value) {
        setInitialDataSealBtnText(item.isSeal);
        setSealPeriodName(item.label);
        setSealPeriodId(item.value); //???????????????????????????????????????????????????????????????????????????????????????????????????
      }
    });
  };

  //??????????????????
  const instAttachCompute = () => {
    getInstitutionRelyQuery().then((res: any) => {
      if (res && res.success && res.success === true) {
      }
    });
  };

  //????????????
  const exportBefore = (filter: any) => {
    setExportBeforeStatus(true);
  };

  //??????
  const inventoryDeliveryExport = (filter: any) => {
    setExportLoading(true);
    // const checkedPeriodId = searchParams.periodIds;
    // const item: any = _.find(periodList, ['id', checkedPeriodId[0]]) || {};
    const params = Object.assign(
      {
        // periodName: item.periodName
      },
      searchParams,
    );
    getInventoryDeliveryDataExportRequest(params).then((res: any) => {
      downloadFile(res);
      setTimeout(() => {
        setExportLoading(false);
        setExportBeforeStatus(false);
      }, 3000);
    });
  };

  //????????????
  const onReset = () => {
    setSearchParams({ periodIds: [initialPeriod] });
    ref.current?.resetFields();
    ref.current?.setFieldsValue({
      periodIds: [initialPeriod],
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
            code="dataManage-month-inventoryDelivery"
            saveSearchValue
            tableAlertRender={false}
            onSubmit={params => {
              setSearchParams(params);
              getDataSealStatus(params);
              //???????????????????????????????????????????????????
              setaArchiveFunc(archiveStatus);
            }}
            columns={columns}
            onReset={() => {
              onReset();
              //?????????????????????????????????????????????????????????
              let item: any = periodList.filter((i: any) => {
                return searchParams.periodIds[0] === i.id;
              });
              setaArchiveFunc(item[0].isSeal);
            }}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            // params={searchParams}
            sticky={true}
            scroll={{ x: 4500 }}
            formRef={ref}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getInventoryDeliveryList({
                provinceNameList: province,
                cityNameList: regionData.city,
                periodIds: ref.current?.getFieldValue('periodIds'),
                ...params,
                ...sort,
                ...filter,
              });
            }}
            headerTitle={
              <Space>
                <Authorized code={'monthDelInve-export'}>
                  <Button
                    type="primary"
                    key={'export'}
                    onClick={filter => exportBefore(filter)}
                    loading={exportLoading}
                  >
                    ??????
                  </Button>
                </Authorized>
                <Authorized code={'monthDelInve-seal'}>
                  <Button
                    type="default"
                    key={'export'}
                    disabled={
                      initialDataSealBtnText !== 'UnArchive' ||
                      disabledForIsSeal
                    }
                    onClick={() => {
                      checkDataCleanStatus();
                    }}
                  >
                    {!initialDataSealBtnText ||
                    initialDataSealBtnText === 'Archive'
                      ? '???????????????'
                      : '????????????'}
                  </Button>
                </Authorized>
                {/* <Button type="default" onClick={() => instAttachCompute()}>
                  ????????????
                </Button>*/}
              </Space>
            }
            rowKey="id"
            dateFormatter="string"
          />
          <Modal
            title="????????????"
            visible={dataSealModal}
            destroyOnClose={true}
            onCancel={() => setDataSealModal(false)}
            onOk={() => setDataSealModal(false)}
            footer={[
              <Button
                htmlType="button"
                onClick={() => {
                  setDataSealModal(false);
                }}
              >
                ??????
              </Button>,
              <Button
                type="primary"
                htmlType="button"
                onClick={() => submitDataSeal()}
              >
                ??????
              </Button>,
            ]}
          >
            <div style={{ textAlign: 'center' }}>
              <ExclamationCircleFilled
                style={{ fontSize: 30, color: '#ff9300' }}
              />
              {isSealNotice === 'true' ? (
                <>
                  <div style={{ color: '#FE642E', marginTop: 10 }}>
                    ????????????????????????????????????
                  </div>
                  <div style={{ marginTop: 5 }}>
                    ???????????????
                    <span style={{ color: '#FE642E', fontSize: 18 }}>
                      &nbsp;&nbsp;{sealPeriodName}&nbsp; &nbsp;
                    </span>
                    ?????????????????????????????????
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginTop: 5 }}>
                    <span style={{ color: '#FE642E', fontSize: 18 }}>
                      &nbsp;&nbsp;{sealPeriodName}&nbsp; &nbsp;
                    </span>
                    ?????????????????????????????????????????????????????????
                  </div>
                </>
              )}
            </div>
          </Modal>
          <Modal
            title="????????????"
            visible={exportBeforeStatus}
            destroyOnClose={true}
            onCancel={() => setExportBeforeStatus(false)}
            maskClosable={false}
            footer={[
              <Button
                htmlType="button"
                onClick={() => setExportBeforeStatus(false)}
              >
                ??????
              </Button>,
              <Button
                type="primary"
                htmlType="button"
                onClick={() => inventoryDeliveryExport({})}
                loading={exportLoading}
              >
                ??????
              </Button>,
            ]}
          >
            <div style={{}}>
              <div>????????????????????????????????????????????????</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <div style={{ fontWeight: 'bolder', marginTop: '20px' }}>
                  ????????????
                </div>
                {(searchParams?.periodIds || []).map((item: any) =>
                  periodList.map((i: any) => {
                    if (item === i.id) {
                      return (
                        <div style={{ marginTop: '20px' }}>{i.periodName}</div>
                      );
                    }
                  }),
                )}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ dispatch, InventoryDelivery }: InventoryDeliveryProps) => ({
    InventoryDelivery,
    dispatch,
  }),
)(InventoryDelivery);
