import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  message,
  Modal,
  Popconfirm,
  PageHeader,
  Select,
  Input,
  Descriptions,
  Form,
  Space,
} from 'antd';
import ProTable, {
  ActionType,
  ProColumns,
  TableDropdown,
} from '@ant-design/pro-table';
import {
  getInitPocketQuery,
  getBillPrintList,
  getBillPrintDetailQuery,
  handlePrintBill,
  getInstitutionPocket,
  handleModifyBillPrintQuery,
  getPeriodList,
  getUntreatedPeriod,
  getExportQuery,
  downLoadTemplateQuery,
} from '@/services/billPrint/index';
import { transformTextToArray } from '@/utils/transform.ts';
import { downloadFile } from '@/utils/exportFile.ts';
import { history } from '@@/core/history';
import './index.less';
import { Authorized, Table } from '@vulcan/utils';
import storage from '@/utils/storage';
import { getDictionary } from '@/services/dayMatchProcess';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

interface BillPrintProps {
  BillPrint: any;
  dispatch: any;
}

interface BillPrintItem {
  id?: string;
  province?: string;
  institutionCode?: string;
  institutionName?: any;
  city?: string;
  category?: string;
  printStatus?: any;
  collectType?: string;
  source?: string;
}

interface DetailProps {
  id?: string;
  province?: string;
  institutionCode?: string;
  institutionName?: string;
  city?: string;
  category?: string;
  printStatus?: string;
  collectType?: string;
  dataSource?: string;
  remark?: string;
  url?: string;
  username?: string;
  password?: string;
  periodName?: string;
  erpCode?: string;
}

const BillPrint: React.FC<BillPrintProps> = props => {
  const [printStatusPocket, setPrintStatusPocket] = useState([]);
  const [dataSourcePocket, setDataSourcePocket] = useState([]);
  const [accessTypePocket, setAccessTypePocket] = useState([]);
  const [
    billPrintDetailModalVisible,
    setBillPrintDetailModalVisible,
  ] = useState(false);
  const [
    billPrintModifyModalVisible,
    setBillPrintModifyModalVisible,
  ] = useState(false);
  const [institutionPocket, setInstitutionPocket] = useState([]);
  const [passWordModalVisible, setPassWordModalVisible] = useState(false);
  const [billPrintDetailData, setBillPrintDetailData] = useState<DetailProps>(
    {},
  );
  const [periodList, setPeriodList] = useState([]);
  const [periodNameModal, setPeriodNameModal] = useState(false);
  const [modifyStatus, setModifyStatus] = useState(2);
  const [newTableParams, setNewTableParams] = useState({});
  const [onSelectPeriodLabel, setOnSelectPeriodLabel] = useState('');
  const [onSelectPeriodValue, setOnSelectPeriodValue] = useState({});
  const [onSelectIsSeal, setOnSelectIsSeal] = useState('');
  const [pageHeaderName, setPageHeaderName] = useState('');
  const [searchParams, setSearchParams] = useState({});
  const [collectType, setCollectType] = useState('');
  const [dataSourceType, setDataSourceType] = useState('');
  const [institutionCategoryOption, setInstitutionCategoryOption] = useState(
    [],
  );
  const [institutionMdmDTO, setInstitutionMdmDTO] = useState({});
  const [dictionary, setDictionary] = useState({
    Region: [],
    City: [],
  });
  const [regionData, setRegionData] = useState({
    city: [],
  });
  const [province, setProvince] = useState([]);
  const [form] = Form.useForm();
  const [periodForm] = Form.useForm();

  function getPocket() {
    getInitPocketQuery().then((response: any) => {
      if (response.data && response.success === true) {
        setAccessTypePocket(response.data.accessTypePocket);
        setPrintStatusPocket(response.data.printStatusPocket);
        setDataSourcePocket(response.data.dataSourcePocket);
      }
    });
  }

  useEffect(() => {
    getPocket();
    getDictionaryFunc();
    const periods = storage.get('periods') || [];
    const tempPageHeaderName = periods.filter((item: any) => {
      return storage.get('defaultPeriod') === item.value;
    });
    //??????????????????
    setPageHeaderName(tempPageHeaderName[0].label);
    setNewTableParams({ periodId: storage.get('defaultPeriod') });
    //?????????????????????????????????
    setOnSelectPeriodLabel(tempPageHeaderName[0].label);
    setOnSelectPeriodValue(storage.get('defaultPeriod'));
  }, []);

  //????????????--?????????????????????
  const getDictionaryFunc = async () => {
    try {
      let optionData: any = { ...dictionary };
      const res = await getDictionary({
        systemCodes: ['InstitutionCategory', 'Region'],
      });
      if (res.data && res.data.list) {
        res.data.list.forEach((item: any) => {
          if (item.systemCode === 'InstitutionCategory') {
            setInstitutionCategoryOption(item.entries);
          }
          if (item.systemCode === 'Region') {
            optionData.Region = item.entries;
          }
        });
      }
      setDictionary(optionData);
    } catch (error) {
      message.error('???????????????????????????????????????');
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

  const columns: ProColumns<BillPrintItem>[] = [
    {
      title: '?????????',
      dataIndex: 'institutionName',
      valueType: 'text',
      ellipsis: true,
      tip: '???????????????????????????????????????????????????ERP??????',
      width: '15%',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'printStatus',
      width: '10%',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: _ => {
        return (
          <Select placeholder="?????????">
            {(printStatusPocket || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '???????????????',
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
      title: '???????????????',
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
      title: '???????????????',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '???????????????',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: 'ERP??????',
      dataIndex: 'erpCode',
      valueType: 'text',
      width: '8%',
      hideInSearch: true,
    },
    {
      title: '???????????????',
      dataIndex: 'province',
      valueType: 'text',
      width: '8%',
      hideInSearch: true,
    },
    {
      title: '???????????????',
      dataIndex: 'city',
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
    },
    {
      title: '????????????',
      dataIndex: 'category',
      valueType: 'text',
      hideInSearch: true,
      width: '8%',
      render: (_, record) =>
        transformTextToArray(
          institutionCategoryOption,
          'name',
          'value',
          'category',
          record,
        ),
    },
    {
      title: '????????????',
      dataIndex: 'printStatus',
      hideInSearch: true,
      width: '8%',
      render: (_, record) =>
        transformTextToArray(
          printStatusPocket,
          'label',
          'value',
          'printStatus',
          record,
        ),
    },
    {
      title: '????????????',
      dataIndex: 'collectType',
      valueType: 'text',
      width: '7%',
      hideInSearch: true,
      render: (_, record) =>
        transformTextToArray(
          accessTypePocket,
          'label',
          'value',
          'collectType',
          record,
        ),
    },
    {
      title: '????????????',
      dataIndex: 'dataSource',
      valueType: 'text',
      width: '7%',
      hideInSearch: true,
      render: (_, record) =>
        transformTextToArray(
          dataSourcePocket,
          'label',
          'value',
          'dataSource',
          record,
        ),
    },
    {
      title: '??????',
      dataIndex: 'action',
      hideInSearch: true,
      width: '15%',
      render: (text, record, index) => [
        <a type="link" onClick={() => handleBillPrintDetail(record)}>
          ??????
        </a>,
        <Button
          style={{ marginRight: -16 }}
          type="link"
          disabled={onSelectIsSeal === 'Archive'}
          onClick={() => {
            handleModifyBillPrint(record, 1);
            setModifyStatus(1);
          }}
        >
          ??????
        </Button>,
        record.printStatus === 'ACTIVE' ? (
          onSelectIsSeal === 'Archive' ? (
            <Button type="link" disabled={onSelectIsSeal === 'Archive'}>
              ??????????????????
            </Button>
          ) : (
            <Popconfirm
              onConfirm={() => setPrint(record)}
              title={'???????????????????????????????????????'}
            >
              <Button type="link">??????????????????</Button>
            </Popconfirm>
          )
        ) : onSelectIsSeal === 'Archive' ? (
          <Button type="link" disabled={onSelectIsSeal === 'Archive'}>
            ???????????????
          </Button>
        ) : (
          <Popconfirm
            onConfirm={() => setPrint(record)}
            title={'????????????????????????????????????'}
          >
            <Button type="link">???????????????</Button>
          </Popconfirm>
        ),
      ],
    },
  ];

  //??????
  const onReset = () => {
    setSearchParams({});
    setProvince([]);
    setRegionData({ city: [] });
  };

  //??????
  const handleBillPrintDetail = (record: any) => {
    const params = { id: record.id };
    getBillPrintDetailQuery(params).then((response: any) => {
      if (response && response.success && response.success === true) {
        setBillPrintDetailData(response.data);
        setBillPrintDetailModalVisible(true);
      }
    });
  };

  //????????????/?????????
  const setPrint = (record: any) => {
    let printStatus;
    if (record.printStatus === 'ACTIVE') {
      printStatus = 'INACTIVE';
    } else {
      printStatus = 'ACTIVE';
    }
    const params = {
      id: record.id,
      periodId: record.periodId,
      printStatus: printStatus,
      institutionCode: record.institutionCode,
    };
    handlePrintBill(params).then((response: any) => {
      if (response && response.data === true) {
        actionRef?.current?.reload();
        message.success('???????????????');
      } else {
        message.error('???????????????');
      }
    });
  };

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
        form.setFieldsValue({ institutionCode: item.code });
        form.setFieldsValue({ category: item.type });
        form.setFieldsValue({ erpCode: item.erpCode });
        setInstitutionMdmDTO(item);
      }
    });
  };

  //??????&&??????--??????
  const handleModifyBillPrint = async (record: any, modifyStatus: number) => {
    if (modifyStatus === 0) {
      //0?????????
      form.setFieldsValue({ periodName: onSelectPeriodLabel });
      form.setFieldsValue({ periodId: onSelectPeriodValue });
    } else {
      //1?????????
      form.resetFields();
      const res = await getBillPrintDetailQuery({ id: record.id });
      form.setFieldsValue(res.data);
    }
    setBillPrintModifyModalVisible(true);
  };

  //??????&&??????--??????
  const submitBillPrintModify = async () => {
    const billPrintModifyParams = await form.validateFields();
    //2021.7.27?????????????????????????????????????????????????????????????????????????????????????????????????????????institutionMdmDTO???{}
    const params = Object.assign(
      { institutionMdmDTO: institutionMdmDTO },
      billPrintModifyParams,
    );
    handleModifyBillPrintQuery(params).then((res: any) => {
      if (res && res.data === true) {
        message.success('????????????');
        actionRef?.current?.reload();
      } else {
        message.warning('????????????');
      }
    });
    form.resetFields();
    setBillPrintModifyModalVisible(false);
  };

  //??????
  const exportBillPrint = () => {
    getExportQuery(newTableParams).then((res: any) => {
      downloadFile(res);
    });
  };

  //????????????
  const downLoadTemplate = () => {
    downLoadTemplateQuery().then((res: any) => {
      downloadFile(res);
    });
  };

  //????????????????????????
  const handleHistoryBill = () => {
    periodForm.resetFields();
    getPeriodList().then((res: any) => {
      const periodArray: any = [];
      if (res && res.success === true) {
        res.data.forEach((item: any) => {
          let periodObj = { label: '', value: '', isSeal: '' };
          periodObj.label = item.periodName;
          periodObj.value = item.id;
          periodObj.isSeal = item.isSeal;
          periodArray.push(periodObj);
        });
        setPeriodList(periodArray);
      }
    });
    setPeriodNameModal(true);
  };

  //??????????????????????????????
  const onselectPeriodOption = (option: any) => {
    setOnSelectPeriodLabel(option.label);
    setOnSelectPeriodValue(option.value);
  };

  //??????????????????
  const changeCollectType = (e: any) => {
    setCollectType(e);
    if (e === 'MANUAL') {
      form.setFieldsValue({ dataSource: 'EMAIL' });
      setDataSourceType('EMAIL');
    } else {
      form.setFieldsValue({ dataSource: 'WEB' });
      setDataSourceType('WEB');
    }
  };

  //??????????????????
  const changeDataSource = (e: any) => {
    setDataSourceType(e);
    form.setFieldsValue({ url: '' });
    form.setFieldsValue({ username: '' });
    form.setFieldsValue({ password: '' });
  };

  //????????????
  const submitPeriodName = () => {
    periodForm
      .validateFields(['periodId'])
      .then(values => {
        setNewTableParams({ periodId: onSelectPeriodValue }); //????????????id???????????????
        const tempSearchParams = Object.assign(searchParams, {
          periodId: onSelectPeriodValue,
        });
        const checkedOption = (periodList || []).filter((item: any, i) => {
          return onSelectPeriodValue === item.value;
        });
        setOnSelectIsSeal(checkedOption[0]['isSeal']);
        actionRef?.current?.reload();
        setPeriodNameModal(false);
        setPageHeaderName(onSelectPeriodLabel); //?????????????????????????????????
        setSearchParams(tempSearchParams); //??????????????????????????????id
      })
      .catch(error => {});
  };

  const actionRef = useRef<ActionType>();
  return (
    <div id="components-form-demo-advanced-search">
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title={`??????:` + pageHeaderName}
        extra={[
          <Button
            type="link"
            key={'historyBillPrint'}
            onClick={() => handleHistoryBill()}
          >
            ??????
          </Button>,
        ]}
        backIcon={false}
        style={{
          borderWidth: 1,
          borderColor: 'rgb(235, 237, 240)',
          backgroundColor: '#fff',
        }}
      />
      <div>
        <div className="search-result-list">
          <Table<BillPrintItem>
            code="monitorReport-billPrint"
            saveSearchValue
            columns={printStatusPocket.length > 0 ? columns : []}
            onSubmit={params => {
              setSearchParams(params);
            }}
            onReset={() => onReset()}
            options={{ fullScreen: false }}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            params={newTableParams}
            actionRef={actionRef}
            request={(params, sort, filter) => {
              return getBillPrintList({
                provinceNameList: province,
                cityNameList: regionData.city,
                ...params,
                ...sort,
                ...filter,
              });
            }}
            rowKey="id"
            headerTitle={
              <Space>
                <Authorized code={'billPrint-add'}>
                  <Button
                    type="primary"
                    key={'add'}
                    onClick={() => {
                      handleModifyBillPrint({}, 0);
                      setBillPrintModifyModalVisible(true);
                      setModifyStatus(0);
                      changeCollectType('');
                    }}
                  >
                    + ??????
                  </Button>
                </Authorized>
                <Authorized code={'billPrint-export'}>
                  <Button
                    key={'export'}
                    onClick={() => {
                      exportBillPrint();
                    }}
                  >
                    ??????
                  </Button>
                </Authorized>
                <TableDropdown
                  key={'more'}
                  menus={[
                    {
                      key: 'export',
                      name: (
                        <Authorized code={'billPrint-import'}>
                          <span
                            onClick={() =>
                              history.push({
                                pathname:
                                  '/dataCollect/billManage/billPrint/import',
                                state: { periodId: onSelectPeriodValue },
                              })
                            }
                          >
                            ??????
                          </span>
                        </Authorized>
                      ),
                    },
                    {
                      key: 'downloadTemplate',
                      name: (
                        <Authorized code={'billPrint-downloadTemplate'}>
                          <span onClick={() => downLoadTemplate()}>
                            ????????????
                          </span>
                        </Authorized>
                      ),
                    },
                  ]}
                />
              </Space>
            }
          />
        </div>
        <div>
          <Modal
            title="??????"
            width={750}
            visible={billPrintDetailModalVisible}
            onCancel={() => setBillPrintDetailModalVisible(false)}
            onOk={() => setBillPrintDetailModalVisible(false)}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={() => setBillPrintDetailModalVisible(false)}
              >
                ??????
              </Button>,
            ]}
          >
            <Descriptions title="" column={2}>
              <Descriptions.Item label="" span={2}>
                <span
                  style={{ fontSize: 24, fontWeight: 700, marginRight: 20 }}
                >
                  {billPrintDetailData.institutionName}
                </span>
                <span style={{ fontSize: 16, fontWeight: 500 }}>
                  {billPrintDetailData.institutionCode}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="ERP??????">
                {billPrintDetailData.erpCode}
              </Descriptions.Item>
              <Descriptions.Item label="????????????">
                {billPrintDetailData.province}
              </Descriptions.Item>
              <Descriptions.Item label="????????????">
                {billPrintDetailData.city}
              </Descriptions.Item>
              <Descriptions.Item label="????????????">
                {billPrintDetailData.category}
              </Descriptions.Item>
              <Descriptions.Item label="????????????">
                {transformTextToArray(
                  printStatusPocket,
                  'label',
                  'value',
                  'printStatus',
                  billPrintDetailData,
                )}
              </Descriptions.Item>
              <Descriptions.Item label="????????????">
                {transformTextToArray(
                  accessTypePocket,
                  'label',
                  'value',
                  'collectType',
                  billPrintDetailData,
                )}
              </Descriptions.Item>
              {billPrintDetailData.collectType === 'MANUAL' ? (
                <Descriptions.Item label="????????????">
                  {transformTextToArray(
                    dataSourcePocket,
                    'label',
                    'value',
                    'dataSource',
                    billPrintDetailData,
                  )}
                </Descriptions.Item>
              ) : null}
              <Descriptions.Item label="??????">
                {billPrintDetailData.remark}
              </Descriptions.Item>
              {billPrintDetailData.collectType === 'MANUAL' &&
              billPrintDetailData.dataSource === 'WEB' ? (
                <React.Fragment>
                  <Descriptions.Item label="??????">
                    {billPrintDetailData.url}
                  </Descriptions.Item>
                  <Descriptions.Item label="?????????">******</Descriptions.Item>
                  <Descriptions.Item label="??????">
                    ******
                    <a
                      href="javascript:"
                      style={{
                        marginLeft: 40,
                        outline: 'none',
                        textDecoration: 'underline',
                        color: '#ff9300',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPassWordModalVisible(true)}
                    >
                      ????????????????????????
                    </a>
                  </Descriptions.Item>
                </React.Fragment>
              ) : null}
              <Descriptions.Item label="????????????">
                {billPrintDetailData.periodName}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </div>
        <div>
          <Modal
            title="???????????????"
            visible={passWordModalVisible}
            onCancel={() => setPassWordModalVisible(false)}
            onOk={() => setPassWordModalVisible(false)}
            footer={[
              <Button
                type="primary"
                onClick={() => setPassWordModalVisible(false)}
              >
                ?????????
              </Button>,
            ]}
          >
            <Descriptions title="" column={2}>
              <Descriptions.Item label="?????????">
                {billPrintDetailData.username}
              </Descriptions.Item>
              <Descriptions.Item label="??????">
                {billPrintDetailData.password}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </div>
        <div>
          <Modal
            title={modifyStatus === 0 ? '??????' : '??????'}
            width={750}
            destroyOnClose={true}
            visible={billPrintModifyModalVisible}
            onCancel={() => {
              form.resetFields();
              setBillPrintModifyModalVisible(false);
            }}
            footer={null}
            maskClosable={false}
          >
            <Form name="modifyBillPrint" form={form} {...formLayout}>
              <FormItem label="??????id" name="id" hidden={true}>
                <Input disabled={true} />
              </FormItem>
              <FormItem label="??????" name="periodName">
                <Input disabled={true} />
              </FormItem>
              <FormItem label="??????id" name="periodId" hidden={true}>
                <Input disabled={true} />
              </FormItem>
              <FormItem
                label="???????????????"
                name="institutionName"
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              >
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
                </Select>
              </FormItem>
              <FormItem
                label="???????????????"
                name="institutionCode"
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              >
                <Input disabled={true} />
              </FormItem>
              <FormItem label="ERP??????" name="erpCode">
                <Input disabled={true} />
              </FormItem>
              <FormItem
                label="????????????"
                name="category"
                rules={[
                  {
                    required: true,
                    message: '??????????????????',
                  },
                ]}
              >
                <Input disabled={true} />
              </FormItem>
              <FormItem
                label="????????????"
                name="collectType"
                rules={[
                  {
                    required: true,
                    message: '??????????????????',
                  },
                ]}
              >
                <Select onChange={e => changeCollectType(e)}>
                  {(accessTypePocket || []).map((res: any) => (
                    <Option value={res.value}>{res.label}</Option>
                  ))}
                </Select>
              </FormItem>
              {collectType === 'MANUAL' && (
                <FormItem
                  label="????????????"
                  name="dataSource"
                  rules={[
                    {
                      required: true,
                      message: '??????????????????',
                    },
                  ]}
                >
                  <Select onChange={e => changeDataSource(e)}>
                    {(dataSourcePocket || []).map((res: any) => (
                      <Option value={res.value}>{res.label}</Option>
                    ))}
                  </Select>
                </FormItem>
              )}
              {collectType === 'MANUAL' && dataSourceType === 'WEB' && (
                <FormItem label="??????" name="url">
                  <Input />
                </FormItem>
              )}
              {collectType === 'MANUAL' && dataSourceType === 'WEB' && (
                <FormItem label="?????????" name="username">
                  <Input />
                </FormItem>
              )}
              {collectType === 'MANUAL' && dataSourceType === 'WEB' && (
                <FormItem label="??????" name="password">
                  <Input />
                </FormItem>
              )}
              <FormItem label="??????" name="remark">
                <TextArea />
              </FormItem>
              <Form.Item
                style={{
                  borderTop: '1px #f0f0f0 solid',
                  marginLeft: -24,
                  marginRight: -24,
                  marginBottom: -5,
                  paddingTop: 15,
                }}
                wrapperCol={{ span: 12, offset: 19 }}
              >
                <Space>
                  <Button
                    htmlType="button"
                    onClick={() => {
                      form.setFieldsValue({});
                      form.setFieldsValue({ collectType: '' });
                      setBillPrintModifyModalVisible(false);
                    }}
                  >
                    ??????
                  </Button>
                  <Button
                    type="primary"
                    htmlType="button"
                    onClick={() => {
                      submitBillPrintModify();
                    }}
                  >
                    ??????
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div>
          <Modal
            title="????????????"
            visible={periodNameModal}
            destroyOnClose={true}
            onCancel={() => setPeriodNameModal(false)}
            onOk={() => setPeriodNameModal(false)}
            footer={[
              <Button
                htmlType="button"
                onClick={() => {
                  setPeriodNameModal(false);
                }}
              >
                ??????
              </Button>,
              <Button
                type="primary"
                htmlType="button"
                onClick={() => submitPeriodName()}
              >
                ??????
              </Button>,
            ]}
          >
            <Form form={periodForm}>
              <FormItem
                label="??????"
                name="periodId"
                rules={[
                  {
                    required: true,
                    message: '????????????',
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={option => onselectPeriodOption(option)}
                  labelInValue
                >
                  {(periodList || []).map((res: any) => (
                    <Option value={res.value}>{res.label}</Option>
                  ))}
                </Select>
              </FormItem>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default BillPrint;
