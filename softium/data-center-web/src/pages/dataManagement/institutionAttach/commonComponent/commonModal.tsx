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
} from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getProductForAttach,
  getDictionary,
  saveAttachAdd,
  saveAttachEdit,
  attachDetail,
  institutionConfigForSearch,
  originalInstitutionSearch,
  attachedInstitutionSearch,
} from '@/services/institutionAttach';
import storage from '@/utils/storage';
import { Authorized } from '@vulcan/utils';
import styles from './index.less';
import { downloadFile } from '@/utils/exportFile.ts';
import { ExclamationCircleFilled } from '@ant-design/icons';
import Item from 'antd/lib/list/Item';

interface GithubIssueItem {
  id?: string;
  score?: number;
  code?: string;
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
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const MatchModal = (props: any) => {
  const {
    fatherCurrentData,
    openType,
    goBackAndRefreshPage,
    propsFromForm,
  } = props;
  const [buttonLoading, setButtonLoading] = useState(false);
  const [page, setPage] = useState({
    pageNum: 1,
    total: 0,
  });
  const [dataListFromAttach, setDataListFromAttach] = useState([]);
  const [dataListToAttach, setDataListToAttach] = useState([]);
  const [tabsIndex, setTabsIndex] = useState('1');
  const [falseVisible, setFalseVisible] = useState(false);
  const [dictionary, setDictionary] = useState({
    Region: [],
    City: [],
    County: [],
  });
  const [regionData, setRegionData] = useState<any>({
    province: {
      name: '',
      value: '',
    },
    city: {
      name: '',
      value: '',
    },
    county: {
      name: '',
      value: '',
    },
  });

  const [institutionPocket1, setInstitutionPocket1] = useState<any>([]);
  const [institutionPocket2, setInstitutionPocket2] = useState<any>([]);
  const [choiceInstitution1, setChoiceInstitution1] = useState<any>({});
  const [choiceInstitution2, setChoiceInstitution2] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [institutionLinks, setInstitutionLinks] = useState<any>([]);

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  useEffect(() => {
    getDictionaryFunc();
    if (openType === 2 || openType === 3) {
      loadDetail();
    }
  }, []);

  const loadDetail = async () => {
    try {
      const res = await attachDetail(fatherCurrentData);
      form2.setFieldsValue({
        institutionAttachName: res.data.institutionAttach.institutionAttachCode,
        institutionAttachCode: res.data.institutionAttach.institutionAttachCode,
        institutionAttachProvince:
          res.data.institutionAttach.institutionAttachProvince,
        institutionAttachCity: res.data.institutionAttach.institutionAttachCity,
        institutionAttachDistrict:
          res.data.institutionAttach.institutionAttachDistrict,
        institutionAttachAddress:
          res.data.institutionAttach.institutionAttachAddress,
        institutionName: res.data.institutionAttach.institutionCode,
        institutionCode: res.data.institutionAttach.institutionCode,
        institutionProvince: res.data.institutionAttach.institutionProvince,
        institutionCity: res.data.institutionAttach.institutionCity,
        institutionDistrict: res.data.institutionAttach.institutionDistrict,
        institutionAddress: res.data.institutionAttach.institutionAddress,
        remark: res.data.institutionAttach.remark,
      });
      setChoiceInstitution1({
        name: res.data.institutionAttach.institutionAttachName,
      });
      setChoiceInstitution2({
        name: res.data.institutionAttach.institutionName,
      });

      setRegionData({
        ...regionData,
        city: { name: res.data.institutionAttach.city },
        province: { name: res.data.institutionAttach.province },
      });
      // province: regionData.province.name,
      // city: regionData.city.name,
      setInstitutionPocket1([
        {
          code: res.data.institutionAttach.institutionAttachCode,
          name: res.data.institutionAttach.institutionAttachName,
        },
      ]);
      setInstitutionPocket2([
        {
          code: res.data.institutionAttach.institutionCode,
          name: res.data.institutionAttach.institutionName,
        },
      ]);
      let attachList: any = [];
      (res.data.products || []).forEach((i: any) => {
        attachList.push({
          name: i.productName,
          code: i.productCode,
          specification: i.productSpec,
          parentProductCode: i.parentProductCode,
        });
      });
      setDataListToAttach(attachList);
    } catch (error) {
      message.error('??????????????????');
    }
  };

  const getDictionaryFunc = async () => {
    try {
      let optionData: any = { ...dictionary };
      const res = await getDictionary({
        systemCodes: ['Region'],
      });
      if (res.data && res.data.list) {
        res.data.list.forEach((item: any) => {
          if (item.systemCode === 'Region') {
            optionData.Region = item.entries;
          }
        });
      }

      setDictionary(optionData);
    } catch (error) {
      message.error('??????????????????');
    }
  };

  const columns1: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'code',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '????????????',
      dataIndex: 'name',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '????????????',
      dataIndex: 'specification',
      valueType: 'text',
      width: '215px',
    },
  ];

  const columns2: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'code',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '????????????',
      dataIndex: 'name',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '????????????',
      dataIndex: 'specification',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '??????',
      dataIndex: 'action',
      render: (text: any, record: any, index: any) => (
        <div>
          <Popconfirm
            disabled={isView}
            onConfirm={() => {
              deleteProductToAttach(record, index);
            }}
            title={'??????????????????????????????'}
          >
            <Button type="link" disabled={isView}>
              ??????
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const columns3: ProColumns<GithubIssueItem>[] = [
    {
      title: '????????????',
      dataIndex: 'kind',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '????????????????????????',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: '15%',
    },
    {
      title: '??????????????????',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: '15%',
    },
    {
      title: '????????????',
      dataIndex: 'productCode',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '????????????',
      dataIndex: 'productName',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '????????????',
      dataIndex: 'productSpec',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'institutionAttachCode',
      valueType: 'text',
      width: '15%',
    },
    {
      title: '?????????????????????',
      dataIndex: 'institutionAttachName',
      valueType: 'text',
      width: '15%',
    },
  ];

  const deleteProductToAttach = (record: any, index: any) => {
    let dataDist: any = [...dataListToAttach];
    let codeDist: any = [];
    dataDist.splice(index, 1);
    dataDist.forEach((j: any) => {
      codeDist.push(j.code);
    });
    //?????????????????????????????????????????????????????????????????????????????????????????????
    setDataListToAttach(dataDist);
    setSelectedRowData(dataDist);
    setSelectedRowKeys(codeDist);
  };

  const getSearchList = async (value: any, pagination?: any) => {
    //??????????????????????????????
    let submitData: any = {
      // ...value,
      name: value.name.trim(),
      ...pagination,
    };
    const res: any = await getProductForAttach(submitData);
    setDataListFromAttach(res.data.list);
    //????????????????????????????????????
    setPage({ total: res.data.total, pageNum: res.data.pageNum });
    // setPage({total: res.data.total, pageNum: pagination.current})
  };

  const submitAttachData = async () => {
    if (dataListToAttach.length <= 0) {
      message.warning('?????????????????????????????????');
      return false;
    }
    await form2.validateFields();
    setButtonLoading(true);
    setInstitutionLinks([]);
    let products: any = [];
    dataListToAttach.forEach((i: any) => {
      products.push({
        productCode: i.code,
        productName: i.name,
        productSpec: i.specification,
        parentProductCode: i.parentCode,
      });
    });
    let submitData: any = {
      institutionAttach: {
        ...form2.getFieldsValue(),
        institutionAttachName: choiceInstitution1.name,
        institutionName: choiceInstitution2.name,
        province: regionData.province.name,
        city: regionData.city.name,
        ...propsFromForm,
      },
      products: [...products],
    };
    try {
      let res: any = {};
      if (openType === 1) {
        res = await saveAttachAdd(submitData);
      }
      if (openType === 2) {
        res = await saveAttachEdit(submitData);
      }
      if (res.data.success === false) {
        setInstitutionLinks([...res.data.institutionLinks]);
        setButtonLoading(false);
        setFalseVisible(true);
      } else {
        message.success('????????????');
        setButtonLoading(false);
        goBackAndRefreshPage();
      }
    } catch (error) {
      message.error('????????????');
      setButtonLoading(false);
    }
  };

  const getChildDictionary = async (source: any, value: any) => {
    try {
      let optionData: any = { ...dictionary };
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
      }
    } catch (error) {
      message.error('??????????????????');
    }
  };

  const handleSearch = async (e: any, source: any) => {
    let searchData = {
      name: e,
      // province: regionData.province.name,
      // city: regionData.city.name,
      // provinceId: regionData.province.value,
      // cityId: regionData.city.value,
      type: propsFromForm.kind,
    };
    // originalInstitutionSearch,
    // attachedInstitutionSearch,
    // const res = await institutionConfigForSearch(searchData);
    const res =
      source === 2
        ? await originalInstitutionSearch(searchData)
        : await attachedInstitutionSearch(searchData);
    if (source === 1) {
      setInstitutionPocket1(res.data);
    }
    if (source === 2) {
      setInstitutionPocket2(res.data);
    }
  };

  const handleChange = (e: any, source: any) => {
    if (source === 1) {
      institutionPocket1.forEach((item: any) => {
        if (e === item.code) {
          form2.setFieldsValue({
            institutionAttachCode: item.code,
            institutionAttachProvince: item.province,
            institutionAttachCity: item.city,
            institutionAttachDistrict: item.county,
            institutionAttachAddress: item.address,
            institutionAttachType: item.type,
          });
          setChoiceInstitution1(item);
        }
      });
    }
    if (source === 2) {
      institutionPocket2.forEach((item: any) => {
        if (e === item.code) {
          form2.setFieldsValue({
            institutionCode: item.code,
            institutionProvince: item.province,
            institutionCity: item.city,
            institutionDistrict: item.county,
            institutionAddress: item.address,
            institutionType: item.type,
          });
          setChoiceInstitution2(item);
        }
      });
    }
  };

  const addToAttach = () => {
    let dataDist: any = [...dataListToAttach];
    let codeDist: any = [];
    dataDist.forEach((j: any) => {
      codeDist.push(j.code);
    });
    selectedRowData.forEach((i: any) => {
      if (codeDist.indexOf(i.code) === -1) {
        dataDist.push(i);
      }
    });
    setDataListToAttach(dataDist);
    // message.success("")
  };

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
        disabled: record.isSeal === 1,
      };
    },
  };

  //????????????????????????????????????
  const isAdd = openType === 1;
  const isEdit = openType === 2;
  const isView = openType === 3;
  //??????????????????????????????????????????????????????????????????????????????
  // 2021.7.12???????????????????????????????????????
  const isShowAnother = isEdit || isView || isAdd;
  const actionRef = useRef<ActionType>();
  return (
    <div id="components-form-demo-advanced-search" className={styles.container}>
      <Card title={'????????????'}>
        <Form
          form={form2}
          {...formLayout}
          // onFinish={values => submitMasterData(values)}
        >
          <Row>
            {/*{isAdd && (*/}
            {/*  <Col span="12">*/}
            {/*    <FormItem*/}
            {/*      label="??????"*/}
            {/*      name="provinceId"*/}
            {/*      rules={[*/}
            {/*        {*/}
            {/*          required: true,*/}
            {/*          message: '????????????',*/}
            {/*        },*/}
            {/*      ]}*/}
            {/*    >*/}
            {/*      <Select*/}
            {/*        onChange={e => {*/}
            {/*          //?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/}
            {/*          form2.resetFields();*/}
            {/*          form2.setFieldsValue({ provinceId: e });*/}
            {/*          setInstitutionPocket1([]);*/}
            {/*          setInstitutionPocket2([]);*/}
            {/*          dictionary.Region.forEach((i: any) => {*/}
            {/*            if (i.value === e) {*/}
            {/*              getChildDictionary(1, i);*/}
            {/*              setRegionData({ ...regionData, province: i });*/}
            {/*            }*/}
            {/*          });*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        {(dictionary.Region || []).map((res: any) => (*/}
            {/*          <Option value={res.value}>{res.name}</Option>*/}
            {/*        ))}*/}
            {/*      </Select>*/}
            {/*    </FormItem>*/}
            {/*  </Col>*/}
            {/*)}*/}

            {/*{isAdd && !!form2.getFieldValue('provinceId') && (*/}
            {/*  <Col span="12">*/}
            {/*    <FormItem*/}
            {/*      label="??????"*/}
            {/*      name="cityId"*/}
            {/*      rules={[*/}
            {/*        {*/}
            {/*          required: true,*/}
            {/*          message: '????????????',*/}
            {/*        },*/}
            {/*      ]}*/}
            {/*    >*/}
            {/*      <Select*/}
            {/*        onChange={e => {*/}
            {/*          //??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/}
            {/*          form2.resetFields();*/}
            {/*          form2.setFieldsValue({*/}
            {/*            provinceId: regionData.province.value,*/}
            {/*            cityId: e,*/}
            {/*          });*/}
            {/*          setInstitutionPocket1([]);*/}
            {/*          setInstitutionPocket2([]);*/}
            {/*          dictionary.City.forEach((i: any) => {*/}
            {/*            if (i.value === e) {*/}
            {/*              getChildDictionary(2, i);*/}
            {/*              setRegionData({ ...regionData, city: i });*/}
            {/*            }*/}
            {/*          });*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        {(dictionary.City || []).map((res: any) => (*/}
            {/*          <Option value={res.value}>{res.name}</Option>*/}
            {/*        ))}*/}
            {/*      </Select>*/}
            {/*    </FormItem>*/}
            {/*  </Col>*/}
            {/*)}*/}
            {isShowAnother && (
              <Col span="12">
                <FormItem
                  label="?????????????????????"
                  name="institutionAttachName"
                  rules={[
                    {
                      required: true,
                      message: '???????????????????????????',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    filterOption={false}
                    disabled={isView || isEdit}
                    onSearch={e => handleSearch(e, 1)}
                    onChange={e => handleChange(e, 1)}
                  >
                    {(institutionPocket1 || []).map((res: any) => (
                      <Option value={res.code}>{res.name}</Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem
                  label="?????????????????????"
                  name="institutionAttachCode"
                  rules={[
                    {
                      required: true,
                      message: '???????????????????????????',
                    },
                  ]}
                >
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="??????" name="institutionAttachProvince">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="??????" name="institutionAttachCity">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="??????" name="institutionAttachDistrict">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="??????" name="institutionAttachAddress">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            <FormItem
              label="?????????type"
              name="institutionAttachType"
              hidden={true}
            >
              <Input disabled />
            </FormItem>
            {isShowAnother && (
              <Col span="12">
                <FormItem
                  label="????????????????????????"
                  name="institutionName"
                  rules={[
                    {
                      required: true,
                      message: '??????????????????????????????',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    filterOption={false}
                    disabled={isView || isEdit}
                    onSearch={e => handleSearch(e, 2)}
                    onChange={e => handleChange(e, 2)}
                  >
                    {(institutionPocket2 || []).map((res: any) => (
                      <Option value={res.code}>{res.name}</Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem
                  label="????????????????????????"
                  name="institutionCode"
                  rules={[
                    {
                      required: true,
                      message: '??????????????????????????????',
                    },
                  ]}
                >
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="??????" name="institutionProvince">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="??????" name="institutionCity">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="??????" name="institutionDistrict">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="??????" name="institutionAddress">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            <FormItem label="??????type" name="institutionType" hidden={true}>
              <Input disabled />
            </FormItem>
            {isShowAnother && (
              <Col span="24">
                <FormItem
                  label="??????"
                  name="remark"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  <TextArea disabled={isView || isEdit} />
                </FormItem>
              </Col>
            )}
          </Row>
        </Form>
      </Card>
      <Card title={'????????????'} style={{ marginTop: '15px' }}>
        {(isEdit || isAdd) && (
          <Form
            form={form1}
            {...formLayout}
            onFinish={values =>
              getSearchList(values, { current: 1, pageSize: 10 })
            }
          >
            <Row>
              <Col span="10">
                <FormItem
                  label="?????????"
                  name="name"
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
              <Col span="3" offset="8" style={{ textAlign: 'center' }}>
                <Button
                  type="default"
                  onClick={() => {
                    form1.resetFields();
                  }}
                >
                  ??????
                </Button>
              </Col>
              <Col span="3">
                <Button type="primary" htmlType="submit">
                  ??????
                </Button>
              </Col>
            </Row>
          </Form>
        )}
        {(isEdit || isAdd) && (
          <div className="search-result-list">
            <ProTable<GithubIssueItem, String[]>
              columns={columns1}
              rowSelection={{
                ...rowSelection,
              }}
              // tableAlertRender={false}
              tableAlertOptionRender={() => {
                return (
                  <Button type="link" onClick={() => addToAttach()}>
                    ????????????
                  </Button>
                );
              }}
              options={false}
              scroll={{ x: '100%', y: '40vh' }}
              search={false}
              actionRef={actionRef}
              pagination={false}
              // pagination={{
              //   defaultPageSize: 10,
              //   current: page.pageNum,
              //   total: page.total,
              //   showSizeChanger: false,
              //   showQuickJumper: false,
              // }}
              // onChange={(pagination: any) =>
              //   getSearchList(form1.getFieldValue('name'), {
              //     current: pagination.current,
              //     pageSize: pagination.pageSize,
              //   })
              // }
              dataSource={dataListFromAttach || []}
              rowKey="code"
              dateFormatter="string"
            />
          </div>
        )}
        <div className="search-result-list">
          <ProTable<GithubIssueItem, String[]>
            headerTitle="??????????????????"
            columns={columns2}
            options={false}
            scroll={{ x: '100%', y: '40vh' }}
            search={false}
            actionRef={actionRef}
            pagination={false}
            dataSource={dataListToAttach || []}
            rowKey="id"
            dateFormatter="string"
          />
        </div>
      </Card>
      {(isAdd || isEdit) && (
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '10px',
          }}
        >
          <Space>
            <Button type="default" onClick={() => goBackAndRefreshPage()}>
              ??????
            </Button>
            <Button
              type="primary"
              onClick={() => {
                submitAttachData();
              }}
            >
              ??????
            </Button>
          </Space>
        </Row>
      )}
      {falseVisible && institutionLinks.length > 0 && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '40%',
            height: '521px',
            zIndex: 1001,
            background: '#ffffff',
            padding: '5px',
          }}
        >
          <Card title={'??????????????????'}>
            <div className="search-result-list">
              <ProTable<GithubIssueItem, String[]>
                columns={columns3}
                options={false}
                scroll={{ x: '100%', y: '240px' }}
                search={false}
                actionRef={actionRef}
                pagination={false}
                dataSource={institutionLinks || []}
                rowKey="id"
                dateFormatter="string"
              />
            </div>
          </Card>
          <Row>
            <Col offset={20}>
              <Button
                type="primary"
                onClick={() => {
                  setFalseVisible(false);
                }}
              >
                ??????
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default MatchModal;
