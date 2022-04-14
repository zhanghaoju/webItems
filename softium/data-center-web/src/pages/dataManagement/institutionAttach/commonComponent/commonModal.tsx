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
      message.error('详情查询失败');
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
      message.error('获取字典失败');
    }
  };

  const columns1: ProColumns<GithubIssueItem>[] = [
    {
      title: '产品编码',
      dataIndex: 'code',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '产品规格',
      dataIndex: 'specification',
      valueType: 'text',
      width: '215px',
    },
  ];

  const columns2: ProColumns<GithubIssueItem>[] = [
    {
      title: '产品编码',
      dataIndex: 'code',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '产品规格',
      dataIndex: 'specification',
      valueType: 'text',
      width: '215px',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text: any, record: any, index: any) => (
        <div>
          <Popconfirm
            disabled={isView}
            onConfirm={() => {
              deleteProductToAttach(record, index);
            }}
            title={'确认删除该条数据吗？'}
          >
            <Button type="link" disabled={isView}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const columns3: ProColumns<GithubIssueItem>[] = [
    {
      title: '挂靠类型',
      dataIndex: 'kind',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '原始流向机构名称',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: '15%',
    },
    {
      title: '原始机构编码',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: '15%',
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      valueType: 'text',
      width: '10%',
    },
    {
      title: '挂靠后机构编码',
      dataIndex: 'institutionAttachCode',
      valueType: 'text',
      width: '15%',
    },
    {
      title: '挂靠后机构名称',
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
    //删除选中后的数据，更新列表数据，同时更新上方列表多选框选中数据
    setDataListToAttach(dataDist);
    setSelectedRowData(dataDist);
    setSelectedRowKeys(codeDist);
  };

  const getSearchList = async (value: any, pagination?: any) => {
    //抓取当前查询表单的值
    let submitData: any = {
      // ...value,
      name: value.name.trim(),
      ...pagination,
    };
    const res: any = await getProductForAttach(submitData);
    setDataListFromAttach(res.data.list);
    //等后端修改分页后，再处理
    setPage({ total: res.data.total, pageNum: res.data.pageNum });
    // setPage({total: res.data.total, pageNum: pagination.current})
  };

  const submitAttachData = async () => {
    if (dataListToAttach.length <= 0) {
      message.warning('请选择需要挂靠的产品！');
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
        message.success('保存成功');
        setButtonLoading(false);
        goBackAndRefreshPage();
      }
    } catch (error) {
      message.error('保存失败');
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
      message.error('获取字典失败');
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

  //添加、编辑、查看状态变量
  const isAdd = openType === 1;
  const isEdit = openType === 2;
  const isView = openType === 3;
  //编辑、查看、添加（省和市都选择的情况下菜显示下面的）
  // 2021.7.12号版本去除省市的选择和显示
  const isShowAnother = isEdit || isView || isAdd;
  const actionRef = useRef<ActionType>();
  return (
    <div id="components-form-demo-advanced-search" className={styles.container}>
      <Card title={'挂靠机构'}>
        <Form
          form={form2}
          {...formLayout}
          // onFinish={values => submitMasterData(values)}
        >
          <Row>
            {/*{isAdd && (*/}
            {/*  <Col span="12">*/}
            {/*    <FormItem*/}
            {/*      label="省份"*/}
            {/*      name="provinceId"*/}
            {/*      rules={[*/}
            {/*        {*/}
            {/*          required: true,*/}
            {/*          message: '省份必填',*/}
            {/*        },*/}
            {/*      ]}*/}
            {/*    >*/}
            {/*      <Select*/}
            {/*        onChange={e => {*/}
            {/*          //修改省份时，重置所有表单元素，然后设置新的所选省份，以及重置两个机构下拉框数据*/}
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
            {/*      label="城市"*/}
            {/*      name="cityId"*/}
            {/*      rules={[*/}
            {/*        {*/}
            {/*          required: true,*/}
            {/*          message: '城市必填',*/}
            {/*        },*/}
            {/*      ]}*/}
            {/*    >*/}
            {/*      <Select*/}
            {/*        onChange={e => {*/}
            {/*          //修改城市时，重置所有表单元素，然后设置新的所选省份和城市，以及重置两个机构下拉框数据*/}
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
                  label="挂靠后机构名称"
                  name="institutionAttachName"
                  rules={[
                    {
                      required: true,
                      message: '挂靠后机构名称必填',
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
                  label="挂靠后机构编码"
                  name="institutionAttachCode"
                  rules={[
                    {
                      required: true,
                      message: '挂靠后机构编码必填',
                    },
                  ]}
                >
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="省份" name="institutionAttachProvince">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="城市" name="institutionAttachCity">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="区县" name="institutionAttachDistrict">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="地址" name="institutionAttachAddress">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            <FormItem
              label="挂靠后type"
              name="institutionAttachType"
              hidden={true}
            >
              <Input disabled />
            </FormItem>
            {isShowAnother && (
              <Col span="12">
                <FormItem
                  label="原始流向机构名称"
                  name="institutionName"
                  rules={[
                    {
                      required: true,
                      message: '原始流向机构名称必填',
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
                  label="原始流向机构编码"
                  name="institutionCode"
                  rules={[
                    {
                      required: true,
                      message: '原始流向机构编码必填',
                    },
                  ]}
                >
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="省份" name="institutionProvince">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="城市" name="institutionCity">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="区县" name="institutionDistrict">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            {isShowAnother && (
              <Col span="12">
                <FormItem label="地址" name="institutionAddress">
                  <Input disabled />
                </FormItem>
              </Col>
            )}
            <FormItem label="原始type" name="institutionType" hidden={true}>
              <Input disabled />
            </FormItem>
            {isShowAnother && (
              <Col span="24">
                <FormItem
                  label="备注"
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
      <Card title={'挂靠产品'} style={{ marginTop: '15px' }}>
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
                  label="关键词"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: '关键字必填',
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
                  清空
                </Button>
              </Col>
              <Col span="3">
                <Button type="primary" htmlType="submit">
                  查询
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
                    加入挂靠
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
            headerTitle="挂靠产品展示"
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
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => {
                submitAttachData();
              }}
            >
              提交
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
          <Card title={'机构串联信息'}>
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
                确认
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default MatchModal;
