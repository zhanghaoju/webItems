import React, { useEffect, useRef, useState } from 'react';
import { Authorized, Table } from '@vulcan/utils';
import {
  Button,
  DatePicker,
  Drawer,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
} from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  getCancelMatchQuery,
  getCleanBtnStatusQuery,
  getDataCleanQuery,
  getInventoryCleanDetailList,
  getInventoryInspectDataExportRequest,
  getInventoryInspectList,
  getInventorySupplementList,
  getSupplementQuery,
  getInventorySupplementDetailList,
  getInstitutionPocket,
} from '@/services/monthDataManagement/inspectDataManagement';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { downloadFile } from '@/utils/exportFile';
import { FormInstance } from 'antd/lib/form';
import _ from 'lodash';
import { getPeriodList } from '@/services/initResource';
import { formatChinaStandardTimeToDate } from '@/utils/formatTime';
import { getDictionary } from '@/services/matchProcess';

interface InventoryInspectProps {
  InventoryInspect: any;
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
const { RangePicker } = DatePicker;

const InventoryInspect: React.FC<InventoryInspectProps> = props => {
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
  const baseInspectStatusPocket = storage.get('pocketData').baseInspectStatus;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<any>({ periodId: '' });
  const [initialPeriodName, setInitialPeriodName] = useState('');
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const [periodList, setPeriodList] = useState([]);
  const [childrenDrawerVisible, setChildrenDrawerVisible] = useState(false);
  const [createTimeDates, setCreateTimeDates] = useState<any>([]);
  const [createTimeValue, setCreateTimeValue] = useState<any>([]);
  const [formatDate, setFormatDate] = useState<any>();
  const [institutionPocket, setInstitutionPocket] = useState([]);
  const [fileId, setFileId] = useState();
  const [standardInstitutionCode, setStandardInstitutionCode] = useState();
  const [supplementSearchParams, setSupplementSearchParams] = useState<any>({});
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
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'periodId',
      width: '6%',
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
      ellipsis: true,
      width: '6%',
      fixed: 'left',
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
      width: '6%',
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
      width: '10%',
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
      width: '8%',
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
      width: '10%',
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
      title: '??????????????????',
      dataIndex: 'failCause',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
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
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
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
              `/dataManagement/monthlyDataManagement/inspectDataManagement/inventoryInspect/detail/${record.id}?sourceTabIndex=3&sourcePage=/dataManagement/monthlyDataManagement/inspectDataManagement`,
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
    getInventoryCleanDetailList({ id: record.id }).then((response: any) => {
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
      businessType: 'IM',
    };
    setLoading(true);
    getCancelMatchQuery(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        //?????????????????????????????????????????????????????????????????????????????????????????????????????????
        setTimeout(async () => {
          try {
            const response = await getInventoryCleanDetailList({ id: dataId });
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
    getInventoryInspectDataExportRequest(params).then((res: any) => {
      downloadFile(res);
      setTimeout(() => {
        setExportLoading(false);
      }, 3000);
    });
  };

  //??????????????????
  const allDataClean = () => {
    const params = { businessType: 'IM', periodId: '' };
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

  //????????????column
  const supplementColumns: ProColumns<GithubIssueItem>[] = [
    {
      title: '?????????',
      dataIndex: 'institutionCode',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => [
        <Select
          onSearch={onSearchInstitutionName}
          onSelect={onChangeInstitution}
          showSearch
        >
          {(institutionPocket || []).map((res: any) => (
            <Option value={res.value} key={res.value}>
              {res.label}
            </Option>
          ))}
        </Select>,
      ],
      formItemProps: {
        rules: [
          {
            required: true,
            message: '?????????????????????',
          },
        ],
      },
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => [
        <RangePicker
          value={createTimeValue}
          disabledDate={creatDisabledDate}
          onChange={(val: any) => {
            setCreateTimeValue(val);
            onChangeCreatTimeValue(val);
          }}
          onCalendarChange={(val: any) => setCreateTimeDates(val)}
        />,
      ],
      formItemProps: {
        rules: [
          {
            required: true,
            message: '????????????????????????',
          },
        ],
      },
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      hideInSearch: true,
      width: '25%',
    },
    {
      title: '?????????',
      dataIndex: 'fileName',
      key: 'fileName',
      hideInSearch: true,
      width: '25%',
    },
    {
      title: '????????????',
      dataIndex: 'rowcount',
      key: 'rowcount',
      hideInSearch: true,
      width: '10%',
      render: (text: any, record: any) => [
        <a
          type="link"
          style={{ color: '#3C9BFB' }}
          onClick={() => {
            setFileId(record.id);
            setStandardInstitutionCode(record.institutionCode);
            setChildrenDrawerVisible(true);
          }}
        >
          {record.rowcount}
        </a>,
      ],
    },
    {
      title: '??????',
      dataIndex: 'operation',
      width: '10%',
      hideInSearch: true,
      render: (text: any, record: any) => [
        <Popconfirm
          title="???????????????????????????????????????????????????????"
          onConfirm={() => handleSupplement(record)}
        >
          <Button type="link" style={{ marginLeft: -16 }}>
            ????????????
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  //??????????????????column
  const inventoryDetailColumn: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'inventoryDate',
      valueType: 'date',
      hideInSearch: true,
      fixed: 'left',
      width: '6%',
      ellipsis: true,
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
      hideInSearch: true,
      valueType: 'text',
      width: '8%',
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
      title: '??????????????????',
      dataIndex: 'failCause',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
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
      fixed: 'right',
      width: '5%',
      valueEnum: transformArray('baseInspectStatus', 'label', 'value'),
    },
  ];

  //???????????????
  const onSearchInstitutionName = (e: any) => {
    const institutionName = { name: e };
    getInstitutionPocket(institutionName).then((res: any) => {
      //???????????????
      const institutionData = res.data.list;
      const tempArray: any = [];
      if (res && res.success === true) {
        (institutionData || []).map((item: any, index: number) => {
          let obj = { label: '', value: '', key: '' };
          obj = item;
          obj.label = item.name;
          obj.value = item.name;
          obj.key = item.code;
          tempArray.push(obj);
        });
        setInstitutionPocket(tempArray);
      }
    });
  };

  //???????????????
  const onChangeInstitution = (e: any) => {
    institutionPocket.forEach((item: any, i) => {
      if (e === item.name) {
        supplementRef.current?.setFieldsValue({ institutionCode: item.code });
      }
    });
  };

  //????????????????????????????????????7???
  const creatDisabledDate = (current: any) => {
    if (!createTimeDates || createTimeDates.length === 0) {
      return false;
    }
    const tooLate =
      createTimeDates[0] && current.diff(createTimeDates[0], 'days') > 7;
    const tooEarly =
      createTimeDates[1] && createTimeDates[1].diff(current, 'days') > 7;
    return tooEarly || tooLate;
  };

  //???????????????--??????????????????????????????????????????yy???mm???dd??????
  const onChangeCreatTimeValue = (val: any) => {
    supplementRef.current?.setFieldsValue({ createTime: val });
    if (Array.isArray(val)) {
      const earlyValue = formatChinaStandardTimeToDate(val[0]);
      const lateValue = formatChinaStandardTimeToDate(val[1]);
      setFormatDate([earlyValue, lateValue]);
    }
  };

  //????????????
  const handleSupplement = async (record: any) => {
    try {
      const params = {
        fileId: record.id,
        standardInstitutionCode: record.institutionCode,
        periodId: searchParams.periodId,
      };
      await getSupplementQuery(params);
      setDrawerVisible(false);
      message.success('??????');
    } catch (e) {
      message.warning('??????');
    }
  };

  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  const supplementRef = useRef<FormInstance>();
  return (
    <div id="components-form-demo-advanced-search">
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="dataManage-month-inventoryInspect"
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
            scroll={{ x: 4300 }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            sticky={true}
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
              return getInventoryInspectList({
                provinceNameList: province,
                cityNameList: regionData.city,
                periodId: ref.current?.getFieldValue('periodId'),
                ...params,
                ...sort,
                ...filter,
              });
            }}
            headerTitle={
              <Space>
                <Authorized code={'monthInsInve-allClean'}>
                  <Button
                    type="primary"
                    onClick={() => allDataClean()}
                    disabled={disabledForIsSeal}
                  >
                    ??????????????????
                  </Button>
                </Authorized>
                <Authorized code={'monthInsInve-export'}>
                  <Button
                    type="default"
                    key={'export'}
                    onClick={() => purchaseInspectExport()}
                    loading={exportLoading}
                  >
                    ??????
                  </Button>
                </Authorized>
                <Authorized code={'monthInsInve-repair'}>
                  <Button
                    type="default"
                    onClick={() => {
                      setDrawerVisible(true);
                    }}
                    disabled={disabledForIsSeal}
                  >
                    ????????????
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
            onOk={() => setCleanDetailModalVisible(false)}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={() => {
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
        <Drawer
          width={'67%'}
          title="????????????"
          placement="right"
          destroyOnClose={true}
          maskClosable={false}
          onClose={() => {
            setDrawerVisible(false);
            setCreateTimeValue([]);
          }}
          visible={drawerVisible}
          closable={true}
        >
          <ProTable<GithubIssueItem>
            options={false}
            bordered
            columns={supplementColumns}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            scroll={{ x: '100%', y: '52vh' }}
            search={{
              span: 8,
              labelWidth: 75,
            }}
            form={{
              ignoreRules: false,
            }}
            onSubmit={params => {
              setSupplementSearchParams({ createTime: formatDate });
            }}
            formRef={supplementRef}
            onReset={() => {
              setSupplementSearchParams('');
              setCreateTimeValue('');
            }}
            params={supplementSearchParams}
            sticky={true}
            request={(params, sort, filter) => {
              return getInventorySupplementList({
                ...params,
                ...sort,
                ...filter,
              });
            }}
          />
          <Drawer
            title="??????"
            width={'60%'}
            closable={true}
            destroyOnClose={true}
            maskClosable={false}
            onClose={() => setChildrenDrawerVisible(false)}
            visible={childrenDrawerVisible}
          >
            <ProTable
              options={false}
              columns={inventoryDetailColumn}
              pagination={{
                defaultPageSize: 10,
                showQuickJumper: true,
              }}
              scroll={{ x: 2400, y: '65vh' }}
              search={false}
              request={(params, sort, filter) => {
                return getInventorySupplementDetailList({
                  fileId: fileId,
                  standardInstitutionCode: standardInstitutionCode,
                  ...params,
                  ...sort,
                  ...filter,
                });
              }}
              rowKey="id"
              dateFormatter="string"
            />
            <div style={{ textAlign: 'end', marginRight: 24, marginTop: 40 }}>
              <Button
                key="submit"
                type="primary"
                onClick={() => setChildrenDrawerVisible(false)}
              >
                ??????
              </Button>
            </div>
          </Drawer>
        </Drawer>
      </div>
    </div>
  );
};

export default connect(
  ({ dispatch, InventoryInspect }: InventoryInspectProps) => ({
    InventoryInspect,
    dispatch,
  }),
)(InventoryInspect);
