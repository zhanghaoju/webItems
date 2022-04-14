import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  TreeSelect,
  Upload,
} from 'antd';
import { AppealDetail } from '@/pages/SalesAppeal/AppealCenter/data';
import moment from 'moment';
import { statusEnum } from './List';
import { detail } from '../api';
import { useRequest } from 'ahooks';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import {
  ChannelDwdSfInspectSaleDetail,
  ChannelSalesQuery,
} from '@/pages/SalesAppeal/Channel/data';
import { useModel } from 'umi';
import {
  TerminalDwdSfInspectSaleDetail,
  TerminalSalesQuery,
} from '@/pages/SalesAppeal/Terminal/data';
import { saleItem as channelSaleItem } from '@/pages/SalesAppeal/Channel/api';
import { saleItem as terminalSaleItem } from '@/pages/SalesAppeal/Terminal/api';
import styles from './index.less';

const DescriptionItem = Descriptions.Item;
const FormItem = Form.Item;

const FormItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

const AppealDetailComponent: React.FC<{
  match?: {
    params?: {
      id?: string;
    };
  };
}> = props => {
  const id = props?.match?.params?.id;
  const [data, setData] = useState<AppealDetail>();
  const [salesDetailVisible, setSalesDetailVisible] = useState<boolean>(false);
  const { run, loading } = useRequest(detail, {
    manual: true,
    onSuccess: (data1: any) => {
      setData(data1?.data);
      form.resetFields();
    },
  });
  const { pockets } = useModel('SalesAppeal.SalesAppealModel');
  const { regionTreeOption } = pockets || {};

  const [form] = Form.useForm();

  useEffect(() => {
    run(id || '');
  }, []);

  const showSalesDetail = () => {
    setSalesDetailVisible(true);
  };

  const channelSalesColumns: ProColumns<ChannelDwdSfInspectSaleDetail>[] = [
    {
      title: '机构所在省市',
      key: 'region',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <TreeSelect
            allowClear
            treeCheckable={true}
            style={{ width: '100%' }}
            placeholder={'请选择'}
            maxTagCount={2}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            treeData={
              regionTreeOption &&
              regionTreeOption.map(
                (t: {
                  text: any;
                  value: any;
                  children: {
                    map: (
                      arg0: (s: {
                        text: any;
                        value: any;
                      }) => { title: any; value: any },
                    ) => undefined;
                  };
                }) => {
                  const ret = {
                    title: t?.text,
                    value: t?.value,
                    children: undefined,
                  };
                  if (t?.children) {
                    ret.children = t?.children.map(
                      (s: { text: any; value: any }) => ({
                        title: s?.text,
                        value: s?.value,
                      }),
                    );
                  }
                  return ret;
                },
              )
            }
            treeDefaultExpandAll
          />
        );
      },
    },
    {
      title: '机构名称',
      dataIndex: 'institutionName',
      hideInTable: true,
    },
    {
      title: '下游机构名称',
      dataIndex: 'toInstName',
      search: false,
    },
    {
      title: '下游机构所在省市',
      dataIndex: 'region',
      search: false,
      render: (dom, entity, index, action) => {
        return `${entity?.toInstProvinceName}/${entity?.toInstCityName}`;
      },
    },
    {
      title: '销售日期',
      dataIndex: 'saleDateFormat',
      valueType: 'date',
      search: false,
    },
    {
      title: '数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'digit',
      search: false,
    },
  ];

  const terminalSalesItemColumn: ProColumns<
    TerminalDwdSfInspectSaleDetail
  >[] = [
    {
      title: '经销商',
      dataIndex: 'fromInstName',
    },
    {
      title: '销售日期',
      dataIndex: 'saleDateFormat',
      valueType: 'date',
    },
    {
      title: '数量',
      dataIndex: 'productQuantityFormat',
      valueType: 'digit',
    },
    {
      title: '单位',
      dataIndex: 'unitName',
    },
  ];

  const renderSalesDetail = () => {
    /**
     * 终端
     */
    if (data?.complaintsType === 1) {
      return (
        <ProTable<TerminalDwdSfInspectSaleDetail, TerminalSalesQuery>
          search={false}
          request={async params => {
            const res = await terminalSaleItem(params);
            return {
              data: res?.data,
            };
          }}
          params={{
            institution: data?.institutionId,
            product: data?.productId,
            complaintsReason: data?.complaintsReason,
          }}
          columns={terminalSalesItemColumn}
          options={false}
        />
      );
    }
    /**
     * 渠道
     */
    if (data?.complaintsType === 0) {
      return (
        <ProTable<ChannelDwdSfInspectSaleDetail, ChannelSalesQuery>
          search={{
            labelWidth: 'auto',
            span: 12,
          }}
          request={async params => {
            const res = await channelSaleItem(params);
            const { rows, ...others } = res?.data;
            return {
              ...others,
              data: rows,
            };
          }}
          params={{
            institution: data?.institutionId,
            product: data?.productId,
            complaintsReason: data?.complaintsReason,
          }}
          columns={channelSalesColumns}
          options={false}
        />
      );
    }

    return null;
  };

  return (
    <Card loading={loading}>
      <Modal
        onCancel={() => setSalesDetailVisible(false)}
        visible={salesDetailVisible}
        title={'流向明细'}
        footer={[
          <Button type={'primary'} onClick={() => setSalesDetailVisible(false)}>
            确认
          </Button>,
        ]}
        destroyOnClose={true}
        width={'60%'}
      >
        {renderSalesDetail()}
      </Modal>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Card type={'inner'} title={'基础信息'}>
          <Descriptions colon={true} column={3}>
            <DescriptionItem label={'申诉原因'}>
              {data?.complaintsReasonName}
            </DescriptionItem>
            <DescriptionItem label={'申诉类型'}>
              <Tag>
                {data?.complaintsTypeName === 'terminal'
                  ? '终端申诉'
                  : '渠道申诉'}
              </Tag>
            </DescriptionItem>
            <DescriptionItem
              label={
                data?.complaintsTypeName === 'terminal'
                  ? '终端名称'
                  : '渠道名称'
              }
            >
              {data?.institutionName}
            </DescriptionItem>
            <DescriptionItem label={'产品名称(规格)'}>
              {`${data?.productName}(${data?.productSpecsName} ${
                data?.manufacturer ? `,${data?.manufacturer}` : ''
              })`}
            </DescriptionItem>
            <DescriptionItem label={'单位'}>
              {data?.unitName === 'Box' ? '盒' : data?.unitName}
            </DescriptionItem>
            <DescriptionItem label={'流向数量总计'}>
              <Space>
                {data?.salesNumTotal}
                {/*<a onClick={() => showSalesDetail()}>查看明细</a>*/}
              </Space>
            </DescriptionItem>
            <DescriptionItem label={'申诉数量总计'}>
              {data?.salesComplaintsTotal}
            </DescriptionItem>
            <DescriptionItem label={'预期销量总计'}>
              {data?.salesEstimateTotal}
            </DescriptionItem>
          </Descriptions>
        </Card>
        <Card type={'inner'} title={'流向信息'}>
          {data?.salesDetails?.map((t, index) => (
            <div className={styles.formListItemContainer}>
              <Descriptions title={`流向${index + 1}`} column={3}>
                <DescriptionItem
                  label={
                    data?.complaintsTypeName === 'terminal'
                      ? '经销商'
                      : '下游机构名称'
                  }
                >
                  {t?.institutionName}
                </DescriptionItem>
                <DescriptionItem label={'销售日期'}>
                  {t?.salesDate && moment(t?.salesDate).format('YYYY-MM-DD')}
                </DescriptionItem>
                <DescriptionItem label={'申诉数量'}>
                  {t?.salesComplaintsNumb}
                </DescriptionItem>
                <DescriptionItem label={'申诉证明'} span={3}>
                  {t?.proveIds && (
                    <Upload
                      disabled={true}
                      listType={'picture-card'}
                      // @ts-ignore
                      fileList={t?.proveIds.split(',').map(t => ({
                        uid: t,
                        url: `${process.env.BASE_FILE_URL}/fileInfo/image/${t}`,
                        status: 'done',
                        name: t,
                      }))}
                    />
                  )}
                </DescriptionItem>
                <DescriptionItem label={'申诉说明'} span={3}>
                  {t?.explain}
                </DescriptionItem>
                <DescriptionItem label={'申诉人'}>
                  {data?.complaintsPersonName}
                </DescriptionItem>
                {/*<DescriptionItem label={'上级辖区'}>*/}
                {/*  {t?.complaintsPersonJurisdictionNames}*/}
                {/*</DescriptionItem>*/}
                <DescriptionItem label={'申诉时间'}>
                  {data?.complaintsDate &&
                    moment(data?.complaintsDate).format('YYYY-MM-DD HH:mm:ss')}
                </DescriptionItem>
              </Descriptions>
            </div>
          ))}
        </Card>
        <Card type={'inner'} title={'反馈信息'}>
          <Form form={form} {...FormItemLayout}>
            <Row>
              <Col span={12}>
                <FormItem
                  label={'反馈人'}
                  name={'feedbackPersonName'}
                  initialValue={data?.feedbackPersonName}
                >
                  <Input disabled={true} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label={'反馈时间'}
                  name={'feedbackName'}
                  initialValue={
                    data?.feedbackDate && moment(data?.feedbackDate)
                  }
                >
                  <DatePicker showTime={true} disabled={true} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label={'反馈状态'}
                  name={'status'}
                  initialValue={data?.status}
                >
                  <Select disabled={true}>
                    {Object.entries(statusEnum).map(t => (
                      <Select.Option value={parseInt(t[0])} key={t[0]}>
                        {t[1].text}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  label={'反馈说明'}
                  name={'feedbackExplain'}
                  initialValue={data?.feedbackExplain}
                  labelCol={{
                    span: 3,
                  }}
                  wrapperCol={{
                    span: 20,
                  }}
                >
                  <Input.TextArea disabled={true} />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </Space>
    </Card>
  );
};

export default AppealDetailComponent;
