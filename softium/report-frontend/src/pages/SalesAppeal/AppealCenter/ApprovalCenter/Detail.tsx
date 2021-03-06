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
import { feedback } from './api';
import { useRequest } from 'ahooks';
import { FooterToolbar } from '@ant-design/pro-layout';
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
  const { pockets, channelPeriod, terminalPeriod } = useModel(
    'SalesAppeal.SalesAppealModel',
  );
  const { regionTreeOption } = pockets || {};

  const finalChannelTime =
    channelPeriod?.salesDataDate &&
    moment(channelPeriod?.salesDataDate).add(
      channelPeriod?.feedbackDayNumber || 0,
      'd',
    );

  const finalTerminalTime =
    channelPeriod?.salesDataDate &&
    moment(terminalPeriod?.salesDataDate).add(
      terminalPeriod?.feedbackDayNumber || 0,
      'd',
    );

  const canFeedBack: boolean =
    data?.complaintsType === 1
      ? moment().isBetween(
          channelPeriod && moment(channelPeriod?.salesDataDate),
          finalChannelTime,
        )
      : data?.complaintsType === 0
      ? moment().isBetween(
          terminalPeriod && moment(terminalPeriod?.salesDataDate),
          finalTerminalTime,
        )
      : false;

  const feedbackRequest = useRequest(feedback, {
    manual: true,
    onSuccess: data1 => {
      message.success('????????????');
      run(id || '');
    },
  });
  const [form] = Form.useForm();

  useEffect(() => {
    run(id || '');
  }, []);

  const showSalesDetail = () => {
    setSalesDetailVisible(true);
  };

  const channelSalesColumns: ProColumns<ChannelDwdSfInspectSaleDetail>[] = [
    {
      title: '??????????????????',
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
            placeholder={'?????????'}
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
      title: '????????????',
      dataIndex: 'institutionName',
      hideInTable: true,
    },
    {
      title: '??????????????????',
      dataIndex: 'toInstName',
      search: false,
    },
    {
      title: '????????????????????????',
      dataIndex: 'region',
      search: false,
      render: (dom, entity, index, action) => {
        return `${entity?.toInstProvinceName}/${entity?.toInstCityName}`;
      },
    },
    {
      title: '????????????',
      dataIndex: 'saleDateFormat',
      valueType: 'date',
      search: false,
    },
    {
      title: '??????',
      dataIndex: 'productQuantityFormat',
      valueType: 'digit',
      search: false,
    },
  ];

  const terminalSalesItemColumn: ProColumns<
    TerminalDwdSfInspectSaleDetail
  >[] = [
    {
      title: '?????????',
      dataIndex: 'fromInstName',
    },
    {
      title: '????????????',
      dataIndex: 'saleDateFormat',
      valueType: 'date',
    },
    {
      title: '??????',
      dataIndex: 'productQuantityFormat',
      valueType: 'digit',
    },
    {
      title: '??????',
      dataIndex: 'unitName',
    },
  ];

  const renderSalesDetail = () => {
    /**
     * ??????
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
     * ??????
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
        title={'????????????'}
        footer={[
          <Button type={'primary'} onClick={() => setSalesDetailVisible(false)}>
            ??????
          </Button>,
        ]}
        destroyOnClose={true}
        width={'60%'}
      >
        {renderSalesDetail()}
      </Modal>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Card type={'inner'} title={'????????????'}>
          <Descriptions colon={true} column={3}>
            <DescriptionItem label={'????????????'}>
              {data?.complaintsReasonName}
            </DescriptionItem>
            <DescriptionItem label={'????????????'}>
              <Tag>
                {data?.complaintsTypeName === 'terminal'
                  ? '????????????'
                  : '????????????'}
              </Tag>
            </DescriptionItem>
            <DescriptionItem
              label={
                data?.complaintsTypeName === 'terminal'
                  ? '????????????'
                  : '????????????'
              }
            >
              {data?.institutionName}
            </DescriptionItem>
            <DescriptionItem label={'????????????(??????)'}>
              {`${data?.productName}(${data?.productSpecsName} ${
                data?.manufacturer ? `,${data?.manufacturer}` : ''
              })`}
            </DescriptionItem>
            <DescriptionItem label={'??????'}>
              {data?.unitName === 'Box' ? '???' : data?.unitName}
            </DescriptionItem>
            <DescriptionItem label={'??????????????????'}>
              <Space>
                {data?.salesNumTotal}
                {/*<a onClick={() => showSalesDetail()}>????????????</a>*/}
              </Space>
            </DescriptionItem>
            <DescriptionItem label={'??????????????????'}>
              {data?.salesComplaintsTotal}
            </DescriptionItem>
            <DescriptionItem label={'??????????????????'}>
              {data?.salesEstimateTotal}
            </DescriptionItem>
          </Descriptions>
        </Card>
        <Card type={'inner'} title={'????????????'}>
          {data?.salesDetails?.map((t, index) => (
            <div className={styles.formListItemContainer} key={t?.id}>
              <Descriptions title={`??????${index + 1}`} column={3}>
                <DescriptionItem
                  label={
                    data?.complaintsTypeName === 'terminal'
                      ? '?????????'
                      : '??????????????????'
                  }
                >
                  {t?.institutionName}
                </DescriptionItem>
                <DescriptionItem label={'????????????'}>
                  {t?.salesDate && moment(t?.salesDate).format('YYYY-MM-DD')}
                </DescriptionItem>
                <DescriptionItem label={'????????????'}>
                  {t?.salesComplaintsNumb}
                </DescriptionItem>
                <DescriptionItem label={'????????????'} span={3}>
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
                <DescriptionItem label={'????????????'} span={3}>
                  {t?.explain}
                </DescriptionItem>
                <DescriptionItem label={'?????????'}>
                  {data?.complaintsPersonName}
                </DescriptionItem>
                {/*<DescriptionItem label={'????????????'}>*/}
                {/*  {t?.complaintsPersonJurisdictionNames}*/}
                {/*</DescriptionItem>*/}
                <DescriptionItem label={'????????????'}>
                  {data?.complaintsDate &&
                    moment(data?.complaintsDate).format('YYYY-MM-DD HH:mm:ss')}
                </DescriptionItem>
              </Descriptions>
            </div>
          ))}
        </Card>
        <Card type={'inner'} title={'????????????'}>
          <Form
            form={form}
            {...FormItemLayout}
            onFinish={value =>
              feedbackRequest.run({
                ...value,
                id,
              })
            }
          >
            <Row>
              <Col span={12}>
                <FormItem
                  label={'?????????'}
                  name={'feedbackPersonName'}
                  initialValue={data?.feedbackPersonName}
                >
                  <Input disabled={true} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label={'????????????'}
                  name={'feedbackName'}
                  initialValue={
                    data?.feedbackDate && moment(data?.feedbackDate)
                  }
                >
                  <DatePicker disabled={true} showTime={true} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label={'????????????'}
                  name={'status'}
                  initialValue={data?.status}
                >
                  <Select>
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
                  label={'????????????'}
                  name={'feedbackExplain'}
                  initialValue={data?.feedbackExplain}
                  labelCol={{
                    span: 3,
                  }}
                  wrapperCol={{
                    span: 20,
                  }}
                >
                  <Input.TextArea />
                </FormItem>
              </Col>
            </Row>
          </Form>
          {canFeedBack && (
            <FooterToolbar>
              <Button
                type="primary"
                onClick={() => form?.submit()}
                loading={feedbackRequest.loading}
              >
                ??????
              </Button>
            </FooterToolbar>
          )}
        </Card>
      </Space>
    </Card>
  );
};

export default AppealDetailComponent;
