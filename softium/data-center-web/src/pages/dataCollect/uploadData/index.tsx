import styles from './index.less';
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
  Steps,
  Radio,
  Upload,
} from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { connect } from 'dva';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Authorized } from '@vulcan/utils';
import storage from '@/utils/storage';
import { history } from 'umi';
import {
  downLoadTemplate,
  uploadDataLoad,
  uploadDataSubmit,
} from '@/services/uploadData';
import transformText from '@/utils/transform';
import { downloadFile } from '@/utils/exportFile.ts';

const FormItem = Form.Item;
const { Option } = Select;
const { Step } = Steps;

const formLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 8 },
};

interface UploadDataProps {
  uploadData: any;
  dispatch: any;
  location: any;
  history: any;
}

const steps1 = [
  {
    title: '请选择数据归类',
  },
  // {
  //   title: '请选择账期归属',
  // },
  // {
  //   title: '请选择模板类型',
  // },
  {
    title: '请选择上传文件',
  },
  {
    title: '完成',
  },
];

const steps2 = [
  {
    title: '请选择数据归类',
  },
  {
    title: '请选择上传文件',
  },
  {
    title: '完成',
  },
];

const UploadData: React.FC<UploadDataProps> = props => {
  const {
    history,
    location: { state },
  } = props;
  const [formData, setFormData] = useState({
    dataType: '0',
  });
  const [form] = Form.useForm();
  const [dayOrMonth, setDayOrMonth] = useState('0');
  const [current, setCurrent] = useState(0);
  const [periodOptions, setPeriodOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [doneStatus, setDoneStatus] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [fileData, setFileData] = useState();
  const [isSeal, setIsSeal] = useState(false);
  const uploadTemplateValue = storage.get('pocketData').uploadTemplateValue;

  useEffect(() => {
    onload();
  }, []);

  const onload = async () => {
    const res = await uploadDataLoad({});
    setPeriodOptions(res.data);
    //如果是从工作台跳转过来，销售年月赋值为带过来的账期，否则为页面初始化默认账期
    if (state && state.periodId) {
      res.data.forEach((i: any) => {
        if (i.id === state.periodId) {
          form.setFieldsValue({ periodId: i.periodName });
        }
      });
      history.replace({});
    } else {
      res.data.forEach((i: any) => {
        if (i.id === storage.get('defaultPeriod')) {
          form.setFieldsValue({ periodId: i.periodName });
        }
      });
    }
    // //这里是拿默认账期的老逻辑
    // res.data.forEach((i: any) => {
    //   if (i.isDefaultPeriod) {
    //     form.setFieldsValue({ periodId: i.periodName });
    //   }
    // });
  };

  const handleSubmit = async () => {
    setSubmitStatus(true);
    const res = await form.validateFields();
    const formdata: FormData = new FormData();
    Object.entries(res).forEach(t => {
      formdata.append(t[0], t[1]);
    });
    try {
      await uploadDataSubmit(formdata);
      setDoneStatus(false);
      setSubmitStatus(false);
      message.success('保存成功');
      onload();
    } catch (e) {
      message.error('上传失败请重试！');
      setSubmitStatus(false);
      // actionRef?.current?.reload()
    }
  };

  const next = async () => {
    //因为表单提交时异步的，只有这样才能变成同步，做成单步骤的必填校验
    let status = false;
    if (current === 0) {
      await form.validateFields(['dataType']);
    }
    if (current === 1) {
      if (form.getFieldValue('dataType') === '0') {
        await form.validateFields(['periodId']);
        await form.validateFields(['template']);
        await form.validateFields(['file']);
      }

      if (form.getFieldValue('dataType') === '1') {
        await form.validateFields(['file']);
        if (
          uploadName.split('.')[1] === 'zip' ||
          uploadName.split('.')[1] === 'xlsx' ||
          uploadName.split('.')[1] === 'xls'
        ) {
          status = false;
          //点击上一步返回的时候，要可以重新上传文件
          setUploadStatus(true);
        } else {
          status = true;
        }
      }
    }
    if (current === 2) {
      await form.validateFields(['template']);
    }
    if (current === 3) {
      await form.validateFields(['file']);
      if (
        uploadName.split('.')[1] === 'zip' ||
        uploadName.split('.')[1] === 'xlsx' ||
        uploadName.split('.')[1] === 'xls'
      ) {
        status = false;
        //点击上一步返回的时候，要可以重新上传文件
        setUploadStatus(true);
      } else {
        status = true;
      }
    }

    //前端校验一下上传文件后缀名，做一下限制
    if (status) {
      setUploadStatus(false);
      message.warning('请选择.xlsx,.xls,.zip类型的文件上传');
      return;
    }
    setCurrent(current + 1);
  };

  const prev = async () => {
    setCurrent(current - 1);
    //点击上一步返回的时候，要可以重新上传文件
    if (
      (current === 2 && form.getFieldValue('dataType') === '1') ||
      current === 4
    ) {
      setUploadStatus(false);
    }
  };

  const changeDataType = (e: any) => {
    setDayOrMonth(e.target.value);
  };

  const onChangeForIsSeal = (e: any) => {
    periodOptions.forEach((i: any) => {
      if (i.periodName === e) {
        if (i.isSeal === '1') {
          setIsSeal(true);
        } else {
          setIsSeal(false);
        }
      }
    });
  };

  const actionRef = useRef<ActionType>();
  const isDay = dayOrMonth === '1';
  const isMonth = dayOrMonth === '0';
  const done1 = form.getFieldValue('dataType') === '0' && current === 4;
  const done2 = form.getFieldValue('dataType') === '1' && current === 2;
  const commonStatus = current === (isDay ? steps2 : steps1).length - 1;

  const uploadProps = {
    name: 'file',
    accept: '.zip,.xlsx,.xls',
    multiple: false,
    fileList: fileList,
    beforeUpload: (file: any) => {
      // setUploadStatus(true);
      return false;
    },
    onChange(info: any) {
      let fileList: any = [...info.fileList];
      fileList = fileList.slice(-1);
      setFileList(fileList);
      //这里因为添加和删除都会有file对象，都不会走else的内容。所以改为判断fileList长度
      if (info.fileList.length > 0) {
        setUploadName(info.file.name);
      } else {
        setUploadName('');
        form.resetFields(['file']);
      }
    },
  };
  return (
    <div className={styles.container}>
      <Row style={{}}>
        <Col offset="1">
          <Authorized code={'uploadData-downloadTemplate'}>
            <Button
              type="primary"
              onClick={() => {
                downLoadTemplate({}).then((res: any) => {
                  downloadFile(res);
                });
              }}
            >
              模板下载
            </Button>
          </Authorized>
        </Col>
      </Row>
      <Card style={{ marginTop: '20px', minHeight: '430px' }}>
        <Steps current={current}>
          {(isDay ? steps2 : steps1).map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        {doneStatus ? (
          <div className="steps-content" style={{ margin: '20px' }}>
            {/* {(isDay ? steps2 : steps1)[current].content} */}
            <Form
              form={form}
              {...formLayout}
              initialValues={formData}
              // onFinish={(values) => handleSubmit(values)}
            >
              {(current >= 0 ||
                done1 ||
                // || (current === 1 && isDay)
                done2) && (
                <FormItem
                  label="数据归类"
                  name="dataType"
                  rules={[
                    {
                      required: true,
                      message: '数据归类必填',
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e: any) => changeDataType(e)}
                    disabled={commonStatus}
                  >
                    <Radio value={'0'}>月数据</Radio>
                    {/* <Radio value={'1'}>日数据</Radio> */}
                  </Radio.Group>
                </FormItem>
              )}
              {((current >= 1 && isMonth) || done1) && (
                <FormItem
                  label="账期归属"
                  name="periodId"
                  rules={[
                    {
                      required: true,
                      message: '账期归属必填',
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
                    onChange={e => onChangeForIsSeal(e)}
                    disabled={commonStatus}
                  >
                    {(periodOptions || []).map((res: any) => (
                      <Option value={res.periodName}>{res.periodName}</Option>
                    ))}
                  </Select>
                </FormItem>
              )}
              {((current >= 1 && isMonth) || done1) && (
                <FormItem
                  label="模板类型"
                  name="template"
                  rules={[
                    {
                      required: true,
                      message: '模板类型必填',
                    },
                  ]}
                >
                  <Select disabled={commonStatus}>
                    {(uploadTemplateValue || []).map((res: any) => (
                      <Option value={res.value}>{res.label}</Option>
                    ))}
                  </Select>
                </FormItem>
              )}
              {((current >= 1 && isMonth) ||
                done1 ||
                (current === 1 && isDay) ||
                done2) && (
                <FormItem
                  label="文件名称"
                  name="file"
                  rules={[
                    {
                      required: true,
                      message: '文件必须上传',
                    },
                  ]}
                  normalize={e => {
                    return e?.file;
                  }}
                  extra="请选择.xlsx,.xls,.zip类型的文件上传"
                >
                  <Upload
                    {...uploadProps}
                    disabled={uploadStatus || isSeal || commonStatus}
                  >
                    <Input
                      // value={uploadName}
                      placeholder="请选择需要上传的文件"
                      disabled={uploadStatus || isSeal || commonStatus}
                    />
                  </Upload>
                </FormItem>
              )}
            </Form>
          </div>
        ) : (
          <div className="steps-content" style={{ margin: '20px' }}>
            <div
              style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <div style={{ flex: 5 }} />
              <CheckCircleFilled
                twoToneColor="#36C626"
                style={{ fontSize: '60px', color: '#36C626' }}
              />
              <div style={{ flex: 3 }} />
              <h3>上传完成</h3>
              <div style={{ flex: 2 }} />
              <h5>您的文件已上传完成，请查看文件</h5>
              <div style={{ flex: 2 }} />
              <Button
                type="primary"
                onClick={() => history.push(`/dataCollect/fileManagement`)}
              >
                查看文件
              </Button>
            </div>
          </div>
        )}

        {doneStatus && (
          <div
            className="steps-action"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            )}
            {current < (isDay ? steps2 : steps1).length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {current === (isDay ? steps2 : steps1).length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => handleSubmit()}
                loading={submitStatus}
              >
                导入
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default connect(({ dispatch, uploadData }: UploadDataProps) => ({
  uploadData,
  dispatch,
}))(UploadData);
