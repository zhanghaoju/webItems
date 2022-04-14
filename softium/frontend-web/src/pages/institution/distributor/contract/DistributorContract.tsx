import React, { useState, useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Upload,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import {
  addContract,
  getContractList,
  deleteContract,
  getDetailById,
  editContractApi,
} from '@/services/distributorContract';
import { transformToTableRequest, thousands } from '@/utils/dataConversion';
import { getDictionaryEnum } from '@/pages/institution/util';
import moment from 'moment';
import DistributorContractDetail from '@/pages/institution/distributor/contract/DistributorContractDetail';
import { Authorized } from '@vulcan/utils';

export default (props: any) => {
  const {
    params: { record },
  } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [detailData, setDetailData] = useState({});

  const actionRef = useRef<ActionType>();
  const detailRef = useRef<any>();

  const [form] = Form.useForm();

  const columns: ProColumns[] = [
    {
      title: '协议名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '协议编码',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: '协议类型',
      dataIndex: 'contractType',
      valueEnum: getDictionaryEnum('ContractType'),
      width: 100,
    },
    {
      title: '起始日期',
      dataIndex: 'startDate',
      valueType: 'date',
      width: 100,
    },
    {
      title: '终止日期',
      dataIndex: 'endDate',
      valueType: 'date',
      width: 100,
    },
    {
      title: '销售指标统计口径',
      dataIndex: 'salesQuotaCountType',
      valueEnum: getDictionaryEnum('QuotaCountType'),
      width: 150,
    },
    {
      title: '附件',
      dataIndex: 'attachmentFileName',
      width: 150,
    },
    {
      title: '总指标',
      dataIndex: 'quotaCount',
      width: 70,
      renderText: text => (text ? thousands(text) : text),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      fixed: 'right',
      render: (dom, entity, index) => [
        <a key="view" onClick={() => viewClick(entity)}>
          查看
        </a>,
        <Authorized key="edit" code="editDistributorContract">
          <a onClick={() => editContract(entity)}>编辑</a>
        </Authorized>,
        <a key="download" onClick={() => downloadContract(entity)}>
          下载协议
        </a>,
        <Authorized code="deleteDistributorContract">
          <Popconfirm
            title="确定要删除？"
            onConfirm={() => deleteContractClick(entity)}
            key="delete"
          >
            <a>删除</a>
          </Popconfirm>
        </Authorized>,
      ],
    },
  ];

  const viewClick = (record: any) => {
    setDetailData(record);
    detailRef?.current?.toggleVisible();
  };

  const editContract = async (record: any) => {
    const { data } = await getDetailById({
      id: record.id,
    });
    form.setFieldsValue({
      ...data,
      attachmentFileName:
        (data.attachmentFileName &&
          data.attachmentFileUrl && [
            {
              status: 'done',
              name: data.attachmentFileName,
              percent: 100,
              response: {
                data: {
                  id: data.attachmentFileUrl,
                  fileOldName: data.attachmentFileName,
                },
              },
            },
          ]) ||
        [],
      attachmentFileUrl: '',
      date: [moment(data.startDate), moment(data.endDate)],
    });
    setVisible(true);
  };

  const downloadContract = (record: any) => {
    if (record.attachmentFileUrl) {
      window.open(
        `${window.location.origin}/api/paas-file-web/fileInfo/download/${record.attachmentFileUrl}?fileNameType=oldName`,
      );
      return;
    }
    message.error('没有可以下载的附件');
  };

  const deleteContractClick = async (record: any) => {
    await deleteContract({
      id: record.id,
    });
    message.success('删除成功');
    actionRef.current?.reload();
  };

  const modalOnOk = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);
      const newValues = {
        ...values,
        attachmentFileUrl:
          values?.attachmentFileName &&
          values?.attachmentFileName[0]?.response?.data?.id,
        attachmentFileName:
          values?.attachmentFileName &&
          values?.attachmentFileName[0]?.response?.data?.fileOldName,
        startDate: values.date[0].format('YYYY-MM-DD'),
        endDate: values.date[1].format('YYYY-MM-DD'),
        distributorId: record.id,
        distributorCode: record.code,
      };
      if (newValues.id) {
        await editContractApi({
          ...newValues,
        });
        message.success('编辑协议成功');
      } else {
        await addContract({
          ...newValues,
        });
        message.success('添加协议成功');
      }
      setModalLoading(false);
      setVisible(false);
      actionRef.current?.reload();
      form.resetFields();
    } catch (e) {
      console.log(e);
      setModalLoading(false);
    }
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <>
      <ProTable
        form={{ autoComplete: 'off' }}
        actionRef={actionRef}
        search={false}
        options={false}
        columns={columns}
        rowKey="id"
        headerTitle={
          <Authorized code="addDistributorContract">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setVisible(true)}
            >
              添加协议
            </Button>
          </Authorized>
        }
        params={{
          distributorId: record.id,
        }}
        request={(params, sort, filter) =>
          transformToTableRequest<any>(
            {
              ...params,
              ...sort,
              ...filter,
            },
            getContractList,
          )
        }
        pagination={{
          pageSize: 10,
        }}
        sticky
        scroll={{
          x: 1500,
        }}
      />
      <Modal
        title="添加协议"
        visible={visible}
        onCancel={() => setVisible(false)}
        width="60%"
        onOk={modalOnOk}
        confirmLoading={modalLoading}
      >
        <div className="detail-header">
          <h2>{record?.name}</h2>
          <span>{record?.code}</span>
        </div>
        <Form form={form} {...formItemLayout} autoComplete="off">
          <Row>
            <Form.Item name="id" noStyle />
            <Col span={12}>
              <Form.Item
                label="协议名称"
                name="name"
                rules={[
                  {
                    required: true,
                    message: '请输入协议名称',
                  },
                ]}
              >
                <Input placeholder="请输入协议名称" autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="协议编码"
                name="code"
                rules={[
                  {
                    required: true,
                    message: '请输入协议编码',
                  },
                  {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: '协议编码仅支持英文或数字',
                  },
                ]}
              >
                <Input
                  placeholder="请输入协议编码"
                  disabled={form.getFieldValue('id')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="协议类型" name="contractType">
                <Select placeholder="请选择协议类型">
                  {getDictionaryBySystemCode('ContractType').map(
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
            <Col span={12}>
              <Form.Item
                label="协议时间"
                name="date"
                rules={[
                  {
                    required: true,
                    message: '请选择协议时间',
                  },
                  {
                    validator: (rule, value) =>
                      new Promise((resolve, reject) => {
                        if (value && value.length > 0) {
                          value[1].valueOf() <= value[0].valueOf()
                            ? reject('结束时间应大于开始时间')
                            : resolve('');
                        }
                        resolve('');
                      }),
                  },
                ]}
              >
                <DatePicker.RangePicker
                  placeholder={['请选择起始时间', '请选择终止时间']}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="销售指标统计口径"
                name="salesQuotaCountType"
                rules={[
                  {
                    required: true,
                    message: '请选择销售指标统计口径',
                  },
                ]}
              >
                <Select placeholder="请选择销售指标统计口径">
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
            <Col span={12}>
              <Form.Item
                label="附件"
                name="attachmentFileName"
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
                  <Button icon={<UploadOutlined />}>上传协议</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <DistributorContractDetail
        ref={detailRef}
        record={detailData}
        distributorId={record?.id}
        listActionRef={actionRef}
      />
    </>
  );
};
