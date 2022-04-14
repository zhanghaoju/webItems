import React, { useState } from 'react';
import {
  Button,
  Card,
  Cascader,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { FooterToolbar } from '@ant-design/pro-layout';
import { useModel, history } from 'umi';
import SearchSelect from '@/components/SearchSelect';
import { batchAdd, getSalesDetailQuery } from '../api';
import { useRequest } from 'ahooks';
import {
  transFormProductOption,
  transFormValueToAppealDetail,
  getUploadStatus,
} from '@/pages/SalesAppeal/utils';
import storage from '@/utils/storage';
import { TerminalDwdSfInspectSaleDetail } from '@/pages/SalesAppeal/Terminal/data';
import ProTable, { ProColumns } from '@ant-design/pro-table';

const FormItem = Form.Item;
const FormList = Form.List;

const FormItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};
export default (props: any) => {
  const { run, loading } = useRequest(batchAdd, {
    manual: true,
    onSuccess: (data1, params) => {
      message.success('提交成功');
      form.resetFields();
      history.goBack();
    },
  });

  /**
   * 销量总计
   */
  const getDetailSalesTotalRequest = useRequest(getSalesDetailQuery, {
    manual: true,
    onSuccess: (data, params) => {
      const namePath = params && params[0] && params[0]?.namePath;
      setSalesItemData(data?.data?.sfInspectSaleFullDimDTOS);
      if (namePath) {
        form.setFields([
          {
            name: namePath,
            value: data?.data?.salesSum || 0,
          },
        ]);
      }
    },
  });

  const [salesItemVisible, setSalesItemVisible] = useState<boolean>(false);
  const [salesItemData, setSalesItemData] = useState<
    TerminalDwdSfInspectSaleDetail[]
  >();
  const [fileList, setFileList] = useState<any>([]); // 上传图片的信息

  const windowTime = props?.location?.state?.currentWindowTime;

  const { pockets } = useModel('SalesAppeal.SalesAppealModel');
  const [form] = Form.useForm();

  const { complaintsReasonOption, productOption, productUnti } = pockets || {};
  const untiToText: any = {};
  const untiToCode: any = {};
  if (productUnti) {
    for (const item of productUnti) {
      untiToText[item.value] = item.text;
      untiToCode[item.text] = item.value;
    }
  }

  const salesItemColumn: ProColumns<TerminalDwdSfInspectSaleDetail>[] = [
    {
      title: '经销商',
      dataIndex: 'fromInstName',
    },
    {
      title: '销售日期',
      dataIndex: 'saleDate',
      render: text => {
        return (
          <span>{`${(text + '').substr(0, 4)}-${(text + '').substr(4, 2)}-${(
            text + ''
          ).substr(6, 2)}`}</span>
        );
      },
    },
    {
      title: '数量',
      dataIndex: 'prodQuantity',
      valueType: 'digit',
    },
    {
      title: '单位',
      dataIndex: 'prodUnit',
    },
  ];

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const normFile = (e: { fileList: any }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList.filter((s: { status: any }) => s.status);
  };
  const handleChange = (e: { fileList: any[] }) => {
    setFileList(e.fileList);
  };
  const userInfo = storage.get('userInfo');

  const getSalesTotal = (dataIndex: number) => {
    const { getFieldValue } = form;
    const product = getFieldValue(['data', dataIndex, 'product']);
    const institution = getFieldValue(['data', dataIndex, 'institution'])
      ?.value;
    const institutionId = institution && JSON.parse(institution)?.id;
    const complaintsReason = getFieldValue([
      'data',
      dataIndex,
      'complaintsReason',
    ])?.value;
    const prodCode = product && product[product.length - 1]?.code;
    const prodSpec = product && product[product.length - 1]?.specification;
    console.log(
      'product && product[product.length - 1]',
      product && product[product.length - 1],
    );
    const unitName = product && product[product.length - 1]?.unit;
    unitName &&
      form.setFields([
        {
          name: ['data', dataIndex, 'unitName'],
          value: untiToText[unitName],
        },
      ]);
    if (institutionId && prodCode && complaintsReason !== undefined) {
      getDetailSalesTotalRequest.run({
        periodId: windowTime,
        instId: institutionId,
        prodSpec: prodSpec,
        complaintsReason,
        prodCode: prodCode,
        namePath: ['data', dataIndex, 'salesNumTotal'],
      });
    }
  };

  return (
    <Card style={{ color: 'red' }}>
      <Modal
        title={'流向明细'}
        visible={salesItemVisible}
        destroyOnClose={true}
        onCancel={() => {
          setSalesItemVisible(false);
        }}
        width={'60%'}
        footer={[
          <Button
            key={'confirm'}
            type={'primary'}
            onClick={() => {
              setSalesItemVisible(false);
            }}
          >
            确定
          </Button>,
        ]}
      >
        <ProTable<TerminalDwdSfInspectSaleDetail>
          dataSource={salesItemData}
          columns={salesItemColumn}
          pagination={false}
          search={false}
          options={false}
        />
      </Modal>
      <Form
        form={form}
        {...FormItemLayout}
        initialValues={{
          data: [
            {
              fieldKey: 0,
              isListField: true,
              key: 0,
              name: 0,
            },
          ],
        }}
        onFinish={async value => {
          if (!getUploadStatus(fileList)) {
            message.error('申诉证明含有上传失败的文件，请重新上传');
            return;
          }
          await run(transFormValueToAppealDetail(value?.data, untiToCode));
        }}
      >
        <FormList name={'data'}>
          {(appealFields, appealOperation) => (
            <Space direction={'vertical'} style={{ width: '100%' }}>
              <div className={styles.addBtnOut}>
                <Space className={styles.inner}>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() =>
                      appealOperation.add({
                        windowTime,
                        complaintsTypeName: '终端申诉',
                        complaintsType: 1,
                      })
                    }
                    type={'primary'}
                    ghost
                  >
                    添加申诉
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => form?.submit()}
                    loading={loading}
                  >
                    提交
                  </Button>
                </Space>
              </div>
              {appealFields?.map((appealField, index) => (
                <Card
                  key={appealField.key}
                  type={'inner'}
                  title={`申诉${index + 1}`}
                  extra={
                    <Popconfirm
                      title={'您确定要删除吗？'}
                      onConfirm={() => {
                        appealOperation.remove(appealField.name);
                      }}
                    >
                      <a>
                        <DeleteOutlined />
                        删除申诉
                      </a>
                    </Popconfirm>
                  }
                >
                  <FormItem
                    initialValue={windowTime}
                    fieldKey={[appealField.fieldKey, 'windowTime']}
                    name={[appealField.name, 'windowTime']}
                    style={{ display: 'none' }}
                  >
                    <Input />
                  </FormItem>
                  <FormItem
                    fieldKey={[appealField.fieldKey, 'complaintsTypeName']}
                    name={[appealField.name, 'complaintsTypeName']}
                    style={{ display: 'none' }}
                  >
                    <Input />
                  </FormItem>
                  <FormItem
                    fieldKey={[appealField.fieldKey, 'complaintsType']}
                    name={[appealField.name, 'complaintsType']}
                    style={{ display: 'none' }}
                  >
                    <InputNumber />
                  </FormItem>
                  <Row>
                    <Col span={24}>
                      <FormItem
                        label={'申诉原因'}
                        labelCol={{
                          span: 3,
                        }}
                        wrapperCol={{
                          span: 6,
                        }}
                        fieldKey={[appealField.fieldKey, 'complaintsReason']}
                        name={[appealField.name, 'complaintsReason']}
                        rules={[
                          {
                            required: true,
                            message: '请填写申诉原因',
                          },
                        ]}
                      >
                        <Select allowClear={true} labelInValue={true}>
                          {(complaintsReasonOption || []).map(
                            (t: {
                              value: React.ReactText;
                              text: React.ReactNode;
                            }) => (
                              <Select.Option key={t?.value} value={t?.value}>
                                {t?.text}
                              </Select.Option>
                            ),
                          )}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        label={'终端名称'}
                        fieldKey={[appealField.fieldKey, 'institution']}
                        name={[appealField.name, 'institution']}
                        trigger={'onChange'}
                        rules={[
                          {
                            required: true,
                            message: '请选择或填写终端',
                          },
                        ]}
                        validateTrigger={['onSelect', 'onChange']}
                      >
                        <SearchSelect
                          form={form}
                          name={['data', appealField.name, 'institution']}
                          searchkey={'name'}
                          allowinput={true}
                          onChange={() => getSalesTotal(appealField.key)}
                          searchurl={'/options/institution-search'}
                          fieldsProps={{
                            label: 'name',
                          }}
                        />
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        label={'产品/品规'}
                        fieldKey={[appealField.fieldKey, 'product']}
                        name={[appealField.name, 'product']}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        getValueFromEvent={(value, option) => {
                          return option;
                        }}
                        getValueProps={value => {
                          return {
                            value:
                              value && value.map((t: { id: any }) => t?.id),
                          };
                        }}
                      >
                        <Cascader
                          options={transFormProductOption(productOption)}
                          onChange={() => getSalesTotal(appealField.key)}
                          showSearch
                          fieldNames={{
                            label: 'name',
                            value: 'id',
                            children: 'children',
                          }}
                        />
                      </FormItem>
                    </Col>
                    <FormItem
                      noStyle
                      shouldUpdate={(prevValues, nextValues) => {
                        const preProd =
                          prevValues['data'] &&
                          prevValues['data'][appealField.key] &&
                          prevValues['data'][appealField.key]?.product;
                        const nextProd =
                          nextValues['data'] &&
                          nextValues['data'][appealField.key] &&
                          nextValues['data'][appealField.key]?.product;
                        const preIns =
                          prevValues['data'] &&
                          prevValues['data'][appealField.key] &&
                          prevValues['data'][appealField.key]?.institution;
                        const nextIns =
                          nextValues['data'] &&
                          nextValues['data'][appealField.key] &&
                          nextValues['data'][appealField.key]?.institution;
                        const preComplaintsReason =
                          prevValues['data'] &&
                          prevValues['data'][appealField.key] &&
                          prevValues['data'][appealField.key]?.complaintsReason;
                        const nextComplaintsReason =
                          nextValues['data'] &&
                          nextValues['data'][appealField.key] &&
                          nextValues['data'][appealField.key]?.complaintsReason;

                        return (
                          (preComplaintsReason &&
                            preComplaintsReason?.value) !==
                            (nextComplaintsReason &&
                              nextComplaintsReason?.value) ||
                          (preIns && preIns?.value) !==
                            (nextIns && nextIns?.value) ||
                          (preProd &&
                            preProd[preProd.length - 1]?.id !== nextProd &&
                            nextProd[nextProd.length - 1]?.id)
                        );
                      }}
                    >
                      {({ getFieldValue }) => {
                        const product = getFieldValue([
                          'data',
                          appealField.key,
                          'product',
                        ]);
                        const institution = getFieldValue([
                          'data',
                          appealField.key,
                          'institution',
                        ])?.value;
                        const institutionId =
                          institution && JSON.parse(institution)?.id;
                        const complaintsReason = getFieldValue([
                          'data',
                          appealField.key,
                          'complaintsReason',
                        ])?.value;
                        const prodCode =
                          product && product[product.length - 1]?.code;
                        if (
                          prodCode &&
                          institutionId &&
                          complaintsReason !== undefined
                        ) {
                          return (
                            <>
                              <Col span={12}>
                                <FormItem
                                  label={'单位'}
                                  fieldKey={[appealField.fieldKey, 'unitName']}
                                  name={[appealField.name, 'unitName']}
                                >
                                  <Input disabled={true} />
                                </FormItem>
                              </Col>
                              <Col span={12}>
                                <FormItem
                                  label={'流向数量总计'}
                                  labelCol={{ span: 6 }}
                                  wrapperCol={{ span: 16 }}
                                >
                                  <FormItem
                                    noStyle
                                    fieldKey={[
                                      appealField.fieldKey,
                                      'salesNumTotal',
                                    ]}
                                    name={[appealField.name, 'salesNumTotal']}
                                  >
                                    <InputNumber
                                      disabled={true}
                                      style={{ width: '75%' }}
                                    />
                                  </FormItem>
                                  <Button
                                    type={'link'}
                                    onClick={() => {
                                      // const product = getFieldValue([
                                      //   'data',
                                      //   index,
                                      //   'product',
                                      // ]);
                                      // const institution = getFieldValue([
                                      //   'data',
                                      //   index,
                                      //   'institution',
                                      // ])?.value;
                                      // const institutionId =
                                      //   institution &&
                                      //   JSON.parse(institution)?.id;
                                      // const complaintsReason = getFieldValue([
                                      //   'data',
                                      //   index,
                                      //   'complaintsReason',
                                      // ])?.value;
                                      // const prodCode =
                                      //   product &&
                                      //   product[product.length - 1]?.code;
                                      setSalesItemVisible(true);
                                      // getSalesItemDetailRequest.run({
                                      //   institution: institutionId,
                                      //   product: prodCode,
                                      //   windowTime,
                                      //   complaintsReason,
                                      // });
                                    }}
                                  >
                                    查看明细
                                  </Button>
                                </FormItem>
                              </Col>
                              <Col span={12}>
                                <FormItem
                                  label={'申诉数量总计'}
                                  fieldKey={[
                                    appealField.fieldKey,
                                    'salesComplaintsTotal',
                                  ]}
                                  name={[
                                    appealField.name,
                                    'salesComplaintsTotal',
                                  ]}
                                >
                                  <InputNumber
                                    disabled={true}
                                    style={{ width: '100%' }}
                                  />
                                </FormItem>
                              </Col>

                              <Col span={12}>
                                <FormItem
                                  label={'预计销量总计'}
                                  fieldKey={[
                                    appealField.fieldKey,
                                    'salesEstimateTotal',
                                  ]}
                                  name={[
                                    appealField.name,
                                    'salesEstimateTotal',
                                  ]}
                                >
                                  <InputNumber
                                    disabled={true}
                                    style={{ width: '100%' }}
                                  />
                                </FormItem>
                              </Col>
                            </>
                          );
                        }
                        return (
                          <>
                            <Col span={12}>
                              <FormItem
                                label={'单位'}
                                fieldKey={[appealField.fieldKey, 'unitName']}
                                name={[appealField.name, 'unitName']}
                              >
                                <Input disabled={true} />
                              </FormItem>
                            </Col>
                            <Col span={12}>
                              <FormItem
                                label={'申诉数量总计'}
                                fieldKey={[
                                  appealField.fieldKey,
                                  'salesComplaintsTotal',
                                ]}
                                name={[
                                  appealField.name,
                                  'salesComplaintsTotal',
                                ]}
                              >
                                <InputNumber
                                  disabled={true}
                                  style={{ width: '100%' }}
                                />
                              </FormItem>
                            </Col>
                          </>
                        );
                      }}
                    </FormItem>
                  </Row>

                  <FormList name={[appealField.name, 'salesDetails']}>
                    {(salesDetailFields, salesDetailOperation) => (
                      <Space direction={'vertical'} style={{ width: '100%' }}>
                        {salesDetailFields?.map((salesDetailField, i) => (
                          <div
                            className={styles.formListItemContainer}
                            key={salesDetailField.key}
                          >
                            <div className={styles.formListItemHeader}>
                              <h4>流向{i + 1}</h4>
                              <Popconfirm
                                title={'您确定要删除吗？'}
                                onConfirm={() => {
                                  salesDetailOperation.remove(
                                    salesDetailField.name,
                                  );
                                }}
                              >
                                <Button type={'link'}>删除</Button>
                              </Popconfirm>
                            </div>
                            <Row>
                              <Col span={12}>
                                <FormItem
                                  fieldKey={[
                                    salesDetailField.fieldKey,
                                    'institution',
                                  ]}
                                  name={[salesDetailField.name, 'institution']}
                                  label={'经销商'}
                                  trigger={'onChange'}
                                  rules={[
                                    {
                                      required: true,
                                      message: '请选择或填写经销商',
                                    },
                                  ]}
                                  validateTrigger={['onSelect', 'onChange']}
                                >
                                  <SearchSelect
                                    form={form}
                                    name={[
                                      'data',
                                      appealField.name,
                                      'salesDetails',
                                      salesDetailField.name,
                                      'institution',
                                    ]}
                                    allowinput={true}
                                    searchkey={'name'}
                                    searchurl={'/options/institution-search'}
                                    fieldsProps={{
                                      label: 'name',
                                      value: 'id',
                                    }}
                                  />
                                </FormItem>
                              </Col>

                              <Col span={12}>
                                <FormItem
                                  fieldKey={[
                                    salesDetailField.fieldKey,
                                    'salesDate',
                                  ]}
                                  name={[salesDetailField.name, 'salesDate']}
                                  label={'销售日期'}
                                  rules={[
                                    {
                                      required: true,
                                      message: '请选择销售日期',
                                    },
                                  ]}
                                >
                                  <DatePicker allowClear />
                                </FormItem>
                              </Col>

                              <Col span={12}>
                                <FormItem
                                  fieldKey={[
                                    salesDetailField.fieldKey,
                                    'salesComplaintsNumb',
                                  ]}
                                  name={[
                                    salesDetailField.name,
                                    'salesComplaintsNumb',
                                  ]}
                                  label={'申诉数量'}
                                  rules={[
                                    {
                                      required: true,
                                      message: '请填写申诉数量',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    style={{ width: '100%' }}
                                    onChange={value => {
                                      const data = form.getFieldsValue();
                                      const salesNumTotal =
                                        data?.data[index]?.salesNumTotal;
                                      const salesDetails =
                                        data?.data[index]?.salesDetails;
                                      const salesComplaintsTotal =
                                        salesDetails &&
                                        salesDetails.reduce(
                                          (
                                            a: number,
                                            b: { salesComplaintsNumb: number },
                                          ) => {
                                            return (
                                              a + (b?.salesComplaintsNumb || 0)
                                            );
                                          },
                                          0,
                                        );

                                      form.setFields([
                                        {
                                          name: [
                                            'data',
                                            index,
                                            'salesComplaintsTotal',
                                          ],
                                          value: salesComplaintsTotal,
                                        },
                                        {
                                          name: [
                                            'data',
                                            index,
                                            'salesEstimateTotal',
                                          ],
                                          value:
                                            (salesNumTotal || 0) +
                                            salesComplaintsTotal,
                                        },
                                      ]);
                                    }}
                                  />
                                </FormItem>
                              </Col>

                              <Col span={24}>
                                <FormItem
                                  labelCol={{
                                    span: 3,
                                  }}
                                  wrapperCol={{
                                    span: 20,
                                  }}
                                  fieldKey={[
                                    salesDetailField.fieldKey,
                                    'proveIds',
                                  ]}
                                  name={[salesDetailField.name, 'proveIds']}
                                  label={'申诉证明'}
                                  valuePropName="fileList"
                                  getValueFromEvent={normFile}
                                  rules={[
                                    {
                                      required: true,
                                      message: '请上传申诉证明',
                                    },
                                  ]}
                                >
                                  <Upload
                                    accept={'.jpg, .png'}
                                    action={`${process.env.BASE_FILE_URL}/fileInfo/upload`}
                                    beforeUpload={file => {
                                      if (file.size / 1024 / 1024 > 1) {
                                        message.error('文件必须小于1MB');
                                      }
                                      return file.size / 1024 / 1024 <= 1;
                                    }}
                                    headers={{
                                      'RS-Header-TenantId': userInfo?.tenantId,
                                      'RS-Header-AppId': 'default',
                                    }}
                                    onChange={handleChange}
                                    name={'multipartFile'}
                                    listType="picture-card"
                                    onPreview={file => {
                                      window.open(
                                        `${process.env.BASE_FILE_URL}${file?.response?.data?.requestUrl}`,
                                        '_blank',
                                      );
                                    }}
                                  >
                                    {uploadButton}
                                  </Upload>
                                </FormItem>
                              </Col>

                              <Col span={24}>
                                <FormItem
                                  labelCol={{
                                    span: 3,
                                  }}
                                  wrapperCol={{
                                    span: 20,
                                  }}
                                  fieldKey={[
                                    salesDetailField.fieldKey,
                                    'explain',
                                  ]}
                                  name={[salesDetailField.name, 'explain']}
                                  label={'申诉说明'}
                                >
                                  <Input.TextArea />
                                </FormItem>
                              </Col>
                            </Row>
                          </div>
                        ))}
                        <Button
                          onClick={() => salesDetailOperation.add({})}
                          style={{ marginTop: '10px' }}
                          type={'primary'}
                          ghost
                          icon={<PlusOutlined />}
                        >
                          添加流向
                        </Button>
                      </Space>
                    )}
                  </FormList>
                </Card>
              ))}
              {/*<FooterToolbar>*/}
              {/*  <Button*/}
              {/*    icon={<PlusOutlined />}*/}
              {/*    onClick={() =>*/}
              {/*      appealOperation.add({*/}
              {/*        windowTime,*/}
              {/*        complaintsTypeName: '终端申诉',*/}
              {/*        complaintsType: 1,*/}
              {/*      })*/}
              {/*    }*/}
              {/*    type={'primary'}*/}
              {/*    ghost*/}
              {/*  >*/}
              {/*    添加申诉*/}
              {/*  </Button>*/}
              {/*  <Button*/}
              {/*    type="primary"*/}
              {/*    onClick={() => form?.submit()}*/}
              {/*    loading={loading}*/}
              {/*  >*/}
              {/*    提交*/}
              {/*  </Button>*/}
              {/*</FooterToolbar>*/}
            </Space>
          )}
        </FormList>
      </Form>
    </Card>
  );
};
