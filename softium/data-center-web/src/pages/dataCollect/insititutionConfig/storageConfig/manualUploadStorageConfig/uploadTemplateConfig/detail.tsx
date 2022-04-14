import React, { useEffect, useState, useRef } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Row,
  Col,
  Card,
  InputNumber,
  Tabs,
  Tag,
  Collapse,
} from 'antd';
import { connect } from 'dva';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Authorized } from '@vulcan/utils';
import storage from '@/utils/storage';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  institutionConfigLoad,
  institutionConfigSubmit,
  specialInstitutionConfigLoad,
  institutionConfigForSearch,
} from '@/services/institutionStorageConfig';
import './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};

interface UploadTemplateConfigSettingProps {
  uploadTemplateConfigSetting: any;
  dispatch: any;
}

interface ColumnItemProps {
  id: String;
  columnTitleName: any;
  columnExcelName: any;
}

const UploadTemplateConfigSetting: React.FC<UploadTemplateConfigSettingProps> = (
  props: any,
) => {
  // const [formData, setFormData] = useState<ColumnItemProps[]>([])
  const [formData, setFormData] = useState({
    PD: { dataList: [], dataType: '' },
    ID: { dataList: [], dataType: '' },
    SD: { dataList: [], dataType: '' },
    DD: { dataList: [], dataType: '' },
  });
  const [paramsForLoad, setParamsForLoad] = useState({
    source: '',
    distributorName: '',
    distributorCode: '',
    fileName: '',
  });
  const [institutionPocket, setInstitutionPocket] = useState([]);
  const [choiceInstitutionName, setChoiceInstitutionName] = useState('');
  const [form] = Form.useForm();
  const businessTypeValue = storage.get('pocketData').businessTypeValue;
  const isView = paramsForLoad.source === '3';
  const isNotAdd = paramsForLoad.source !== '1';
  const [packUp, setPackUp] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const columns: any = (fromType: any) => {
    return [
      {
        title: 'id',
        dataIndex: 'id',
        hideInTable: true,
        hideInForm: true,
        hideInSearch: true,
      },
      {
        title: '字段名称(系统)',
        dataIndex: 'columnTitleName',
        ellipsis: true,
        width: '30%',
      },
      {
        title: '字段名称(文件)',
        dataIndex: 'columnExcelName',
        ellipsis: true,
        width: '40%',
        // render: (_:any, record:any,index:any) => <Input value={record.columnExcelName} onChange={(e) => changeInputValue(e,index,'columnExcelName', fromType)}></Input>
        // ,
        render: (
          _: any,
          record: any,
          index: any,
          dataIndex: any,
          title: any,
        ) => {
          return (
            <FormItem
              // name={record.columnExcelName}
              initialValue={record.columnExcelName}
              style={{ margin: 0 }}
              extra={
                !isView &&
                '按下回车键为添加新字段，可添加多个，重复字段会自动去重无法添加'
              }
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 20 }}
              rules={[
                {
                  required: true,
                  message: `请填写 ${record.columnTitleName}!`,
                },
              ]}
            >
              {record.columnExcelName.map((item: any) => {
                return (
                  <Tag
                    className="edit-tag"
                    style={{ marginTop: '5px' }}
                    key={item}
                    // closable={index !== 0}
                    closable={!isView}
                    onClose={(removedTag: any) => {
                      const tags = record.columnExcelName.filter(
                        (tag: any) => tag !== item,
                      );
                      changeInputValue(
                        tags,
                        index,
                        'columnExcelName',
                        fromType,
                      );
                    }}
                  >
                    {item}
                  </Tag>
                );
              })}
              {!isView && (
                <Input
                  style={{
                    marginTop: '5px',
                    // width: "50%",
                  }}
                  allowClear
                  onPressEnter={(e: any) => {
                    e.stopPropagation();
                    if (
                      record.columnExcelName.indexOf(e.target.value) === -1 &&
                      e.target.value !== ''
                    ) {
                      const tags = [...record.columnExcelName, e.target.value];
                      changeInputValue(
                        tags,
                        index,
                        'columnExcelName',
                        fromType,
                      );
                    }
                  }}
                />
              )}
            </FormItem>
          );
        },
      },
    ];
  };

  const filterOptions = (optionData: any[]): any[] => {
    return (optionData || []).map(item => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: filterOptions(item.children),
        };
      }
      const { children, ...otherOption } = item;
      return {
        ...otherOption,
      };
    });
  };

  useEffect(() => {
    const {
      distributorName,
      distributorCode,
      fileName,
      source,
    } = props.location.query;
    setParamsForLoad({ distributorName, distributorCode, fileName, source });
    onload(distributorName, distributorCode, fileName, source);
  }, []);

  const onload = async (
    distributorName: any,
    distributorCode: any,
    fileName: any,
    source: any,
  ) => {
    const res = await specialInstitutionConfigLoad({
      distributorName,
      distributorCode,
      fileName,
      type: source === '1' ? 'add' : source === '2' ? 'edit' : 'search',
    });
    setFormData(res.data);
    if (source !== '1') {
      const list: any = [
        {
          name: res.data.distributorName,
          code: res.data.distributorCode,
        },
      ];
      setInstitutionPocket(list);
    }
    form.setFieldsValue({
      //根据需求，这里先写死初始值，不让修改，disabled
      // businessValue: res.data.businessValue,
      // headerRow: res.data.headerRow,
      businessValue: source === '1' ? '0' : res.data.businessValue,
      headerRow: source === '1' ? '1' : res.data.headerRow,
      distributorCode: source === '1' ? '' : res.data.distributorCode,
      fileName: source === '1' ? '' : res.data.fileName,
      distributorName: source === '1' ? '' : res.data.distributorName,
      dataTypePD: res.data.PD && res.data.PD.dataType,
      dataTypeID: res.data.ID && res.data.ID.dataType,
      dataTypeSD: res.data.SD && res.data.SD.dataType,
      dataTypeDD: res.data.DD && res.data.DD.dataType,
    });
  };

  const handleSubmit = async () => {
    setButtonLoading(true);
    const {
      distributorName,
      distributorCode,
      fileName,
      source,
    } = props.location.query;
    form.validateFields().then(async (values: any) => {
      let emptyData: any = formData;
      emptyData.PD.dataType = values.dataTypePD
        ? values.dataTypePD
        : formData.PD.dataType;
      emptyData.ID.dataType = values.dataTypeID
        ? values.dataTypeID
        : formData.ID.dataType;
      emptyData.SD.dataType = values.dataTypeSD
        ? values.dataTypeSD
        : formData.SD.dataType;
      emptyData.DD.dataType = values.dataTypeDD
        ? values.dataTypeDD
        : formData.DD.dataType;
      let submitData: any = {
        templateTypeDTOS: [
          emptyData.PD,
          emptyData.ID,
          emptyData.SD,
          emptyData.DD,
        ],
        updateType: source === '1' ? 'add' : 'edit',
        businessValue: values.businessValue,
        headerRow: values.headerRow,
        distributorCode: values.distributorCode,
        fileName: values.fileName,
        distributorName:
          source === '1' ? choiceInstitutionName : distributorName,
      };
      try {
        const res: any = await institutionConfigSubmit(submitData);
        setButtonLoading(false);
        message.success('保存成功');
        history.back();
      } catch (e) {
        message.error('保存失败请重试！');
      }
    });
  };

  const changeInputValue = (e: any, index: any, name: any, fromType: any) => {
    console.log('fromType', fromType);
    console.log('e', e);
    console.log('index', index);
    console.log('name', name);
    let data: any = formData;
    data[fromType].dataList[index][name] = e;
    setFormData({ ...data });
  };

  const handleSearch = async (e: any) => {
    const res = await institutionConfigForSearch({ name: e });
    if (res.data && res.data.data && res.data.data.list) {
      setInstitutionPocket(res.data.data.list);
    } else {
      setInstitutionPocket([]);
    }
  };

  const handleChange = (e: any) => {
    institutionPocket.forEach((item: any) => {
      if (e === item.code) {
        form.setFieldsValue({ distributorCode: item.code });
        setChoiceInstitutionName(item.name);
      }
    });
  };

  //基本信息展开、收起
  const genExtra = () => (
    <a style={{ marginRight: '10px' }} onClick={() => handleClick()}>
      {packUp ? '收起' : '展开'}
      {packUp ? <UpOutlined /> : <DownOutlined />}
    </a>
  );

  const handleClick = () => {
    setPackUp(!packUp);
  };

  const actionRef = useRef<ActionType>();
  return (
    <div>
      <Form
        form={form}
        {...formLayout}
        // initialValues={formData}
        // onFinish={values => handleSubmit()}
      >
        <Card
          title="基本信息"
          extra={genExtra()}
          className={packUp ? 'primaryInformation' : 'primaryInformationPackUp'}
        >
          <Row
            style={{ display: packUp ? 'flex' : 'none', transition: 'all .3s' }}
          >
            <Col span="12">
              <FormItem
                label="经销商名称"
                name="distributorName"
                rules={[
                  {
                    required: true,
                    message: '经销商名称必填',
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={false}
                  disabled={isNotAdd}
                  onSearch={e => handleSearch(e)}
                  onChange={e => handleChange(e)}
                >
                  {(institutionPocket || []).map((res: any) => (
                    <Option value={res.code}>{res.name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="经销商编码"
                name="distributorCode"
                rules={[
                  {
                    required: true,
                    message: '经销商编码必填',
                  },
                ]}
              >
                <Input disabled={true} />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="文件名称"
                name="fileName"
                rules={[
                  {
                    required: true,
                    message: '文件名称必填',
                  },
                ]}
              >
                <Input disabled={isView} />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="业务类型取值方式"
                name="businessValue"
                rules={[
                  {
                    required: true,
                    message: '业务类型取值方式必填',
                  },
                ]}
              >
                <Select disabled={isView}>
                  <Option value={'0'}>从sheet名</Option>
                  {/* <Option value={"1"}>从业务类型列取值</Option> */}
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="表头所在行"
                name="headerRow"
                rules={[
                  {
                    required: true,
                    message: '表头所在行必填',
                  },
                ]}
              >
                <InputNumber disabled={isView} min={1} />
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title="列映射信息" style={{ marginTop: '12px' }}>
          <Tabs defaultActiveKey="11" type="card">
            <TabPane tab="销售" key="11">
              <Row>
                <Col span="12">
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    style={{ marginTop: '15px' }}
                    label="数据类型(文件)"
                    name="dataTypeSD"
                    rules={[
                      {
                        required: true,
                        message: '数据类型(文件)必填',
                      },
                    ]}
                  >
                    <Input disabled={isView} />
                  </FormItem>
                </Col>
              </Row>
              <div className="search-result-list">
                <ProTable<ColumnItemProps, String[]>
                  columns={columns('SD')}
                  options={false}
                  search={false}
                  actionRef={actionRef}
                  pagination={false}
                  dataSource={
                    (formData && formData.SD && formData.SD.dataList) || []
                  }
                  rowKey="key"
                  dateFormatter="string"
                />
              </div>
            </TabPane>
            <TabPane tab="采购" key="12">
              <Row>
                <Col span="12">
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    style={{ marginTop: '15px' }}
                    label="数据类型(文件)"
                    name="dataTypePD"
                    rules={[
                      {
                        required: true,
                        message: '数据类型(文件)必填',
                      },
                    ]}
                  >
                    <Input disabled={isView} />
                  </FormItem>
                </Col>
              </Row>
              <div className="search-result-list">
                <ProTable<ColumnItemProps, String[]>
                  columns={columns('PD')}
                  options={false}
                  search={false}
                  actionRef={actionRef}
                  pagination={false}
                  dataSource={
                    (formData && formData.PD && formData.PD.dataList) || []
                  }
                  rowKey="key"
                  dateFormatter="string"
                />
              </div>
            </TabPane>
            <TabPane tab="库存" key="13">
              <Row>
                <Col span="12">
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    style={{ marginTop: '15px' }}
                    label="数据类型(文件)"
                    name="dataTypeID"
                    rules={[
                      {
                        required: true,
                        message: '数据类型(文件)必填',
                      },
                    ]}
                  >
                    <Input disabled={isView} />
                  </FormItem>
                </Col>
              </Row>
              <div className="search-result-list">
                <ProTable<ColumnItemProps, String[]>
                  columns={columns('ID')}
                  options={false}
                  search={false}
                  actionRef={actionRef}
                  pagination={false}
                  dataSource={
                    (formData && formData.ID && formData.ID.dataList) || []
                  }
                  rowKey="key"
                  dateFormatter="string"
                />
              </div>
            </TabPane>
            <TabPane tab="发货" key="14">
              <Row>
                <Col span="12">
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    style={{ marginTop: '15px' }}
                    label="数据类型(文件)"
                    name="dataTypeDD"
                    rules={[
                      {
                        required: true,
                        message: '数据类型(文件)必填',
                      },
                    ]}
                  >
                    <Input disabled={isView} />
                  </FormItem>
                </Col>
              </Row>
              <div className="search-result-list">
                <ProTable<ColumnItemProps, String[]>
                  columns={columns('DD')}
                  options={false}
                  search={false}
                  actionRef={actionRef}
                  pagination={false}
                  dataSource={
                    (formData && formData.DD && formData.DD.dataList) || []
                  }
                  rowKey="key"
                  dateFormatter="string"
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
        <FormItem wrapperCol={{ span: 12, offset: 10 }}>
          <Button
            type="default"
            // htmlType="submit"
            style={{ marginTop: '20px', marginRight: '20px' }}
            onClick={() => {
              history.back();
            }}
          >
            返回
          </Button>
          {!isView && (
            <Button
              type="primary"
              loading={buttonLoading}
              style={{ marginTop: '20px' }}
              onClick={handleSubmit}
            >
              提交
            </Button>
          )}
        </FormItem>
      </Form>
    </div>
  );
};

export default connect(
  ({
    dispatch,
    uploadTemplateConfigSetting,
  }: UploadTemplateConfigSettingProps) => ({
    uploadTemplateConfigSetting,
    dispatch,
  }),
)(UploadTemplateConfigSetting);
