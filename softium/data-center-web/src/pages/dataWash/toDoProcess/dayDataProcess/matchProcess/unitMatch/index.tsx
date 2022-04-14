import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  message,
  Popconfirm,
  Space,
  Modal,
  Drawer,
  Form,
  Input,
  Col,
  Row,
  InputNumber,
  Spin,
} from 'antd';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import {
  getUnitMatchList,
  exportUnMatchForDay,
  getMatchCount,
  cancelCheckForUnit,
  matchSubmitForUnit,
  getDataCleanQuery,
  getDictionary,
} from '@/services/dayMatchProcess';
import { getUntreatedPeriod, getPeriodList } from '@/services/initResource';
import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import transformText, { transformArray } from '@/utils/transform';
import { Authorized, Table } from '@vulcan/utils';
import styles from './index.less';
import { downloadFile } from '@/utils/exportFile.ts';
import MatchModal from './../commonComponent/commonModal';
import { FormInstance } from 'antd/lib/form';
import { getCleanBtnStatusQuery } from '@/services/monthDataManagement/inspectDataManagement';

interface UnitMatchProps {
  unitMatch: any;
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
const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 14 },
};

const UnitMatch: React.FC<UnitMatchProps> = props => {
  const [saleCount, setSaleCount] = useState({
    treated: '',
    untreated: '',
  });
  const [currentData, setCurrentData] = useState<any>({});
  const [manualMatchVisible, setManualMatchVisible] = useState(false);
  const [selectedRowDataKeys, setSelectedRowDataKeys] = useState<any>([]);
  const [selectedRowData, setSelectedRowData] = useState<any>([]);
  const [isBatchMatch, setIsBatchMatch] = useState(0);
  const [periodList, setPeriodList] = useState([]);
  const matchSearchType = storage.get('pocketData').matchSearchType;
  const businessAllTypeName = storage.get('pocketData').businessAllTypeName;
  const [pageVisible, setPageVisible] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<any>({});
  const [disabledForCleanBtn, setDisabledForCleanBtn] = useState(false);
  const [dictionary, setDictionary] = useState({
    Region: [],
    City: [],
  });
  const [regionData, setRegionData] = useState({
    province: [],
    city: [],
  });
  const [form] = Form.useForm();

  useEffect(() => {
    getPeriodListFunc();
    ifCleanBtnDisabled();
    getDictionaryFunc({ systemCodes: ['Region'] });
    getUntreatedPeriod().then((res: any) => {
      setPageVisible(true);
      ref.current?.setFieldsValue({
        matchBusinessType: businessAllTypeName[0].value,
        matchRinseStatus: 'FAIL',
        provinceNameList: undefined,
        cityNameList: undefined,
      });
      getSaleCount();
    });
  }, []);

  //判断全部数据清洗按钮是否置灰
  const ifCleanBtnDisabled = () => {
    getCleanBtnStatusQuery().then((res: any) => {
      if (res && res.success && res.success === true) {
        setDisabledForCleanBtn(res.data.cleanButton); //为true，置灰，false可点
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
      message.error('获取省市字典失败');
    }
  };

  const getPeriodListFunc = async () => {
    try {
      const res = await getPeriodList({});
      setPeriodList(res.data);
    } catch (e) {
      message.warning('获取账期下拉数据失败');
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
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
      title: '标准经销商名称',
      dataIndex: 'standardInstitutionName',
      valueType: 'text',
      hideInSearch: true,
      width: '13%',
      fixed: 'left',
    },
    {
      title: '标准经销商名称',
      dataIndex: 'matchStandardInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '省份',
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
            placeholder="请选择"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              //回填表单值
              ref.current?.setFieldsValue({
                provinceNameList: e,
              });
              //清空城市表单数据
              form.resetFields(['cityNameList']);
              //更正省市下拉框数据
              let optionData: any = { ...dictionary, City: [] };
              setDictionary(optionData);
              //请求所选省份下城市下拉框数据、把e的值转化为name
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
      title: '城市',
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
            placeholder="请选择"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              //把e的值转化为name
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
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInSearch: true,
      width: '13%',
      fixed: 'left',
    },
    {
      title: '标准产品编码',
      dataIndex: 'matchStandardProductCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInSearch: true,
      width: '13%',
    },
    {
      title: '标准产品名称',
      dataIndex: 'matchStandardProductName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '标准生产厂家',
      dataIndex: 'standardProducer',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '原始单位',
      dataIndex: 'productUnit',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '原始单位',
      dataIndex: 'matchProductUnit',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准单位',
      dataIndex: 'matchStandardProductUnit',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准单位',
      dataIndex: 'standardProductUnit',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '换算关系',
      dataIndex: 'relationShip',
      valueType: 'text',
      hideInSearch: true,
      width: '7%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: '11%',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      ellipsis: true,
      width: '11%',
    },
    {
      title: '状态',
      dataIndex: 'productUnitRinseStatus',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: transformArray('matchSearchType', 'label', 'value'),
      width: '7%',
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
      width: '7%',
      fixed: 'right',
      render: (text: any, record: any, index: any) => (
        <div>
          {record.productUnitRinseStatus === 'FAIL' && (
            <Authorized code={'dayUnitMatch-clean'}>
              <a
                type="link"
                onClick={() => {
                  form.resetFields();
                  setCurrentData(record);
                  setManualMatchVisible(true);
                  setIsBatchMatch(0);
                  form.setFieldsValue({
                    relationShip: record.relationShip,
                    productUnitFormat: record.standardProductUnit,
                  });
                }}
              >
                匹配
              </a>
            </Authorized>
          )}
          {record.productUnitRinseStatus === 'SUCCESS' && (
            <Authorized code={'dayUnitMatch-revert'}>
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
    setPageLoading(true);
    let submitData: any = {
      inspectSaleDTOList: [
        {
          ...record,
        },
      ],
      dataTypeDesc: 'DAY',
    };
    try {
      await cancelCheckForUnit(submitData);
      message.success('撤销匹配成功');
      actionRef?.current?.reload();
      getSaleCount();
      setSelectedRowDataKeys([]);
      setSelectedRowData([]);
    } catch (e) {
      message.error('撤销匹配失败请重试！');
    }
  };

  const getSaleCount = () => {
    getMatchCount({
      status: 'unit',
      businessType: ref.current?.getFieldValue('matchBusinessType'),
    }).then((res: any) => {
      setSaleCount(res.data);
      setPageLoading(false);
    });
  };

  //导出
  const exportUnMatchFunc = (filter: any) => {
    exportUnMatchForDay({
      statusList: 'unit',
      businessType: ref.current?.getFieldValue('matchBusinessType'),
    }).then((res: any) => {
      downloadFile(res);
    });
  };

  const submitMatch = async (values: any) => {
    if (!values.originalRatio) {
      message.warning('原始单位必填');
      return false;
    }
    if (!values.standardRatio) {
      message.warning('标准单位必填');
      return false;
    }
    setPageLoading(true);
    setButtonLoading(true);
    try {
      let submitData: any = {
        inspectSaleDTOList: [],
        productDTO: { ...values },
        dataTypeDesc: 'DAY',
      };
      //单个匹配，点击列表上的匹配
      if (isBatchMatch === 0) {
        submitData.inspectSaleDTOList = [
          {
            ...currentData,
          },
        ];
      }
      //批量匹配，点击批量匹配
      if (isBatchMatch === 1) {
        submitData.inspectSaleDTOList = selectedRowData;
      }
      const res: any = await matchSubmitForUnit(submitData);
      if (res.success) {
        setTimeout(() => {
          message.success('匹配成功');
          setManualMatchVisible(false);
          actionRef?.current?.reload();
          getSaleCount();
          setSelectedRowDataKeys([]);
          setSelectedRowData([]);
          setButtonLoading(false);
        }, 3000);
      }
    } catch (e) {
      // message.warning('匹配失败');
      setButtonLoading(false);
    }
  };

  //设置表格多选框属性
  const rowSelection = {
    selectedRowKeys: selectedRowDataKeys,
    selectedRows: selectedRowData,
    tableAlertRender: false,
    tableAlertOptionRender: false,
    onChange: (selectedRowKeys?: any, selectedRows?: any) => {
      //首次选择一个时可以任意勾选
      if (selectedRows.length <= 1) {
        setSelectedRowDataKeys(selectedRowKeys);
        setSelectedRowData(selectedRows);
      }
      //2021年3月11日修改内容：标准产品编码不作比对，只比对标准单位和原始单位相同就可
      //二次勾选时，必须选择标准产品编码和原始单位都一致的选项，不同选项给出不同提示。第二个条件为之前有选择过非全选
      if (selectedRows.length > 1 && selectedRowData.length > 0) {
        //添加标识
        let isSame = true;
        //循环判断所选项目是否有不相同的，相同的可以全选，不相同的不能全选照常提示
        selectedRows.forEach((item1: any, index1: any) => {
          for (
            let index = 0;
            index < selectedRows.length - index1 - 1;
            index++
          ) {
            if (
              // selectedRows[index1].standardProductCode !==
              //   selectedRows[index1 + index + 1].standardProductCode ||
              selectedRows[index1].standardProductUnit !==
                selectedRows[index1 + index + 1].standardProductUnit ||
              selectedRows[index1].productUnit !==
                selectedRows[index1 + index + 1].productUnit
            ) {
              isSame = false;
            }
          }
        });
        if (isSame) {
          if (
            // selectedRowData[0].standardProductCode ===
            //   selectedRows[selectedRows.length - 1].standardProductCode &&
            selectedRowData[0].standardProductUnit ===
              selectedRows[selectedRows.length - 1].standardProductUnit &&
            selectedRowData[0].productUnit ===
              selectedRows[selectedRows.length - 1].productUnit
          ) {
            setSelectedRowDataKeys(selectedRowKeys);
            setSelectedRowData(selectedRows);
          }
          if (
            // selectedRowData[0].standardProductCode ===
            //   selectedRows[selectedRows.length - 1].standardProductCode &&
            selectedRowData[0].standardProductUnit ===
              selectedRows[selectedRows.length - 1].standardProductUnit &&
            selectedRowData[0].productUnit !==
              selectedRows[selectedRows.length - 1].productUnit
          ) {
            message.warning('请选择原始单位一致的信息');
            setSelectedRowDataKeys(selectedRowDataKeys);
            setSelectedRowData(selectedRowData);
          }
          if (
            // selectedRowData[0].standardProductCode !==
            //   selectedRows[selectedRows.length - 1].standardProductCode &&
            selectedRowData[0].standardProductUnit !==
              selectedRows[selectedRows.length - 1].standardProductUnit &&
            selectedRowData[0].productUnit ===
              selectedRows[selectedRows.length - 1].productUnit
          ) {
            message.warning('请选择标准单位一致的信息');
            setSelectedRowDataKeys(selectedRowDataKeys);
            setSelectedRowData(selectedRowData);
          }
          if (
            // selectedRowData[0].standardProductCode !==
            //   selectedRows[selectedRows.length - 1].standardProductCode &&
            selectedRowData[0].standardProductUnit !==
              selectedRows[selectedRows.length - 1].standardProductUnit &&
            selectedRowData[0].productUnit !==
              selectedRows[selectedRows.length - 1].productUnit
          ) {
            message.warning('请选择标准单位和原始单位都一致的信息');
            setSelectedRowDataKeys(selectedRowDataKeys);
            setSelectedRowData(selectedRowData);
          }
        } else {
          // message.warning(
          //   '所选数据有标准产品编码和原始单位不一致的信息，请选择标准产品编码和原始单位都一致的信息',
          // );
          message.warning(
            '所选数据有标准单位和原始单位不一致的信息，请选择标准单位和原始单位都一致的信息',
          );
          setSelectedRowDataKeys(selectedRowDataKeys);
          setSelectedRowData(selectedRowData);
        }
      }
      //全选并且是首次勾选就全选，之前没有选东西的状态
      if (selectedRows.length > 1 && selectedRowData.length === 0) {
        //添加标识
        let isSame = true;
        //循环判断所选项目是否有不相同的，相同的可以全选，不相同的不能全选照常提示
        selectedRows.forEach((item1: any, index1: any) => {
          for (
            let index = 0;
            index < selectedRows.length - index1 - 1;
            index++
          ) {
            if (
              // selectedRows[index1].standardProductCode !==
              //   selectedRows[index1 + index + 1].standardProductCode ||
              selectedRows[index1].standardProductUnit !==
                selectedRows[index1 + index + 1].standardProductUnit ||
              selectedRows[index1].productUnit !==
                selectedRows[index1 + index + 1].productUnit
            ) {
              isSame = false;
            }
          }
        });
        if (isSame) {
          setSelectedRowDataKeys(selectedRowKeys);
          setSelectedRowData(selectedRows);
        } else {
          // message.warning(
          //   '所选数据有标准产品编码和原始单位不一致的信息，请选择标准产品编码和原始单位都一致的信息',
          // );
          message.warning(
            '所选数据有标准单位和原始单位不一致的信息，请选择标准单位和原始单位都一致的信息',
          );
          setSelectedRowDataKeys(selectedRowDataKeys);
          setSelectedRowData(selectedRowData);
        }
      }
    },
    getCheckboxProps: (record?: any) => {
      return {
        disabled: record.productUnitRinseStatus === 'SUCCESS',
        // ||
        // record.productUnitRinseStatus === 'SUCCESS'
      };
    },
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
      <Spin spinning={pageLoading}>
        <div className="search-result-list">
          {pageVisible && (
            <Table<GithubIssueItem>
              code="toDoProcess-day-unitMatch"
              saveSearchValue
              tableAlertRender={false}
              columns={columns}
              sticky={true}
              rowSelection={rowSelection}
              pagination={{
                defaultPageSize: 10,
                showQuickJumper: true,
              }}
              scroll={{ x: 2000 }}
              search={{
                span: 8,
                labelWidth: 160,
              }}
              actionRef={actionRef}
              formRef={ref}
              request={(params, sort, filter) => {
                return getUnitMatchList({
                  ...params,
                  ...sort,
                  ...filter,
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
              // rowKey={(record, index) => JSON.stringify(index)}
              rowKey={'id'}
              dateFormatter="string"
              onReset={() => {
                ref.current?.setFieldsValue({
                  matchBusinessType: businessAllTypeName[0].value,
                  matchRinseStatus: 'FAIL',
                });
              }}
              // params={searchParams}
              onSubmit={params => {
                setSearchParams(params);
                setPageLoading(true);
                getSaleCount();
              }}
              headerTitle={
                <div>
                  <Space style={{ display: 'flex' }}>
                    <h3>待处理：{saleCount.untreated}</h3>
                    <h3>已处理：{saleCount.treated}</h3>
                  </Space>
                  <Space>
                    <Authorized code={'dayUnitMatch-batClean'}>
                      <Button
                        type="primary"
                        onClick={() => {
                          if (selectedRowData.length > 0) {
                            setIsBatchMatch(1);
                            form.resetFields();
                            setManualMatchVisible(true);
                          } else {
                            message.warning('请选择需要匹配的信息');
                          }
                        }}
                      >
                        批量匹配
                      </Button>
                    </Authorized>
                    <Authorized code={'dayUnitMatch-export'}>
                      <Button
                        type="primary"
                        key={'export'}
                        onClick={filter => exportUnMatchFunc(filter)}
                      >
                        导出待匹配
                      </Button>
                    </Authorized>
                    <Authorized code={'dayUnitMatch-allClean'}>
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
      </Spin>
      <Modal
        title={'人工匹配'}
        visible={manualMatchVisible}
        destroyOnClose={true}
        width={'50%'}
        onCancel={() => setManualMatchVisible(false)}
        footer={null}
        maskClosable={false}
      >
        <Form
          form={form}
          {...formLayout}
          onFinish={values => submitMatch(values)}
        >
          <Row>
            <Col span={12}>
              <FormItem
                label="换算关系"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                style={{ textAlign: 'end' }}
                rules={[
                  {
                    required: true,
                    message: '换算关系必填',
                  },
                ]}
              >
                <FormItem name="originalRatio" noStyle>
                  <InputNumber min={0} />
                </FormItem>
                <span className="ant-form-text">
                  {'原始单位(' +
                    (selectedRowData.length > 0 && isBatchMatch === 1
                      ? selectedRowData[0].productUnit
                      : !!currentData && isBatchMatch === 0
                      ? currentData.productUnit
                      : '') +
                    ')='}
                </span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label=""
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 14 }}
                rules={[
                  {
                    required: true,
                    message: '标准单位(支)必填',
                  },
                ]}
              >
                <FormItem name="standardRatio" noStyle>
                  <InputNumber min={0} />
                </FormItem>
                <span className="ant-form-text">
                  {'标准单位(' +
                    (selectedRowData.length > 0 && isBatchMatch === 1
                      ? selectedRowData[0].standardProductUnit
                      : !!currentData && isBatchMatch === 0
                      ? currentData.standardProductUnit
                      : '') +
                    ')'}
                </span>
              </FormItem>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
            <Space>
              <Button
                htmlType="button"
                onClick={() => setManualMatchVisible(false)}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={buttonLoading}>
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ dispatch, unitMatch }: UnitMatchProps) => ({
  unitMatch,
  dispatch,
}))(UnitMatch);
