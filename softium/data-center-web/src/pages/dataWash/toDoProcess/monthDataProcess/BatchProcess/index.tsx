import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  message,
  Form,
  Space,
  Tooltip,
  Input,
  Typography,
  Descriptions,
  Modal,
  Card,
} from 'antd';
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  getBatchProcessList,
  getProductBatchExportQuery,
  modifyProductBatch,
  getBatchProcessPickList,
  getBatchEditBtnQuery,
} from '@/services/batchProcess/batchProcess';
import './index.less';
import { getPeriodList } from '@/services/initResource';
import { connect } from 'dva';
import _ from 'lodash';
import storage from '@/utils/storage';
import { Authorized, Table } from '@vulcan/utils';
import { FormInstance } from 'antd/lib/form';
import { downloadFile } from '@/utils/exportFile';
import { withRouter } from 'react-router-dom';
import { getDataCleanQuery } from '@/services/ruleIntercept';
import { getCleanBtnStatusQuery } from '@/services/monthDataManagement/inspectDataManagement';

interface BatchProcessProps {
  batchProcess: any;
  dispatch: any;
  history: any;
  location: any;
}

interface GithubIssueItem {
  isSeal: string;
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
  standardProductBatch?: string;
  standardProductCode?: string;
  editStatus: boolean;
}

const { Option } = Select;
const { Paragraph } = Typography;
const FormItem = Form.Item;

const batchProcess: React.FC<BatchProcessProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const businessAllTypeName = storage.get('pocketData').monthBusinessType;
  const isModifyBatch = storage.get('pocketData').whetherNot;
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [initialPeriodName, setInitialPeriodName] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>({ periodId: '' });
  const [periodList, setPeriodList] = useState([]);
  const [batchIndex, setIndex] = useState('');
  const [modifyType, setModifyType] = useState<number>();
  const [singleData, setSingleData] = useState<any>({});
  const [batchProcessModalVisible, setBatchProcessModalVisible] = useState(
    false,
  );
  const [customBatchModalVisible, setCustomBatchModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [batchMdmDataSource, setBatchMdmDataSource] = useState([]);
  const [productCodeDetail, setProductCodeDetail] = useState('');
  const [productNameDetail, setProductNameDetail] = useState('');
  const [productSpecsDetail, setProductSpecsDetail] = useState('');
  const [productFactoryDetail, setProductFactoryDetail] = useState('');
  const [disabledForIsSeal, setDisabledForIsSeal] = useState(false);
  const [archiveStatus, setaArchiveStatus] = useState('');
  const pageElements = storage.get('pageElements').pageElements;
  const batchProcessCode = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthBatchProcess-edit';
  });
  const [disabledForCleanBtn, setDisabledForCleanBtn] = useState(false);

  useEffect(() => {
    ref.current?.setFieldsValue({
      periodId: storage.get('defaultPeriod'), //设置查询条件默认账期
      businessType: 'SM', //默认数据类型
    });
    setSearchParams({
      periodId: storage.get('defaultPeriod'),
      businessType: 'SM',
    }); //设置查询参数默认账期值
    setInitialPeriodName(storage.get('defaultPeriod')); //此处设置一个默认初始值，重置后销售年月也该被赋值为默认值
    getPeriodListFunc();
  }, []);

  //获取账期下拉列表
  const getPeriodListFunc = async () => {
    try {
      const res = await getPeriodList({});
      setPeriodList(res.data);
      //在这里做页面首次load时判断账期是否已经封板
      let item: any = null;
      item = res.data.filter((i: any) => {
        return storage.get('defaultPeriod') === i.id;
      });
      setaArchiveStatus(item[0].isSeal);
      setaArchiveFunc(item[0].isSeal);
    } catch (e) {
      message.warning('获取账期下拉数据失败');
    }
  };

  //批量处理，导入，修改按钮状态获取
  // const getBatchEditBtnStatus = (params: any) => {
  //   getBatchEditBtnQuery(params).then((res: any) => {
  //     if (res && res.success && res.success === true) {
  //       if (res.data) {
  //         //为true可编辑，false不可编辑
  //         setBatchBtnEditDisabled(false);
  //       } else {
  //         setBatchBtnEditDisabled(true);
  //       }
  //     }
  //   });
  // };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '数据id',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      width: '30%',
    },
    {
      title: '销售年月',
      dataIndex: 'periodId',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
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
            placeholder="请选择"
            style={{ width: '100%' }}
            onChange={(e: any) => {
              ref.current?.setFieldsValue({
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
      title: '数据类型',
      dataIndex: 'businessType',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
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
      dataIndex: 'matchStandardInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准机构编码',
      dataIndex: 'matchStandardCustomerCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准机构名称',
      dataIndex: 'standardInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准产品编码',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准产品名称',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准产品规格',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '原始批号',
      dataIndex: 'productBatch',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标准批号',
      dataIndex: 'standardProductBatch',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '是否修改批号',
      dataIndex: 'isEdit',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {(isModifyBatch || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '标准经销商名称', //表格
      dataIndex: 'standardInstitutionName',
      valueType: 'text',
      hideInSearch: true,
      fixed: 'left',
      ellipsis: true,
      width: 200,
    },
    {
      title: '标准产品名称', //表格
      dataIndex: 'standardProductName',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '标准产品规格', //表格
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      width: 130,
      hideInSearch: true,
    },
    {
      title: '标准生产厂家', //表格
      dataIndex: 'standardProducer',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '标准产品编码', //表格
      dataIndex: 'standardProductCode',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '标准机构编码', //表格
      dataIndex: 'standardToInstitutionCode',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '标准机构名称', //表格
      dataIndex: 'standardToInstitutionName',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '标准数量', //表格
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '标准单位', //表格
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '销售日期', //表格
      dataIndex: 'saleDate',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '原始批号', //表格
      dataIndex: 'productBatch',
      valueType: 'text',
      fixed: 'right',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '标准批号', //表格
      dataIndex: 'standardProductBatch',
      valueType: 'text',
      fixed: 'right',
      width: 140,
      hideInSearch: true,
      render: (text, record, _, index) =>
        batchProcessCode.length > 0 ? (
          <div>
            {record.editStatus ? (
              <Paragraph
                className="standardBatch-change"
                editable={{
                  onChange: event => {
                    setIndex(event);
                    changeEditableStr(event, index, record);
                  },
                }}
              >
                {text}
              </Paragraph>
            ) : (
              <span style={{ display: 'inline-block', width: 90 }}>{text}</span>
            )}
            <Button
              type="link"
              style={{ marginLeft: -10, padding: 'unset' }}
              disabled={!record.editStatus}
              onClick={() => {
                setSingleData(record);
                modifyBatchModal(record);
              }}
            >
              处理
            </Button>
          </div>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '操作',
      hideInSearch: true,
      dataIndex: 'action',
      fixed: 'right',
      width: 70,
      render: (text, record, _, action) => [
        <a
          type="link"
          onClick={() => {
            if (record.businessType === 'SM') {
              history.push(
                `/dataManagement/monthlyDataManagement/inspectDataManagement/saleInspect/detail/${record.id}?sourceTabIndex=7&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
              );
            }
            if (record.businessType === 'PM') {
              history.push(
                `/dataManagement/monthlyDataManagement/inspectDataManagement/purchaseInspect/detail/${record.id}?sourceTabIndex=7&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
              );
            }
            if (record.businessType === 'IM') {
              history.push(
                `/dataManagement/monthlyDataManagement/inspectDataManagement/inventoryInspect/detail/${record.id}?sourceTabIndex=7&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
              );
            }
            if (record.businessType === 'DM') {
              history.push(
                `/dataManagement/monthlyDataManagement/inspectDataManagement/consignmentInspect/detail/${record.id}?sourceTabIndex=7&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
              );
            }
          }}
        >
          查看
        </a>,
      ],
    },
  ];

  //批号选择column
  const batchProcessPickColumns = [
    {
      title: '批号',
      dataIndex: 'productBatch',
      valueType: 'text',
      hideInTable: true,
      width: 180,
    },
    {
      title: '生产日期',
      dataIndex: 'productDateList',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '批号',
      dataIndex: 'batchNo',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '生产日期',
      dataIndex: 'productionDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      render: (text: any, record: any, index: any) => [
        <a type="link" onClick={() => chooseMdmBatchCode(record)}>
          确定
        </a>,
      ],
    },
  ];

  const setaArchiveFunc = (status: any) => {
    if (status === 'Archive') {
      setDisabledForIsSeal(true);
      setDisabledForCleanBtn(true);
    } else {
      setDisabledForIsSeal(false);
      getCleanBtnStatusQuery().then((res: any) => {
        if (res && res.success && res.success === true) {
          setDisabledForCleanBtn(res.data.cleanButton); //为true，置灰，false可点
        }
      });
    }
  };

  //修改单条标准批号
  const changeEditableStr = (event: any, index: any, record: any) => {
    dataSource.forEach((item: any, i) => {
      if (item.id === record.id) {
        item.standardProductBatch = event;
      }
    });
    const params = {
      businessType: searchParams.businessType,
      productBatchDTOList: [record],
    };
    modifyProductBatch(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('修改成功');
      } else {
        message.warning('修改成功');
      }
    });
    setDataSource(dataSource);
  };

  //主数据标准批号列表请求
  const getBatchMdmList = async (params: any) => {
    try {
      const res = await getBatchProcessPickList(params);
      setBatchMdmDataSource(res.data);
    } catch (e) {
      message.warning('获取主数据批号列表失败');
    }
  };

  //选择标准批号
  const modifyBatchModal = (record: any) => {
    setModifyType(0);
    setProductCodeDetail(record.standardProductCode);
    setProductNameDetail(record.standardProductName);
    setProductSpecsDetail(record.standardProductSpec);
    setProductFactoryDetail(record.standardProducer);
    setBatchProcessModalVisible(true);
    getBatchMdmList({ standardProductCode: record.standardProductCode });
  };

  const rowSelection = {
    tableAlertRender: false,
    tableAlertOptionRender: false,
    onChange: (selectedRowKeys?: any, selectedRows?: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRowData(selectedRows);
    },
    getCheckboxProps: (record?: any) => {
      return {
        disabled: record.editStatus === false,
      };
    },
  };

  //批量处理批号
  const productBatchProcess = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择需要批量处理的信息');
    } else {
      let productCodeArr: any[] = [];
      selectedRowData.forEach((item: any, i) => {
        productCodeArr.push(item.standardProductCode);
      });
      let newArr = productCodeArr.every(item => {
        return item == productCodeArr[0];
      });
      if (newArr) {
        setModifyType(1);
        setProductCodeDetail(selectedRowData[0]['standardProductCode']);
        setProductNameDetail(selectedRowData[0]['standardProductName']);
        setProductSpecsDetail(selectedRowData[0]['standardProductSpec']);
        setProductFactoryDetail(selectedRowData[0]['standardProducer']);
        setBatchProcessModalVisible(true);
        getBatchMdmList({
          standardProductCode: selectedRowData[0]['standardProductCode'],
        });
      } else {
        message.warning(
          '所选数据标准产品编码不一致，请选择标准产品编码一致的数据',
        );
      }
      // if (tempArr.length > 0) {
      //   return !tempArr.some((value,index)=> {
      //     return value !== tempArr[0];
      //   });
      // } else {
      //   return true;
      // }
    }
  };

  //选择主数据批号
  const chooseMdmBatchCode = (record: any) => {
    if (modifyType === 0) {
      singleData.standardProductBatch = record.batchNo;
    } else {
      selectedRowData.forEach((item: any, i) => {
        item.standardProductBatch = record.batchNo;
      });
    }
    submitBatchCodeCommonQuery();
  };

  //自定义批号
  const submitBatchModifyResult = async () => {
    const customizeStandardBatchCode = await form.validateFields();
    if (modifyType === 0) {
      singleData.standardProductBatch =
        customizeStandardBatchCode.standardBatchCode;
    } else {
      selectedRowData.forEach((item: any, i) => {
        item.standardProductBatch =
          customizeStandardBatchCode.standardBatchCode;
      });
    }
    submitBatchCodeCommonQuery();
    setCustomBatchModalVisible(false);
    form.resetFields();
  };

  //选择主数据批号和自定义批号公用提交方法
  const submitBatchCodeCommonQuery = () => {
    const params = {
      businessType: searchParams.businessType,
      productBatchDTOList: modifyType === 0 ? [singleData] : selectedRowData,
    };
    modifyProductBatch(params).then((res: any) => {
      if (res && res.success === true) {
        message.success('提交成功');
        actionRef?.current?.reload();
      } else {
        message.warning('提交失败');
      }
    });
    setBatchProcessModalVisible(false);
  };

  //重置表单
  const onReset = () => {
    setSearchParams({ periodId: initialPeriodName, businessType: 'SM' });
    ref.current?.setFieldsValue({
      periodId: initialPeriodName,
      businessType: 'SM',
    });
  };

  //导出
  const exportData = () => {
    setExportLoading(true);
    const checkedPeriodId = searchParams.periodId;
    const item: any = _.find(periodList, ['id', checkedPeriodId]) || {};
    const params = {
      periodName: item.periodName,
      periodId: searchParams.periodId,
      businessType: searchParams.businessType,
    };
    getProductBatchExportQuery(params).then((res: any) => {
      downloadFile(res);
      setTimeout(() => {
        setExportLoading(false);
      }, 3000);
    });
  };

  //全部数据清洗
  const allDataClean = () => {
    const params = { businessType: '', periodId: '' };
    params.businessType = searchParams.businessType
      ? searchParams.businessType
      : businessAllTypeName[0].value;
    params.periodId = searchParams.periodId
      ? searchParams.periodId
      : storage.get('defaultPeriod');
    setDisabledForCleanBtn(true);
    getDataCleanQuery(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('清洗成功');
      }
    });
  };

  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  const normalizeBatchRef = useRef<FormInstance>();
  return (
    <div id="components-form-demo-advanced-search">
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="dataManage-month-saleOriginal"
            saveSearchValue
            tableAlertRender={false}
            columns={columns}
            rowSelection={{
              ...rowSelection,
            }}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            search={{
              span: 8,
              labelWidth: 160,
            }}
            sticky={true}
            formRef={ref}
            actionRef={actionRef}
            onSubmit={(params: any) => {
              setSearchParams(params);
              //提交查询时设置全局按钮状态控制变量
              setaArchiveFunc(archiveStatus);
            }}
            scroll={{ x: 2500 }}
            // params={searchParams}
            request={(params, sort, filter) => {
              return getBatchProcessList({
                ...searchParams,
                ...params,
                ...sort,
                ...filter,
              });
            }}
            dataSource={dataSource}
            postData={(data: any) => {
              setDataSource(data);
              return data;
            }}
            onReset={() => {
              onReset();
              //在这里做页面重置时判断账期是否已经封板
              let item: any = periodList.filter((i: any) => {
                return storage.get('defaultPeriod') === i.id;
              });
              setaArchiveFunc(item[0].isSeal);
            }}
            rowKey="id"
            dateFormatter="string"
            headerTitle={
              <div>
                <Space style={{ display: 'flex' }}>
                  <div style={{ height: 40, lineHeight: '40px' }}>
                    <h4>
                      批号可修改条件&nbsp;
                      <Tooltip title="1.经销商和产品清洗成功 2.系统日期大于账期DDI月数据采集日期">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </h4>
                  </div>
                </Space>
                <Space>
                  <Authorized code={'monthBatchProcess-batP'}>
                    <Button
                      type="primary"
                      onClick={() => productBatchProcess()}
                    >
                      批量处理
                    </Button>
                  </Authorized>
                  <Authorized code={'monthBatchProcess-batExport'}>
                    <Button
                      onClick={() => exportData()}
                      loading={exportLoading}
                    >
                      批号导出
                    </Button>
                  </Authorized>
                  <Authorized code={'monthBatchProcess-batImport'}>
                    <Button
                      onClick={() =>
                        history.push(
                          `/dataWash/toDoProcess/monthDataProcess/BatchProcess/Import?periodId=${searchParams.periodId}&businessType=${searchParams.businessType}&sourceTabIndex=7&sourcePage=/dataWash/toDoProcess/monthDataProcess`,
                        )
                      }
                    >
                      更新批号导入
                    </Button>
                  </Authorized>
                  <Authorized code={'monthBatchProcess-allClean'}>
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
        </div>
      </div>
      <div>
        <Modal
          title="批号处理"
          width={990}
          visible={batchProcessModalVisible}
          onCancel={() => {
            setBatchProcessModalVisible(false);
            normalizeBatchRef?.current?.resetFields();
          }}
          onOk={() => setBatchProcessModalVisible(false)}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                setBatchProcessModalVisible(false);
                normalizeBatchRef?.current?.resetFields();
              }}
            >
              关闭
            </Button>,
          ]}
        >
          <Card title="基本信息" className={'batchProcessList-detail-card'}>
            <Descriptions column={2}>
              <Descriptions.Item label="产品编码">
                {productCodeDetail}
              </Descriptions.Item>
              <Descriptions.Item label="产品名称">
                {productNameDetail}
              </Descriptions.Item>
              <Descriptions.Item label="产品规格">
                {productSpecsDetail}
              </Descriptions.Item>
              <Descriptions.Item label="生产厂家">
                {productFactoryDetail}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Button
            key="submit"
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginTop: 30 }}
            onClick={() => {
              setCustomBatchModalVisible(true);
            }}
          >
            自定义批号
          </Button>
          <ProTable
            search={{ span: 8, labelWidth: 65 }}
            columns={batchProcessPickColumns}
            formRef={normalizeBatchRef}
            options={false}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            manualRequest={true} //需手动触发首次请求
            postData={(data: any) => {
              setBatchMdmDataSource(data);
              return data;
            }}
            dataSource={batchMdmDataSource}
            request={(params, sort, filter) => {
              return getBatchProcessPickList({
                standardProductCode: productCodeDetail,
                ...params,
                ...sort,
                ...filter,
              });
            }}
          />
        </Modal>
        <Modal
          title="批号处理"
          width={430}
          destroyOnClose={true}
          visible={customBatchModalVisible}
          onCancel={() => {
            form.resetFields();
            setCustomBatchModalVisible(false);
          }}
          footer={[
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setCustomBatchModalVisible(false);
              }}
            >
              取消
            </Button>,
            <Button
              type="primary"
              htmlType="button"
              onClick={() => submitBatchModifyResult()}
            >
              确认
            </Button>,
          ]}
          maskClosable={false}
        >
          <Form name="modifyBatch" form={form}>
            <FormItem
              label="标准批号"
              name="standardBatchCode"
              rules={[
                {
                  required: true,
                  message: '标准批号必填',
                },
              ]}
            >
              <Input />
            </FormItem>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default withRouter(
  connect(({ dispatch, batchProcess }: BatchProcessProps) => ({
    batchProcess,
    dispatch,
  }))(batchProcess),
);
