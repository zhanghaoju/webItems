import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  message,
  Popconfirm,
  Space,
  Modal,
  Card,
  Form,
  Tabs,
  Row,
  Col,
  Input,
  Menu,
  Dropdown,
  Drawer,
  Popover,
  Spin,
} from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getMatchCount,
  getEnterpriseMatchList,
  getTradeMatchList,
  matchCheck,
  matchSubmit,
  addPlayNameLIst,
  getDictionary,
  addFromInstitution,
  addFromOrganization,
  matchSubmitForOrganization,
  mainDataInsert,
  getRegion,
} from '@/services/matchProcess';
import storage from '@/utils/storage';
import { Table } from '@vulcan/utils';
import styles from './index.less';
import { downloadFile } from '@/utils/exportFile.ts';
import { ExclamationCircleFilled } from '@ant-design/icons';
import Item from 'antd/lib/list/Item';

interface GithubIssueItem {
  id?: string;
  score?: number;
  standardCode?: string;
  name?: string;
  alias?: string;
  province?: string;
  city?: string;
}

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};

const formLayout2 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const MatchModal = (props: any) => {
  const {
    fatherCurrentData,
    pageSource,
    isDisplay,
    goBackAndRefreshPage,
    fatherDataSource,
    fatherCurrentIndex,
  } = props;
  const [buttonLoading, setButtonLoading] = useState(false);
  const [addMasterDataModalVisible, setAddMasterDataModalVisible] = useState(
    false,
  );
  const [dataListForEnterprise, setDataListForEnterprise] = useState([]);
  const [totalForEnterprise, setTotalForEnterprise] = useState();
  const [currentForEnterprise, setCurrentForEnterprise] = useState(1);
  const [dataListForTrade, setDataListForTrade] = useState([]);
  const [afterAddMasterData, setAfterAddMasterData] = useState({
    name: '',
    code: '',
    province: '',
    city: '',
    type: '',
  });
  const [tabsIndex, setTabsIndex] = useState('1');
  const [matchFailVisible, setMatchFailVisible] = useState(false);
  const [childCurrentData, setChildCurrentData] = useState({
    address: {},
  });
  const [
    addPlayNameLIstBeforeVisible,
    setAddPlayNameLIstBeforeVisible,
  ] = useState(false);
  const [addPlayNameLIstVisible, setAddPlayNameLIstVisible] = useState(false);
  const accessTypePocket = storage.get('pocketData').accessTypePocket;
  const [dictionary, setDictionary] = useState({
    InstitutionGrade: [],
    InstitutionAttribute: [],
    ServiceAttribute: [],
    Region: [],
    InstitutionCategory: [],
    City: [],
    County: [],
    SubCategory: [],
    SubCategoryJunior: [],
    CityForSearch: [],
    State: [],
  });
  const [regionData, setRegionData] = useState({
    province: {
      name: '',
    },
    city: {
      name: '',
    },
    county: {
      name: '',
    },
  });

  const [searchData, setSearchData] = useState({
    province: {
      name: '',
    },
    city: {
      name: '',
    },
  });

  const [defaultRegionData, setDefaultRegionData] = useState<any>({});
  const [mdmConfigData, setMdmConfigData] = useState<any>({});
  const [mainDataInsertModalVisible, setMainDataInsertModalVisible] = useState<
    any
  >(false);
  // const [goOnStatus, setGoOnStatus] = useState<any>(false);
  const goOnStatus = useRef(false);
  //?????????????????????????????????????????????????????????????????????????????????????????????load???????????????????????????????????????????????????
  const currentData = useRef({ ...fatherCurrentData });
  const currentIndex = useRef(fatherCurrentIndex);

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [form4] = Form.useForm();

  useEffect(() => {
    load();
  }, []);

  //????????????????????????????????????????????????
  const loadBefore = () => {
    //?????????????????????
    if (goOnStatus.current) {
      let data: any = {};
      goOnStatus.current = false;
      if (currentIndex.current + 1 < fatherDataSource.length) {
        currentIndex.current = currentIndex.current + 1;
        currentData.current = { ...fatherDataSource[currentIndex.current] };
        load();
      } else {
        message.warning('?????????????????????????????????????????????????????????');
        goBackAndRefreshPage();
      }
    } else {
      setTimeout(() => {
        goBackAndRefreshPage();
      }, 3000);
    }
  };

  const load = () => {
    form1.setFieldsValue({
      name:
        pageSource === 1
          ? currentData.current.fromInstitutionName
          : currentData.current.toInstitutionName,
    });
    getDictionaryFunc();
    getMdmConfigFunc();
  };

  //???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????input???
  const getMdmConfigFunc = async () => {
    const res: any = await matchCheck({});
    setMdmConfigData(res.data);
  };

  const getDictionaryFunc = async () => {
    try {
      let optionData: any = { ...dictionary };
      const res = await getDictionary({
        systemCodes: [
          'Region',
          'InstitutionCategory',
          'ServiceAttribute',
          'InstitutionAttribute',
          'InstitutionGrade',
          'State',
        ],
      });
      if (res.data && res.data.list) {
        res.data.list.forEach((item: any) => {
          if (item.systemCode === 'InstitutionGrade') {
            optionData.InstitutionGrade = item.entries;
          }
          if (item.systemCode === 'InstitutionAttribute') {
            optionData.InstitutionAttribute = item.entries;
          }
          if (item.systemCode === 'ServiceAttribute') {
            optionData.ServiceAttribute = item.entries;
          }
          if (item.systemCode === 'Region') {
            optionData.Region = item.entries;
          }
          if (item.systemCode === 'InstitutionCategory') {
            optionData.InstitutionCategory = item.entries;
          }
          if (item.systemCode === 'State') {
            optionData.State = item.entries;
          }
        });
      }
      getRegionFunc(optionData);
    } catch (error) {
      message.error('??????????????????');
    }
  };

  const getRegionFunc = async (optionData: any) => {
    try {
      const res = await getRegion({
        name:
          pageSource === 1
            ? currentData.current.fromInstitutionName
            : currentData.current.toInstitutionName,
      });
      //res.data?????????????????????????????????????????????????????????null??????else?????????????????????????????????????????????????????????
      if (res.data) {
        setDefaultRegionData(res.data);
        setRegionData({
          ...regionData,
          province: { name: res.data.province },
          city: { name: res.data.city },
          county: { name: res.data.county },
        });
        form1.setFieldsValue({
          province: res.data.provinceCode,
          city: res.data.cityCode,
        });
        setSearchData({
          ...searchData,
          province: { name: res.data.province },
          city: { name: res.data.city },
        });
        const cityOptions = await getDictionary({
          code: res.data.provinceCode,
        });
        let options: any = { ...optionData };
        options.CityForSearch =
          cityOptions?.data?.list && cityOptions?.data?.list?.length > 0
            ? cityOptions.data.list[0].entries
            : [];
        options.City =
          cityOptions?.data?.list && cityOptions?.data?.list.length > 0
            ? cityOptions.data.list[0].entries
            : [];
        if (res.data.cityCode) {
          getCountyFunc(res.data.cityCode, options);
        } else {
          setDictionary(options);
        }
      } else {
        if (
          pageSource === 2 &&
          currentData.current.standardInstitutionProvince
        ) {
          //???????????????????????????name?????????????????????id???????????????
          optionData.Region.forEach((i: any) => {
            if (currentData.current.standardInstitutionProvince === i.name) {
              form1.setFieldsValue({
                province: i.value,
              });
              //???????????????????????????????????????????????????????????????????????????????????????????????????????????????
              setDefaultRegionData({ province: i.name, provinceCode: i.value });
              setRegionData({
                ...regionData,
                province: { name: i.name },
              });
              getChildDictionary(4, i, optionData);
              setSearchDataFunc('province', i);
              form1.resetFields(['city']);
            }
          });
        }
        setDictionary(optionData);
      }
      getSearchList(
        1,
        currentData.current.standardInstitutionProvince,
        null,
        res.data,
      );
    } catch (error) {
      message.error('????????????');
    }
  };

  const getCountyFunc = async (cityCode: any, optionData: any) => {
    try {
      const countyOptions = await getDictionary({
        code: cityCode,
      });
      let options: any = { ...optionData };
      options.County =
        countyOptions?.data?.list && countyOptions?.data?.list.length > 0
          ? countyOptions.data.list[0].entries
          : [];
      setDictionary(options);
    } catch (error) {
      message.error('??????????????????');
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '?????????',
      dataIndex: 'score',
      valueType: 'text',
      width: '8%',
      render: text => (text ? text : '-'),
    },
    {
      title: '???????????????',
      dataIndex: 'code',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '???????????????',
      dataIndex: 'name',
      valueType: 'text',
      width: '24%',
      render: (text: any, record: any, index: any) => {
        return record?.highlight?.name ? (
          <div
            dangerouslySetInnerHTML={{ __html: record.highlight.name }}
          ></div>
        ) : (
          record.name
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'alias',
      valueType: 'text',
      ellipsis: true,
      width: '23%',
      render: (text: any, record: any, index: any) => {
        return record?.highlight?.['aliasInfos.name'] ? (
          <div
            dangerouslySetInnerHTML={{
              __html: record.highlight['aliasInfos.name'],
            }}
          ></div>
        ) : record.alias ? (
          record.alias
        ) : (
          getAliasFunc(record.aliasInfos)
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'province',
      valueType: 'text',
      width: '8%',
    },
    {
      title: '??????',
      dataIndex: 'city',
      valueType: 'text',
      width: '8%',
    },
    {
      title: '??????',
      dataIndex: 'state',
      valueType: 'text',
      width: '8%',
      render: text => transform(text),
    },
    {
      title: '??????',
      dataIndex: 'action',
      width: '12%',
      render: (text: any, record: any, index: any) => (
        <div>
          {/* <Popconfirm
            onConfirm={() => {
              beforeMatch(record);
            }}
            title={'??????????????????????????????'}
          >
            <a type="link">????????????</a>
          </Popconfirm> */}
          <Popover
            content={
              <div
                style={{
                  width: '180px',
                }}
              >
                <div
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ExclamationCircleFilled
                    twoToneColor="#FAB52B"
                    style={{ fontSize: '30px', color: '#FAB52B' }}
                  />
                  <div>
                    ??????????????????????????????
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#ff9300',
                      }}
                    >
                      ????????????????????????
                    </span>
                  </div>
                </div>
                <Space>
                  {/* <Button type={'default'}>??????</Button> */}
                  <Button
                    type={'default'}
                    loading={buttonLoading}
                    onClick={() => {
                      setButtonLoading(true);
                      beforeMatch(record);
                    }}
                  >
                    ??????
                  </Button>
                  <Button
                    type={'primary'}
                    loading={buttonLoading}
                    onClick={() => {
                      goOnStatus.current = true;
                      setButtonLoading(true);
                      beforeMatch(record);
                    }}
                  >
                    ???????????????
                  </Button>
                </Space>
              </div>
            }
            title={null}
            trigger="click"
          >
            <Button type={'link'}>????????????</Button>
          </Popover>
        </div>
      ),
    },
  ];

  const getAliasFunc = (data: any) => {
    let res: any = '';
    if (data) {
      data.forEach((i: any) => {
        res = res + i.name + ',';
      });
    } else {
      res = '-';
    }
    return res;
  };

  const columns2: ProColumns<GithubIssueItem>[] = [
    {
      title: '?????????',
      dataIndex: 'score',
      valueType: 'text',
      width: '8%',
      render: text => (text ? text : '-'),
    },
    {
      title: '???????????????',
      dataIndex: 'code',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '???????????????',
      dataIndex: 'name',
      valueType: 'text',
      width: '24%',
      render: (text: any, record: any, index: any) => {
        return record?.highlight?.name ? (
          <div
            dangerouslySetInnerHTML={{ __html: record.highlight.name }}
          ></div>
        ) : (
          record.name
        );
      },
    },
    {
      title: '??????',
      dataIndex: 'alias',
      valueType: 'text',
      width: '23%',
    },
    {
      title: '??????',
      dataIndex: 'province',
      valueType: 'text',
      width: '8%',
    },
    {
      title: '??????',
      dataIndex: 'city',
      valueType: 'text',
      width: '8%',
    },
    {
      title: '??????',
      dataIndex: 'action',
      width: '12%',
      render: (text: any, record: any, index: any) => (
        <div>
          {/* <Popconfirm
            onConfirm={() => {
              beforeMatch(record);
            }}
            title={'??????????????????????????????'}
          >
            <a type="link">????????????</a>
          </Popconfirm> */}
          <Popover
            content={
              <div
                style={{
                  width: '180px',
                }}
              >
                <div
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ExclamationCircleFilled
                    twoToneColor="#FAB52B"
                    style={{ fontSize: '30px', color: '#FAB52B' }}
                  />
                  <div>
                    ??????????????????????????????
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#ff9300',
                      }}
                    >
                      ????????????????????????
                    </span>
                  </div>
                </div>
                <Space>
                  {/* <Button type={'default'}>??????</Button> */}
                  <Button
                    type={'default'}
                    loading={buttonLoading}
                    onClick={() => {
                      beforeMatch(record);
                    }}
                  >
                    ??????
                  </Button>
                  {mdmConfigData.isInstitutionAutomaticCode === true && (
                    <Button
                      type={'primary'}
                      loading={buttonLoading}
                      onClick={() => {
                        goOnStatus.current = true;
                        setButtonLoading(true);
                        beforeMatch(record);
                      }}
                    >
                      ???????????????
                    </Button>
                  )}
                </Space>
              </div>
            }
            title={null}
            trigger="click"
          >
            <Button type={'link'}>????????????</Button>
          </Popover>
        </div>
      ),
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

  const checkAsFailMatch = async (value: any) => {
    setButtonLoading(true);
    let submitData: any = {
      inspectSaleDTO: {
        ...currentData.current,
      },
      institutionDTO: {
        ...childCurrentData,
        standardCode: value.standardCode,
        address: {
          '0': childCurrentData.address,
        },
      },
      tabName: tabsIndex === '1' ? 'enterprise' : 'industry',
      dataTypeDesc: 'MONTH',
    };
    confirmMatch(submitData);
  };

  const checkAsSuccessMatch = async (value: any) => {
    let submitData: any = {
      inspectSaleDTO: {
        ...currentData.current,
      },
      institutionDTO: {
        ...value,
        address: {
          '0': value.address,
        },
        standardCode: '',
      },
      tabName: tabsIndex === '1' ? 'enterprise' : 'industry',
      dataTypeDesc: 'MONTH',
    };
    confirmMatch(submitData);
  };

  const beforeMatch = async (record: any) => {
    //??????????????????????????????????????????child
    setChildCurrentData(record);
    try {
      if (tabsIndex === '1') {
        checkAsSuccessMatch(record);
      }

      if (tabsIndex === '2') {
        if (mdmConfigData.isInstitutionAutomaticCode === true) {
          checkAsSuccessMatch(record);
        }
        if (mdmConfigData.isInstitutionAutomaticCode === false) {
          setMatchFailVisible(true);
          if (mdmConfigData.isUseIndustryInstitutionCode === true) {
            form3.setFieldsValue({
              standardCode: record.code,
            });
          }
        }
      }
    } catch (e) {
      // message.error('????????????????????????');
    }
  };

  const confirmMatch = async (value: any) => {
    try {
      //??????pageSource ???1?????????????????????2???????????????
      if (pageSource === 1) {
        await matchSubmit(value);
      }
      if (pageSource === 2) {
        await matchSubmitForOrganization(value);
      }
      message.success('????????????');
      // setTimeout(() => {
      // goBackAndRefreshPage();
      // }, 3000);
      loadBefore();
    } catch (e) {
      // message.error('????????????????????????');
      setButtonLoading(false);
    }
  };

  const mainDataInsertBefore = async (value: any) => {
    try {
      const res: any = await mainDataInsert({
        name:
          pageSource === 1
            ? currentData.current.fromInstitutionName
            : currentData.current.toInstitutionName,
        type: value,
      });
      setMainDataInsertModalVisible(true);
    } catch (e) {
      message.error('????????????????????????');
      setButtonLoading(false);
    }
  };

  const getMdmConfig = async (value: any) => {
    let isCheck: any = false;
    switch (value) {
      case 'HealthCare':
        if (mdmConfigData.isOpenHealthCareDcr === true) {
          isCheck = true;
        }
        break;
      case 'Pharmacy':
        if (mdmConfigData.isOpenPharmacyDcr === true) {
          isCheck = true;
        }
        break;
      case 'Distributor':
        if (mdmConfigData.isOpenDistributorDcr === true) {
          isCheck = true;
        }
        break;
      case 'Agent':
        if (mdmConfigData.isOpenAgentDcr === true) {
          isCheck = true;
        }
        break;
      case 'Other':
        if (mdmConfigData.isOpenOtherDcr === true) {
          isCheck = true;
        }
        break;
      default:
        break;
    }
    if (isCheck === true) {
      mainDataInsertBefore(value);
    } else {
      openAddMasterDataModal(value);
    }
  };

  const menu = (
    <Menu>
      {(dictionary.InstitutionCategory || []).map((item: any) => {
        return (
          <Menu.Item
            key={item.value}
            onClick={() => {
              getMdmConfig(item.value);
            }}
          >
            {item.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  //?????????????????????????????????????????????????????????????????????????????????????????????
  const openAddMasterDataModal = async (type: any) => {
    setAddMasterDataModalVisible(true);
    form2.setFieldsValue({
      name:
        pageSource === 1
          ? currentData.current.fromInstitutionName
          : currentData.current.toInstitutionName,
      type: type,
      provinceId: defaultRegionData.provinceCode,
      cityId: defaultRegionData.cityCode,
      countyId: defaultRegionData.cityCode
        ? defaultRegionData.countyCode
        : null,
    });
    form2.resetFields(['category', 'subCategory']);
    dictionary.InstitutionCategory.forEach((i: any) => {
      if (i.value === type) {
        getChildDictionary(3, i);
      }
    });
  };

  //source???1???load?????????2.??????????????????????????????3.??????????????????????????????
  const getSearchList = async (
    source: any,
    provinceName?: any,
    paginationParams?: any,
    regionDatas?: any,
  ) => {
    setButtonLoading(false);
    //???????????????????????????????????????????????????
    if (form1.getFieldValue('name').length < 2) {
      message.warning('????????????????????????????????????????????????2?????????');
      return false;
    }
    //??????????????????????????????
    let submitData1: any = {
      source: [
        {
          names: form1.getFieldValue('name').split(' '),
          state: tabsIndex === '1' ? form1.getFieldValue('state') : null,
          province: form1.getFieldValue('province'),
          city: form1.getFieldValue('city'),
        },
      ],
    };
    let submitData2: any = {
      source: [
        {
          names: form1.getFieldValue('name').split(' '),
          state: tabsIndex === '1' ? form1.getFieldValue('state') : null,
          province:
            pageSource === 2 && source === 1
              ? provinceName
              : searchData.province.name,
          city: searchData.city.name,
        },
      ],
    };
    //????????????????????????
    setDataListForEnterprise([]);
    setDataListForTrade([]);
    //source ??????1??????load????????????
    if (source === 1) {
      const enterpriseMatchList: any = await getEnterpriseMatchList({
        isSearch: 0,
        source: [
          {
            name: form1.getFieldValue('name'),
            state: tabsIndex === '1' ? form1.getFieldValue('state') : null,
            province: '',
            city: '',
          },
        ],
      });
      setDataListForEnterprise(enterpriseMatchList.data);
      setTotalForEnterprise(enterpriseMatchList.total);
      const tradeMatchList: any = await getTradeMatchList({
        isSearch: 0,
        source: [
          {
            name: form1.getFieldValue('name'),
            state: tabsIndex === '1' ? form1.getFieldValue('state') : null,
            province: regionDatas?.province || '',
            city: regionDatas?.city || '',
          },
        ],
      });
      setDataListForTrade(tradeMatchList.data);
    }
    //source ??????2?????????????????????????????????????????????????????????????????????
    if (source === 2) {
      //tabs?????????????????????????????????
      const enterpriseMatchList: any = await getEnterpriseMatchList({
        ...submitData1,
        isSearch: 1,
        pageNo: 1,
        pageSize: 20,
      });
      setDataListForEnterprise(enterpriseMatchList.data);
      setTotalForEnterprise(enterpriseMatchList.total);
      setCurrentForEnterprise(1);
      //tabs?????????????????????????????????
      const tradeMatchList: any = await getTradeMatchList({
        ...submitData2,
        isSearch: 1,
      });
      setDataListForTrade(tradeMatchList.data);
    }
    //source ??????3??????????????????????????????????????????
    if (source === 3) {
      //tabs?????????????????????????????????
      const enterpriseMatchList: any = await getEnterpriseMatchList({
        ...submitData1,
        isSearch: 1,
        pageNo: paginationParams,
        pageSize: 20,
      });
      setDataListForEnterprise(enterpriseMatchList.data);
      setTotalForEnterprise(enterpriseMatchList.total);
      setCurrentForEnterprise(paginationParams);
    }
  };

  const submitMasterData = async (value: any) => {
    setButtonLoading(true);
    let submitData: any = {
      institutionDTO: {
        ...value,
        source: 'SingleInsert',
        state: 'Active',
        address: {
          '0': value.address,
        },
        province: regionData.province.name,
        city: regionData.city.name,
        county: regionData.county.name,
        serviceAttribute: !!value.serviceAttribute
          ? value.serviceAttribute.toString()
          : '',
      },
      inspectSaleDTO: {
        ...currentData.current,
      },
      dataTypeDesc: 'MONTH',
    };
    //?????????????????????addFromOrganization
    try {
      let res: any = {};
      if (pageSource === 1) {
        res = await addFromInstitution(submitData);
      }
      if (pageSource === 2) {
        res = await addFromOrganization(submitData);
      }
      setAfterAddMasterData(res.data.institutionDTO);
      setButtonLoading(false);
      if (pageSource === 1) {
        setAddPlayNameLIstBeforeVisible(true);
      } else {
        setAddMasterDataModalVisible(false);
        // goBackAndRefreshPage();
        loadBefore();
      }
    } catch (error) {
      message.error('???????????????????????????');
      setButtonLoading(false);
    }
  };

  const submitAddPlayNameLIst = async (value: any) => {
    setButtonLoading(true);
    let submitData: any = {
      periodId: currentData.current.periodId,
      periodName: currentData.current.periodName,
      institutionCode: afterAddMasterData.code,
      institutionId: afterAddMasterData.code,
      institutionName: afterAddMasterData.name,
      province: afterAddMasterData.province,
      city: afterAddMasterData.city,
      category: afterAddMasterData.type,
      printStatus: 'Active',
      ...value,
    };
    try {
      await addPlayNameLIst(submitData);
      message.success('????????????????????????');
      setAddPlayNameLIstBeforeVisible(false);
      setAddPlayNameLIstVisible(false);
      setMatchFailVisible(false);
      // goBackAndRefreshPage();
      loadBefore();
    } catch (e) {
      message.error('????????????????????????????????????');
      setButtonLoading(false);
    }
  };

  const getChildDictionary = async (
    source: any,
    value: any,
    valueForLoad?: any,
  ) => {
    try {
      //???????????????????????????set???dictionary?????????????????????????????????dictionary?????????????????????????????????????????????????????????
      let optionData: any = valueForLoad
        ? { ...valueForLoad }
        : { ...dictionary };
      const res = await getDictionary({
        id: value.childDictionaryId,
      });
      if (res.data && res.data.list) {
        if (source === 1) {
          optionData.City = res.data.list[0].entries;
          setDictionary(optionData);
        }
        if (source === 2) {
          optionData.County = res.data.list[0].entries;
          setDictionary(optionData);
        }
        if (source === 3) {
          optionData.SubCategory = res.data.list[0].entries;
          setDictionary(optionData);
        }
        if (source === 4) {
          optionData.CityForSearch = res.data.list[0].entries;
          optionData.City = res.data.list[0].entries;
          setDictionary(optionData);
        }
        if (source === 5) {
          optionData.SubCategoryJunior = res.data.list[0].entries;
          setDictionary(optionData);
        }
      }
    } catch (error) {
      message.error('??????????????????');
    }
  };

  const setSearchDataFunc = (source: any, item: any) => {
    if (source === 'province') {
      setSearchData({ ...searchData, province: { name: item.name } });
    }

    if (source === 'city') {
      setSearchData({ ...searchData, city: { name: item.name } });
    }
  };

  const actionRef = useRef<ActionType>();
  return (
    <div id="components-form-demo-advanced-search" className={styles.container}>
      {/* <Spin spinning={buttonLoading}> */}
      <Card
        title={
          <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Col span={20}>
              <h3
                style={{
                  width: '100%',
                  height: 'auto',
                  wordBreak: 'break-all',
                  overflow: 'hidden',
                  whiteSpace: 'normal',
                }}
              >
                ??????????????????
                {pageSource === 1
                  ? currentData.current.fromInstitutionName
                  : currentData.current.toInstitutionName}
              </h3>
            </Col>
            <Col span={4}>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button type="primary">+???????????????</Button>
              </Dropdown>
            </Col>
          </Row>
        }
      >
        <Form
          form={form1}
          {...formLayout2}
          onFinish={values => getSearchList(2, null, null, null)}
        >
          <Row>
            <Col span="8">
              <FormItem label="??????" name="province">
                <Select
                  allowClear
                  onChange={e => {
                    if (e) {
                      dictionary.Region.forEach((i: any) => {
                        if (i.value === e) {
                          getChildDictionary(4, i);
                          setSearchData({
                            province: {
                              name: i.name,
                            },
                            city: {
                              name: '',
                            },
                          });
                          form1.resetFields(['city']);
                        }
                      });
                    } else {
                      setSearchData({
                        province: {
                          name: '',
                        },
                        city: {
                          name: '',
                        },
                      });
                      form1.resetFields(['city']);
                      let optionData: any = { ...dictionary };
                      optionData.CityForSearch = [];
                      setDictionary(optionData);
                    }
                  }}
                >
                  {(dictionary.Region || []).map((res: any) => (
                    <Option value={res.value}>{res.name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="??????" name="city">
                <Select
                  allowClear
                  onChange={e => {
                    dictionary.CityForSearch.forEach((i: any) => {
                      if (i.value === e) {
                        setSearchDataFunc('city', i);
                      }
                    });
                  }}
                >
                  {(dictionary.CityForSearch || []).map((res: any) => (
                    <Option value={res.value}>{res.name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            {tabsIndex === '1' ? (
              <Col span="8">
                <FormItem label="??????" name="state">
                  <Select allowClear>
                    {(dictionary.State || []).map((res: any) => (
                      <Option value={res.value}>{res.name}</Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            ) : (
              <Col span="8"></Col>
            )}
            <Col span="16">
              <FormItem
                label="?????????"
                name="name"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
                rules={[
                  {
                    required: true,
                    message: '???????????????',
                  },
                ]}
              >
                <Input />
              </FormItem>
            </Col>
            <Col
              span="8"
              offset="0"
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                type="default"
                onClick={() => {
                  form1.resetFields();
                }}
                style={{ marginRight: '20px' }}
              >
                ??????
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: '-7px' }}
              >
                ??????
              </Button>
            </Col>
          </Row>
          <Tabs
            defaultActiveKey="1"
            onChange={e => {
              setTabsIndex(e);
            }}
          >
            <TabPane tab="???????????????" key="1">
              <div className="search-result-list">
                <ProTable<GithubIssueItem, String[]>
                  // code="enterprise-recommend"
                  columns={columns}
                  options={false}
                  scroll={{ x: '100%', y: '40vh' }}
                  search={false}
                  actionRef={actionRef}
                  pagination={{
                    defaultPageSize: 20,
                    // showQuickJumper: true,
                    showSizeChanger: false,
                    onChange: paginationParams => {
                      getSearchList(3, null, paginationParams, null);
                    },
                    total: totalForEnterprise,
                    current: currentForEnterprise,
                  }}
                  dataSource={dataListForEnterprise || []}
                  rowKey="id"
                  dateFormatter="string"
                />
              </div>
            </TabPane>
            {!!isDisplay.recommend && (
              <TabPane tab="???????????????" key="2">
                <div className="search-result-list">
                  <ProTable<GithubIssueItem, String[]>
                    // code="industry-recommend"
                    columns={columns2}
                    options={false}
                    scroll={{ x: '100%', y: '40vh' }}
                    search={false}
                    actionRef={actionRef}
                    pagination={false}
                    dataSource={dataListForTrade || []}
                    rowKey="id"
                    dateFormatter="string"
                  />
                </div>
              </TabPane>
            )}
          </Tabs>
        </Form>
      </Card>
      {/* </Spin> */}
      <Drawer
        width={'40%'}
        destroyOnClose
        title={'??????'}
        visible={addMasterDataModalVisible}
        onClose={() => {
          form2.resetFields();
          setAddMasterDataModalVisible(false);
        }}
        maskClosable={false}
      >
        <Form
          form={form2}
          {...formLayout}
          onFinish={values => submitMasterData(values)}
        >
          <FormItem
            label="????????????"
            name="name"
            rules={[
              {
                required: true,
                message: '??????????????????',
              },
            ]}
          >
            <Input />
          </FormItem>
          {!mdmConfigData.isInstitutionAutomaticCode && (
            <FormItem
              label="????????????"
              name="code"
              rules={[
                {
                  required: true,
                  message: '??????????????????',
                },
              ]}
            >
              <Input />
            </FormItem>
          )}
          <FormItem
            label="??????"
            name="provinceId"
            rules={[
              {
                required: true,
                message: '????????????',
              },
            ]}
          >
            <Select
              onChange={e => {
                form2.resetFields(['cityId']);
                form2.resetFields(['countyId']);
                dictionary.Region.forEach((i: any) => {
                  if (i.value === e) {
                    getChildDictionary(1, i);
                    setRegionData({
                      ...regionData,
                      province: i,
                      city: { name: '' },
                      county: { name: '' },
                    });
                  }
                });
              }}
            >
              {(dictionary.Region || []).map((res: any) => (
                <Option value={res.value}>{res.name}</Option>
              ))}
            </Select>
          </FormItem>
          {!!form2.getFieldValue('provinceId') && (
            <FormItem
              label="??????"
              name="cityId"
              rules={[
                {
                  required: true,
                  message: '????????????',
                },
              ]}
            >
              <Select
                onChange={e => {
                  form2.resetFields(['countyId']);
                  dictionary.City.forEach((i: any) => {
                    if (i.value === e) {
                      getChildDictionary(2, i);
                      setRegionData({
                        ...regionData,
                        city: i,
                        county: { name: '' },
                      });
                    }
                  });
                }}
              >
                {(dictionary.City || []).map((res: any) => (
                  <Option value={res.value}>{res.name}</Option>
                ))}
              </Select>
            </FormItem>
          )}
          {!!form2.getFieldValue('provinceId') &&
            !!form2.getFieldValue('cityId') && (
              <FormItem label="??????" name="countyId">
                <Select
                  onChange={e => {
                    dictionary.County.forEach((i: any) => {
                      if (i.value === e) {
                        setRegionData({ ...regionData, county: i });
                      }
                    });
                  }}
                >
                  {(dictionary.County || []).map((res: any) => (
                    <Option value={res.value}>{res.name}</Option>
                  ))}
                </Select>
              </FormItem>
            )}
          <FormItem label="????????????" name="address">
            <Input />
          </FormItem>
          <FormItem
            label="????????????"
            name="type"
            rules={[
              {
                required: true,
                message: '??????????????????',
              },
            ]}
          >
            <Select
              onChange={e => {
                form2.resetFields(['category', 'subCategory']);
                dictionary.InstitutionCategory.forEach((i: any) => {
                  if (i.value === e) {
                    getChildDictionary(3, i);
                  }
                });
              }}
              disabled={true}
            >
              {(dictionary.InstitutionCategory || []).map((res: any) => (
                <Option value={res.value}>{res.name}</Option>
              ))}
            </Select>
          </FormItem>
          {!!form2.getFieldValue('type') &&
            form2.getFieldValue('type') === 'HealthCare' && (
              <FormItem label="????????????" name="category">
                <Select
                  onChange={e => {
                    form2.resetFields(['subCategory']);
                    dictionary.SubCategory.forEach((i: any) => {
                      if (i.value === e) {
                        getChildDictionary(5, i);
                      }
                    });
                  }}
                >
                  {(dictionary.SubCategory || []).map((res: any) => (
                    <Option value={res.value}>{res.name}</Option>
                  ))}
                </Select>
              </FormItem>
            )}
          {!!form2.getFieldValue('category') &&
            form2.getFieldValue('type') === 'HealthCare' && (
              <FormItem label="??????????????????" name="subCategory">
                <Select>
                  {(dictionary.SubCategoryJunior || []).map((res: any) => (
                    <Option value={res.value}>{res.name}</Option>
                  ))}
                </Select>
              </FormItem>
            )}
          <FormItem label="????????????" name="serviceAttribute">
            <Select mode={'multiple'}>
              {(dictionary.ServiceAttribute || []).map((res: any) => (
                <Option value={res.value}>{res.name}</Option>
              ))}
            </Select>
          </FormItem>
          {form2.getFieldValue('type') === 'HealthCare' && (
            <FormItem label="????????????" name="level">
              <Select>
                {(dictionary.InstitutionGrade || []).map((res: any) => (
                  <Option value={res.value}>{res.name}</Option>
                ))}
              </Select>
            </FormItem>
          )}
          {form2.getFieldValue('type') === 'HealthCare' && (
            <FormItem label="????????????" name="property">
              <Select>
                {(dictionary.InstitutionAttribute || []).map((res: any) => (
                  <Option value={res.value}>{res.name}</Option>
                ))}
              </Select>
            </FormItem>
          )}

          <FormItem label="??????" name="remark">
            <TextArea />
          </FormItem>

          <Row>
            <Col span="3" offset="18">
              <Button
                type="default"
                onClick={() => {
                  setAddMasterDataModalVisible(false);
                  form2.resetFields();
                }}
              >
                ??????
              </Button>
            </Col>
            <Col span="3">
              <Button type="primary" htmlType="submit" loading={buttonLoading}>
                ??????
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Modal
        title={'?????????????????????'}
        visible={matchFailVisible}
        destroyOnClose={true}
        width={'50%'}
        onCancel={() => setMatchFailVisible(false)}
        footer={null}
        maskClosable={false}
      >
        <Form
          form={form3}
          {...formLayout}
          onFinish={values => checkAsFailMatch(values)}
        >
          <FormItem
            label="???????????????"
            extra="?????????????????????????????????????????????????????????"
            name="standardCode"
            rules={[
              {
                required: true,
                message: '?????????????????????',
              },
            ]}
          >
            <Input />
          </FormItem>
          <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
            <Space>
              <Button
                htmlType="button"
                onClick={() => setMatchFailVisible(false)}
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
      <Modal
        title={'??????'}
        visible={addPlayNameLIstBeforeVisible}
        destroyOnClose={true}
        width={'50%'}
        onCancel={() => {
          setAddPlayNameLIstBeforeVisible(false);
          setMatchFailVisible(false);
          // goBackAndRefreshPage();
          loadBefore();
        }}
        onOk={() => {
          setAddPlayNameLIstBeforeVisible(false);
          setAddPlayNameLIstVisible(true);
          form4.setFieldsValue({
            institutionName: afterAddMasterData.name,
            institutionCode: afterAddMasterData.code,
            institutionId: afterAddMasterData.code,
            province: afterAddMasterData.province,
            city: afterAddMasterData.city,
            category: afterAddMasterData.type,
            periodId: currentData.current.periodId,
            periodName: currentData.current.periodName,
          });
        }}
        okText="??????"
        cancelText="??????"
        maskClosable={false}
      >
        <div
          style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 3 }} />
          <ExclamationCircleFilled
            twoToneColor="#FAB52B"
            style={{ fontSize: '60px', color: '#FAB52B' }}
          />
          <div style={{ flex: 3 }} />
          <h3>??????????????????????????????????????????????????????</h3>
          <div style={{ flex: 2 }} />
        </div>
      </Modal>
      <Drawer
        width={'40%'}
        destroyOnClose
        title={'??????????????????'}
        visible={addPlayNameLIstVisible}
        onClose={() => {
          form4.resetFields();
          setAddPlayNameLIstVisible(false);
          // goBackAndRefreshPage();
          loadBefore();
        }}
        maskClosable={false}
      >
        <Form
          form={form4}
          {...formLayout}
          onFinish={values => submitAddPlayNameLIst(values)}
        >
          <FormItem label="??????" name="periodName">
            <Input disabled />
          </FormItem>
          <FormItem label="????????????" name="institutionName">
            <Input disabled />
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
            <Select>
              {(accessTypePocket || []).map((res: any) => (
                <Option value={res.value}>{res.label}</Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="??????" name="remark">
            <TextArea />
          </FormItem>
          <Row>
            <Col span="3" offset="18">
              <Button
                type="default"
                onClick={() => {
                  form4.resetFields();
                  setAddPlayNameLIstVisible(false);
                }}
              >
                ??????
              </Button>
            </Col>
            <Col span="3">
              <Button type="primary" htmlType="submit" loading={buttonLoading}>
                ??????
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Modal
        title={'??????'}
        visible={mainDataInsertModalVisible}
        destroyOnClose={true}
        width={'50%'}
        maskClosable={false}
        closable={false}
        footer={[
          <Button
            type="primary"
            onClick={() => {
              setMainDataInsertModalVisible(false);
              // goBackAndRefreshPage();
              loadBefore();
            }}
          >
            ??????
          </Button>,
        ]}
      >
        <div
          style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 3 }} />
          <ExclamationCircleFilled
            twoToneColor="#FAB52B"
            style={{ fontSize: '60px', color: '#FAB52B' }}
          />
          <div style={{ flex: 3 }} />
          <h3>??????????????????DCR??????????????????????????????</h3>
          <div style={{ flex: 2 }} />
        </div>
      </Modal>
    </div>
  );
};

export default MatchModal;
