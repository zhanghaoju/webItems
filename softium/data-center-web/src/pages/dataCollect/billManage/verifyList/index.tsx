import React, { useState, useRef, useEffect } from 'react';
import { Authorized, Table } from '@vulcan/utils';
import {
  Button,
  Card,
  Select,
  Space,
  message,
  Modal,
  Form,
  Tooltip,
  DatePicker,
  Row,
  Col,
  Divider,
  Spin,
  Empty,
  Input,
  Popconfirm,
} from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  getVerifyPollList,
  verifyExportOperating,
  searchInstituName,
  verifyInsertName,
  downLoadTemplateQuery,
  saasInfoUserData,
  verifiOperating,
  saasInfoTaskDistribution,
} from '@/services/billManage/verifyList';
import './style/index.less';
import { history } from 'umi';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import storage from '@/utils/storage';
import { downloadFile } from '@/utils/exportFile.ts';
import transformText, { transformArray } from '@/utils/transform';
import { FormInstance } from 'antd/lib/form';
import { getFileParseResult } from '@/services/dataUploadFileManagement';
import TextArea from 'antd/lib/input/TextArea';
import Password from 'antd/lib/input/Password';
import { getDictionary } from '@/services/monthDataManagement/inspectDataManagement';

const { Option } = Select;
interface VerifyListProps {
  verifyList: any;
  dispatch: any;
  location: any;
  history: any;
}

interface GithubIssueItem {
  id?: string;
  institutionCode?: string;
  institutionName?: string;
  arriveStatusForSD?: number;
  arriveStatusForPD?: number;
  arriveStatusForID?: number;
  arriveStatusForDD?: number;
  disabled?: number;
}

const formLayout = {
  labelCol: { span: 5, offset: 2 },
  wrapperCol: { span: 14 },
};

const VerifyList: React.FC<VerifyListProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [visible, setVisible] = useState(false);
  const [personalInfoVisible, setPersonalInfoVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [optionsData, setOptionsData] = useState([]);
  const [institutionData, setInstitutionData] = useState<any>({});
  const [selectedRowDataKeys, setSelectedRowDataKeys] = useState<any>([]);
  const [selectedRowData, setSelectedRowData] = useState<any>([]);
  const [dictionary, setDictionary] = useState({
    Region: [],
    City: [],
  });
  const [regionData, setRegionData] = useState({
    city: [],
  });
  const [province, setProvince] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    getDictionaryFunc({
      systemCodes: ['Region'],
    });
  }, []);

  //????????????
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
      title: '??????id',
      dataIndex: 'id',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '????????????',
      dataIndex: 'isByMatch',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select allowClear placeholder="?????????" style={{ width: '100%' }}>
            <Option value={'SUCCESS'}>{'???'}</Option>
            <Option value={'FAIL'}>{'???'}</Option>
          </Select>
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'matchByTime',
      // valueType: `date`,
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <DatePicker
            allowClear
            placeholder="?????????"
            style={{ width: '100%' }}
            value={
              ref?.current?.getFieldValue('matchByTime')
                ? moment(ref?.current?.getFieldValue('matchByTime'))
                : null
            }
            // format={'YYYY-MM-DD'}
          ></DatePicker>
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'institutionCode',
      valueType: 'text',
      width: '10%',
      fixed: 'left',
    },
    {
      title: '????????????',
      dataIndex: 'institutionName',
      valueType: 'text',
      width: '12%',
      fixed: 'left',
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
            // value={ref?.current?.getFieldValue('provinceNameList') ? ref?.current?.getFieldValue('provinceNameList') : null}
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
      title: '??????',
      dataIndex: 'province',
      valueType: 'text',
      hideInSearch: true,
      width: '9%',
    },
    {
      title: '??????',
      dataIndex: 'city',
      valueType: 'text',
      hideInSearch: true,
      width: '9%',
    },
    {
      title: '????????????',
      dataIndex: 'isByMatch',
      valueType: 'text',
      hideInSearch: true,
      width: '6%',
      render: (text: any, record: any) => {
        if (record.isByMatch === 'SUCCESS') {
          return '???';
        }
        if (record.isByMatch === 'FAIL') {
          return '???';
        }
      },
    },
    {
      title: '????????????',
      dataIndex: 'matchByTime',
      valueType: 'text',
      hideInSearch: true,
      width: '9%',
    },
    {
      title: '??????',
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true,
      width: '9%',
    },
    {
      title: '???????????????',
      dataIndex: 'dataProcessor',
      valueType: 'text',
      hideInSearch: true,
      width: '6%',
    },
    {
      title: '?????????',
      dataIndex: 'createBy',
      valueType: 'text',
      hideInSearch: true,
      ellipsis: true,
      width: '8%',
    },
    {
      title: '????????????',
      dataIndex: 'createByTime',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '????????????',
      dataIndex: 'updateByTime',
      valueType: 'text',
      hideInSearch: true,
      width: '10%',
    },
    {
      title: '??????',
      hideInSearch: true,
      valueType: 'option',
      fixed: 'right',
      width: '10%',
      render: (text, record: any, _, action) => [
        record.isByMatch === 'FAIL' && (
          <Authorized code={'verifyList-pass'}>
            <Popconfirm
              onConfirm={() => passOrNoPassOrDelete(record, 1)}
              title={'??????????????????????????????'}
            >
              <a type="link">??????</a>
            </Popconfirm>
          </Authorized>
        ),
        record.isByMatch === 'SUCCESS' && (
          <Authorized code={'verifyList-noPass'}>
            <Popconfirm
              onConfirm={() => passOrNoPassOrDelete(record, 2)}
              title={'?????????????????????????????????'}
            >
              <a type="link">?????????</a>
            </Popconfirm>
          </Authorized>
        ),
        <Authorized code={'verifyList-delete'}>
          <Popconfirm
            onConfirm={() => passOrNoPassOrDelete(record, 0)}
            title={'??????????????????????????????'}
          >
            <a type="link">??????</a>
          </Popconfirm>
        </Authorized>,
      ],
    },
  ];

  const passOrNoPassOrDelete = (record: any, source: any) => {
    verifiOperating({
      ...record,
      operiterButton: source,
    }).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success(
          source === 0 ? '??????' : source === 1 ? '??????' : '?????????' + '??????',
        );
        actionRef?.current?.reload();
      } else {
        message.warning(
          source === 0 ? '??????' : source === 1 ? '??????' : '?????????' + '??????',
        );
      }
    });
  };

  const personalColumns: any = [
    {
      title: '??????',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '?????????',
      dataIndex: 'jobNo',
      valueType: 'text',
    },
    {
      title: '??????',
      dataIndex: 'sex',
      valueType: 'text',
      hideInSearch: true,
      render: (text: any, record: any) => {
        if (record.sex === 1) {
          return '???';
        }
        if (record.sex === 2) {
          return '???';
        }
      },
    },
    {
      title: '??????',
      dataIndex: 'email',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '??????',
      dataIndex: 'staffStatus',
      valueType: 'text',
      hideInSearch: true,
      render: (text: any, record: any) => {
        if (record.staffStatus === 0) {
          return '??????';
        }
        if (record.staffStatus === 1) {
          return '??????';
        }
      },
    },
    {
      title: '??????',
      hideInSearch: true,
      valueType: 'option',
      fixed: 'right',
      width: '10%',
      render: (text: any, record: any, _: any, action: any) => [
        <Authorized code={'verifyList-allocation'}>
          <Popconfirm
            onConfirm={() => allocation(record)}
            title={'??????????????????????????????'}
          >
            <a type="link">????????????</a>
          </Popconfirm>
        </Authorized>,
      ],
    },
  ];

  const handleOk = () => {
    form.validateFields().then(data => {
      verifyInsertName({
        ...data,
        level: institutionData.level,
        institutionName: institutionData.name,
        province: institutionData.province,
        city: institutionData.city,
        institutionData: institutionData,
      }).then((res: any) => {
        if (res && res.success && res.success === true) {
          message.success('????????????');
          actionRef?.current?.reload();
          setInstitutionData({});
          setVisible(false);
        } else {
          message.warning('????????????');
          setVisible(false);
        }
      });
    });
  };

  const handleCancel = () => {
    setInstitutionData({});
    setVisible(false);
  };

  //??????
  const billManageExport = () => {
    const params = Object.assign(searchParams, {
      // queryDate: queryDate,
      // periodId: periodId,
    });
    verifyExportOperating(params).then((res: any) => {
      downloadFile(res);
    });
  };

  //????????????
  const downLoadTemplate = () => {
    downLoadTemplateQuery().then((res: any) => {
      downloadFile(res);
    });
  };

  //??????
  const onReset = () => {
    setSearchParams({});
    setProvince([]);
    setRegionData({ city: [] });
  };

  const allocation = (record: any) => {
    saasInfoTaskDistribution({
      authorConfig: selectedRowData,
      resDTO: { ...record },
    }).then((res: any) => {
      if (res && res.success && res.success === true) {
        message.success('????????????');
        setPersonalInfoVisible(false);
        setSelectedRowDataKeys([]);
        setSelectedRowData([]);
        actionRef?.current?.reload();
      } else {
        message.warning('????????????');
      }
    });
  };

  const addFunc = () => {
    setVisible(true);
  };

  const taskAllocation = () => {
    if (selectedRowData.length > 0) {
      setPersonalInfoVisible(true);
    } else {
      message.warning('???????????????');
    }
  };

  const onChangeInstitution = (value: any) => {
    optionsData.forEach((i: any) => {
      if (i.name === value) {
        setInstitutionData(i);
        form.setFieldsValue({ institutionCode: i.code });
      }
    });
  };

  const institutionSearch = async (values: any) => {
    const res = await searchInstituName({ name: values });
    setOptionsData(res.data.list);
  };

  //???????????????????????????
  const rowSelection = {
    selectedRowKeys: selectedRowDataKeys,
    selectedRows: selectedRowData,
    tableAlertRender: false,
    tableAlertOptionRender: false,
    onChange: (selectedRowKeys?: any, selectedRows?: any) => {
      setSelectedRowDataKeys(selectedRowKeys);
      setSelectedRowData(selectedRows);
    },
    getCheckboxProps: (record?: any) => {
      return {
        // disabled: record.productUnitRinseStatus === 'SUCCESS',
      };
    },
  };

  const actionRef = useRef<ActionType>();
  const actionRef2 = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  return (
    <div id="verifyList">
      <Modal
        title="??????"
        width={'50%'}
        visible={visible}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          <Button key="back" onClick={handleCancel}>
            ??????
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            ??????
          </Button>,
        ]}
      >
        <Form form={form} {...formLayout}>
          <Form.Item
            label="????????????"
            name="institutionName"
            rules={[
              {
                required: true,
                message: '??????????????????',
              },
            ]}
          >
            <Select
              placeholder="???????????????"
              onChange={onChangeInstitution}
              onSearch={institutionSearch}
              allowClear={true}
              showSearch={true}
              filterOption={false}
            >
              {(optionsData || []).map((res: any) => (
                <Option value={res.name} key={res.code}>
                  {res.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="????????????" name="institutionCode">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            label="??????????????????"
            name="isPass"
            rules={[
              {
                required: true,
                message: '????????????????????????',
              },
            ]}
          >
            <Select placeholder="?????????">
              <Option value={'SUCCESS'}>{'???'}</Option>
              <Option value={'FAIL'}>{'???'}</Option>
            </Select>
          </Form.Item>
          <Form.Item label="??????????????????" name="passTime">
            <DatePicker placeholder="?????????"></DatePicker>
          </Form.Item>
          <Form.Item label="??????" name="remark">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <div>
        <div className="search-result-list">
          <Table<GithubIssueItem>
            code="monitorReport-verifyList"
            saveSearchValue
            columns={columns}
            bordered
            rowSelection={rowSelection}
            pagination={{
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            sticky={true}
            scroll={{ x: 1800 }}
            search={{
              span: 8,
              labelWidth: 160,
              defaultCollapsed: false,
            }}
            formRef={ref}
            actionRef={actionRef}
            onSubmit={params => {
              // setSearchParams({...params, provinceNameList: province, cityNameList: regionData.city,});
              // ref?.current?.setFieldsValue({provinceNameList: provinceCode, cityNameList: regionData.city})
            }}
            onReset={() => onReset()}
            // params={searchParams}
            request={(params, sort, filter) => {
              return getVerifyPollList({
                provinceNameList: province,
                cityNameList: regionData.city,
                ...params,
                ...sort,
                ...filter,
              }).then((response: any) => {
                return {
                  total: response.data.total,
                  data: response.data.list,
                  success: response.success,
                };
              });
            }}
            rowKey="id"
            dateFormatter="string"
            headerTitle={
              <Space>
                <Authorized code={'verifyList-add'}>
                  <Button type="primary" onClick={() => addFunc()}>
                    ??????
                  </Button>
                </Authorized>
                <Authorized code={'verifyList-import'}>
                  <Button
                    type="default"
                    onClick={() =>
                      history.push('/dataCollect/billManage/verifyList/import')
                    }
                  >
                    ??????
                  </Button>
                </Authorized>
                <Authorized code={'verifyList-export'}>
                  <Button type="default" onClick={() => billManageExport()}>
                    ??????
                  </Button>
                </Authorized>
                <Authorized code={'verifyList-download'}>
                  <Button type="default" onClick={() => downLoadTemplate()}>
                    ????????????
                  </Button>
                </Authorized>
                <Authorized code={'verifyList-taskAllocation'}>
                  <Button type="default" onClick={() => taskAllocation()}>
                    ????????????
                  </Button>
                </Authorized>
              </Space>
            }
          />
        </div>
        <Modal
          title="????????????"
          width={1000}
          visible={personalInfoVisible}
          maskClosable={false}
          destroyOnClose={true}
          onCancel={() => setPersonalInfoVisible(false)}
          onOk={() => setPersonalInfoVisible(false)}
          // footer={[
          //   <Button
          //     key="submit"
          //     type="primary"
          //     onClick={() => setPersonalInfoVisible(false)}
          //   >
          //     ??????
          //   </Button>,
          // ]}
          footer={[]}
        >
          <ProTable
            options={false}
            pagination={{ hideOnSinglePage: true }}
            columns={personalColumns}
            actionRef={actionRef2}
            request={(params, sort, filter) => {
              return saasInfoUserData({
                ...params,
                ...sort,
                ...filter,
              }).then((response: any) => {
                return {
                  total: response.data.total,
                  data: response.data.rows,
                  success: response.success,
                };
              });
            }}
            rowKey="id"
            dateFormatter="string"
            // dataSource={fileArrivalDetailData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default connect(({ dispatch, verifyList }: VerifyListProps) => ({
  verifyList,
  dispatch,
}))(VerifyList);
