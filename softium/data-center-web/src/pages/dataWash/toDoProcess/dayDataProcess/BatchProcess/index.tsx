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

import { history } from 'umi';
import { connect } from 'dva';
import storage from '@/utils/storage';
import { transformArray } from '@/utils/transform';
import { Authorized, Table } from '@vulcan/utils';
import { FormInstance } from 'antd/lib/form';
import { downloadFile } from '@/utils/exportFile';
import { withRouter } from 'react-router-dom';

interface BatchProcessProps {
  batchProcess: any;
  dispatch: any;
  location: any;
  history: any;
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
  const { history } = props;
  const businessAllTypeName = storage.get('pocketData').businessAllTypeName;
  const isModifyBatch = storage.get('pocketData').whetherNot;
  const [form] = Form.useForm();
  const [batchMdmDataSource, setBatchMdmDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [batchBtnEditDisabled, setBatchBtnEditDisabled] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>({});
  const [batchIndex, setIndex] = useState('');
  const [modifyType, setModifyType] = useState<number>();
  const [singleData, setSingleData] = useState<any>({});
  const [batchProcessModalVisible, setBatchProcessModalVisible] = useState(
    false,
  );
  const [customBatchModalVisible, setCustomBatchModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [productCodeDetail, setProductCodeDetail] = useState('');
  const [productNameDetail, setProductNameDetail] = useState('');
  const [productSpecsDetail, setProductSpecsDetail] = useState('');
  const [productFactoryDetail, setProductFactoryDetail] = useState('');
  const pageElements = storage.get('pageElements').pageElements;
  const batchProcessCode = pageElements.filter((item: any, i: any) => {
    return item.code == '002-2-1-tabE-edit';
  });

  useEffect(() => {
    ref.current?.setFieldsValue({
      businessType: 'SD',
    });
    setSearchParams({
      businessType: 'SD',
    });
    getBatchEditBtnStatus({ businessType: 'SD' });
  }, []);

  //????????????????????????????????????????????????
  const getBatchEditBtnStatus = (params: any) => {
    getBatchEditBtnQuery(params).then((res: any) => {
      if (res && res.success && res.success === true) {
        if (res.data) {
          //???true????????????false????????????
          setBatchBtnEditDisabled(false);
        } else {
          setBatchBtnEditDisabled(true);
        }
      }
    });
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '??????id',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      width: '30%',
    },
    {
      title: '????????????',
      dataIndex: 'businessType',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select placeholder="?????????" style={{ width: '100%' }}>
            {(businessAllTypeName || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '?????????????????????',
      dataIndex: 'matchStandardInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'matchStandardCustomerCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardInstitutionName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductCode',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'productBatch',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'standardProductBatch',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'isEdit',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (
          <Select allowClear placeholder="?????????" style={{ width: '100%' }}>
            {(isModifyBatch || []).map((res: any) => (
              <Option value={res.value}>{res.label}</Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '?????????????????????', //??????
      dataIndex: 'standardInstitutionName',
      valueType: 'text',
      fixed: 'left',
      hideInSearch: true,
      ellipsis: true,
      width: 200,
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardToInstitutionCode',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardToInstitutionName',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardProductCode',
      valueType: 'text',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardProductName',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardProductSpec',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '??????????????????', //??????
      dataIndex: 'standardProducer',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '????????????', //??????
      dataIndex: 'productUnitFormat',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '????????????', //??????
      dataIndex: 'productQuantityFormat',
      valueType: 'text',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '????????????', //??????
      dataIndex: 'saleDate',
      valueType: 'text',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '????????????', //??????
      dataIndex: 'productBatch',
      valueType: 'text',
      width: 100,
      fixed: 'right',
      hideInSearch: true,
    },
    {
      title: '????????????', //??????
      dataIndex: 'standardProductBatch',
      valueType: 'text',
      fixed: 'right',
      width: 140,
      hideInSearch: true,
      render: (text, record, _, index) =>
        batchProcessCode.length > 0 ? (
          <div>
            {!batchBtnEditDisabled ? (
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
              disabled={batchBtnEditDisabled}
              style={{ marginLeft: -10, padding: 'unset' }}
              onClick={() => {
                setSingleData(record);
                modifyBatchModal(record);
              }}
            >
              ??????
            </Button>
          </div>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '??????',
      hideInSearch: true,
      dataIndex: 'action',
      fixed: 'right',
      width: 70,
      render: (text, record, _, action) => [
        <Authorized code={'002-2-1-tabE-view'}>
          <a
            type="link"
            onClick={() => {
              if (record.businessType === 'SD') {
                history.push(
                  `/dataManagement/dailyDataManagement/inspectDataManagement/saleInspect/detail/${record.id}?sourceTabIndex=5&sourcePage=/toDoProcess/dayDataProcess`,
                );
              }
              if (record.businessType === 'PD') {
                history.push(
                  `/dataManagement/dailyDataManagement/inspectDataManagement/purchaseInspect/detail/${record.id}?sourceTabIndex=5&sourcePage=/toDoProcess/dayDataProcess`,
                );
              }
              if (record.businessType === 'ID') {
                history.push(
                  `/dataManagement/dailyDataManagement/inspectDataManagement/inventoryInspect/detail/${record.id}?sourceTabIndex=5&sourcePage=/toDoProcess/dayDataProcess`,
                );
              }
              if (record.businessType === 'DD') {
                history.push(
                  `/dataManagement/dailyDataManagement/inspectDataManagement/consignmentInspect/detail/${record.id}?sourceTabIndex=5&sourcePage=/toDoProcess/dayDataProcess`,
                );
              }
            }}
          >
            ??????
          </a>
        </Authorized>,
      ],
    },
  ];

  //????????????column
  const batchProcessPickColumns = [
    {
      title: '??????',
      dataIndex: 'productBatch',
      valueType: 'text',
      hideInTable: true,
      width: 180,
    },
    {
      title: '????????????',
      dataIndex: 'productDateList',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '??????',
      dataIndex: 'batchNo',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '????????????',
      dataIndex: 'productionDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '??????',
      dataIndex: 'action',
      hideInSearch: true,
      render: (text: any, record: any, index: any) => [
        <a type="link" onClick={() => chooseMdmBatchCode(record)}>
          ??????
        </a>,
      ],
    },
  ];

  //????????????????????????
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
        message.success('????????????');
      } else {
        message.warning('????????????');
      }
    });
    setDataSource(dataSource);
  };

  //?????????????????????????????????
  const getBatchMdmList = async (params: any) => {
    try {
      const res = await getBatchProcessPickList(params);
      setBatchMdmDataSource(res.data.list);
    } catch (e) {
      message.warning('?????????????????????????????????');
    }
  };

  //??????????????????
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
        disabled: record.isSeal === 1,
      };
    },
  };

  //??????????????????
  const productBatchProcess = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('????????????????????????????????????');
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
          '????????????????????????????????????????????????????????????????????????????????????',
        );
      }
    }
  };

  //?????????????????????
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

  //???????????????
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

  //?????????????????????????????????????????????????????????
  const submitBatchCodeCommonQuery = () => {
    const params = {
      businessType: searchParams.businessType,
      productBatchDTOList: modifyType === 0 ? [singleData] : selectedRowData,
    };
    modifyProductBatch(params).then((res: any) => {
      if (res && res.success === true) {
        message.success('????????????');
        actionRef?.current?.reload();
      } else {
        message.warning('????????????');
      }
    });
    setBatchProcessModalVisible(false);
  };

  //????????????
  const onReset = () => {
    setSearchParams({ businessType: 'SD' });
    ref.current?.setFieldsValue({
      businessType: 'SD',
    });
  };

  //??????
  const exportData = () => {
    setExportLoading(true);
    const params = {
      businessType: searchParams.businessType,
    };
    getProductBatchExportQuery(params).then((res: any) => {
      downloadFile(res);
      setTimeout(() => {
        setExportLoading(false);
      }, 3000);
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
              getBatchEditBtnStatus({ businessType: params.businessType });
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
            }}
            rowKey="id"
            dateFormatter="string"
            headerTitle={
              <div>
                <Space style={{ display: 'flex' }}>
                  <div style={{ height: 40, lineHeight: '40px' }}>
                    <h4>
                      ?????????????????????&nbsp;
                      <Tooltip title="??????????????????????????????">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </h4>
                  </div>
                </Space>
                <Space>
                  <Authorized code={'002-2-1-tabE-edit'}>
                    <Button
                      type="primary"
                      disabled={batchBtnEditDisabled}
                      onClick={() => productBatchProcess()}
                    >
                      ????????????
                    </Button>
                  </Authorized>
                  <Authorized code={'002-2-1-tabE-edit'}>
                    <Button
                      onClick={() => exportData()}
                      loading={exportLoading}
                    >
                      ????????????
                    </Button>
                  </Authorized>
                  <Authorized code={'002-2-1-tabE-edit'}>
                    <Button
                      disabled={batchBtnEditDisabled}
                      onClick={() =>
                        history.push(
                          `/dataWash/toDoProcess/dayDataProcess/BatchProcess/Import?businessType=${searchParams.businessType}&sourceTabIndex=5&sourcePage=/toDoProcess/dayDataProcess`,
                        )
                      }
                    >
                      ????????????
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
          title="????????????"
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
              ??????
            </Button>,
          ]}
        >
          <Card title="????????????" className={'batchProcessList-detail-card'}>
            <Descriptions column={2}>
              <Descriptions.Item label="????????????">
                {productCodeDetail}
              </Descriptions.Item>
              <Descriptions.Item label="????????????">
                {productNameDetail}
              </Descriptions.Item>
              <Descriptions.Item label="????????????">
                {productSpecsDetail}
              </Descriptions.Item>
              <Descriptions.Item label="????????????">
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
            ???????????????
          </Button>
          <ProTable
            search={{ span: 8, labelWidth: 65 }}
            columns={batchProcessPickColumns}
            formRef={normalizeBatchRef}
            pagination={false}
            options={false}
            manualRequest={true} //???????????????????????????
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
          title="????????????"
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
                setCustomBatchModalVisible(false);
              }}
            >
              ??????
            </Button>,
            <Button
              type="primary"
              htmlType="button"
              onClick={() => submitBatchModifyResult()}
            >
              ??????
            </Button>,
          ]}
          maskClosable={false}
        >
          <Form name="modifyBatch" form={form}>
            <FormItem
              label="????????????"
              name="standardBatchCode"
              rules={[
                {
                  required: true,
                  message: '??????????????????',
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
