import React, { useImperativeHandle, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Upload,
  Button,
  message,
  Select,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons/lib';
import moment from 'moment';
import {
  agentContractCheck,
  agentContractInsert,
  agentContractUpdate,
} from '@/services/institution';
import _ from 'lodash';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';

const AddContract: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const [record, setRecord] = useState<any>({});
  const [agentData, setAgentData] = useState<any>({});
  const [fileList, setFileList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const toggleVisible = (bool: boolean = false) => {
    setVisible(bool);
    form.resetFields();
  };

  useImperativeHandle(props.cRef, () => ({
    data: (data: any) => {
      const { record, agentData, visible } = data;
      setAgentData(agentData);
      setRecord(record);
      toggleVisible(visible);
      if (record && record.id) {
        form.setFieldsValue({
          ...record,
          startDate: moment(record.startDate),
          endDate: moment(record.endDate),
          attachmentFileName:
            (record.attachmentFileName &&
              record.attachmentFileUrl && [
                {
                  status: 'done',
                  name: record.attachmentFileName,
                  percent: 100,
                  response: {
                    data: {
                      id: record.attachmentFileUrl,
                      fileOldName: record.attachmentFileName,
                    },
                  },
                },
              ]) ||
            [],
          attachmentFileUrl: '',
        });
      } else {
        setFileList([]);
      }
    },
  }));

  const submit = () => {
    form.validateFields().then(values => {
      values = {
        ...agentData,
        ...values,
        attachmentFileUrl:
          values?.attachmentFileName &&
          values?.attachmentFileName[0]?.response?.data?.id,
        attachmentFileName:
          values?.attachmentFileName &&
          values?.attachmentFileName[0]?.response?.data?.fileOldName,
      };
      const {
        reloadList,
        match: { params },
      } = props;
      values.startDate = moment(values.startDate).format();
      values.endDate = moment(values.endDate).format();
      setInitLoading(true);
      if (record && record.id) {
        record.createTime = new Date(record.createTime);
        record.updateTime = new Date(record.updateTime);
        agentContractUpdate({ ...record, ...values, agentId: params.id })
          .then((res: any) => {
            reloadList(res.data);
            toggleVisible(false);
          })
          .finally(() => {
            setInitLoading(false);
          });
      } else {
        agentContractInsert({ ...values, agentId: params.id })
          .then((res: any) => {
            if (res) {
              reloadList(res.data);
              toggleVisible(false);
            }
          })
          .finally(() => {
            setInitLoading(false);
            setFileList([]);
          });
      }
    });
  };

  const onchange = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(
        `${rule.field === 'name' ? '?????????????????????' : '?????????????????????'}`,
      );
    } else if (value && !record.id) {
      _.debounce(() => {
        agentContractCheck({
          [rule.field]: value,
          agentId: agentData.agentId,
        }).then((res: any) => {
          return new Promise(() => {
            if (res.data) {
              callback(
                `${
                  rule.field === 'name'
                    ? '????????????????????????'
                    : '????????????????????????'
                }`,
              );
            } else {
              callback();
            }
          });
        });
      }, 500)();
    } else {
      callback();
    }
  };

  const selectedEndDate = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback('?????????????????????');
    } else {
      const startDate: Date = form.getFieldValue('startDate');
      const startDateTime: number = moment(startDate).valueOf();
      if (!startDate) {
        callback('?????????????????????');
      } else if (startDateTime > moment(value).valueOf()) {
        callback('???????????????????????????????????????');
      } else {
        callback();
      }
    }
  };

  const selectedStartDate = (rule: any, value: any, callBack: any) => {
    const formData: any = form.getFieldsValue();
    const endDateTime: number | undefined = formData.endDate
      ? moment(formData.endDate).valueOf()
      : undefined;
    if (!value) {
      formData.endDate = undefined;
      form.setFieldsValue(formData);
      callBack('?????????????????????');
    } else if (
      endDateTime ||
      (endDateTime && moment(value).valueOf() < endDateTime)
    ) {
      form.resetFields(['endDate']);
      form.setFieldsValue(formData);
    }
    if (endDateTime && moment(value).valueOf() > endDateTime) {
      callBack('???????????????????????????????????????');
      form.setFieldsValue(formData);
    }
    callBack();
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      centered
      title={record && record.id ? '????????????' : '????????????'}
      onCancel={() => toggleVisible()}
      className="modal-width"
      onOk={() => submit()}
      visible={visible}
      confirmLoading={initLoading}
    >
      <div className="modal-height">
        <div className="agent-detail">
          <h2>{agentData.name}</h2>
          <span>{agentData.code}</span>
        </div>
        <Form form={form} style={{ marginTop: 24 }} autoComplete="off">
          <Row>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                name="name"
                label="????????????"
                rules={[
                  { required: true, message: '' },
                  { validator: onchange },
                ]}
              >
                <Input
                  allowClear={true}
                  disabled={record && record.id}
                  placeholder="?????????????????????"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                name="code"
                label="????????????"
                rules={[
                  { required: true, message: '' },
                  { validator: onchange },
                ]}
              >
                <Input
                  allowClear={true}
                  disabled={record && record.id}
                  placeholder="?????????????????????"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                name="startDate"
                label="????????????"
                rules={[
                  { required: true, message: '' },
                  { validator: selectedStartDate },
                ]}
              >
                <DatePicker
                  showTime
                  disabled={record && record.id}
                  className="date-picker100"
                  placeholder="?????????????????????"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                name="endDate"
                label="????????????"
                rules={[
                  { required: true, message: '' },
                  { validator: selectedEndDate },
                ]}
              >
                <DatePicker
                  showTime
                  disabled={record && record.id}
                  className="date-picker100"
                  placeholder="?????????????????????"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                name="salesQuotaCountType"
                label="????????????????????????"
                rules={[{ required: true, message: '?????????????????????????????????' }]}
              >
                <Select placeholder="?????????????????????????????????" allowClear>
                  {getDictionaryBySystemCode('QuotaCountType').map(
                    (item: any) => {
                      return (
                        <Select.Option value={item.value} key={item.value}>
                          {item.name}
                        </Select.Option>
                      );
                    },
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                {...formItemLayout}
                name="attachmentFileName"
                label="??????"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
              >
                <Upload
                  multiple={false}
                  name="multipartFile"
                  action={`${window.location.origin}/api/paas-file-web/fileInfo/upload?uploadType=localStorage`}
                  accept=".pdf"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>????????????</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default AddContract;
