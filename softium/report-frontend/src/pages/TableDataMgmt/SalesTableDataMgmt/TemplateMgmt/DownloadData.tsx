import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Modal, Form, Button, Select, Radio, DatePicker } from 'antd';
import { history } from 'umi';
import { useModel } from '@@/plugin-model/useModel';
import { TerminalListQuery } from '@/pages/TableDataMgmt/SalesTableDataMgmt/data';
import { useRequest } from 'ahooks';
import { downloadData } from '@/pages/TableDataMgmt/SalesTableDataMgmt/api';
import { VulcanFile } from '@vulcan/utils';

const { RangePicker } = DatePicker;
const { Option } = Select;
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const rangeConfig = {
  rules: [
    { type: 'array' as const, required: true, message: 'Please select time!' },
  ],
};
interface DownloadDataProps {
  query?: TerminalListQuery;
  type?: 'channel' | 'terminal';
}
const DownloadData: React.FC<DownloadDataProps> = ({ type, query }) => {
  const downloadDataRequest = useRequest(downloadData, {
    manual: true,
    formatResult: res => res,
    onSuccess: res => {
      let url = process.env.BASE_FILE_URL + res?.data?.requestUrl;
      VulcanFile.downloadFromExtenalUrl({ url: url });
      // VulcanFile.export(res.data);
      setVisible(false);
    },
  });
  const { tempLateListRequest, tempLateList, pockets } = useModel(
    'TableDataMgmt.SalesTableDataMgmt.useTableDataMgmtModel',
  );

  const { windowTimeOption } = pockets || {};

  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    tempLateListRequest({});
  }, []);

  const show = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleSubmit = async () => {
    const values = await form?.validateFields();
    let queryData = { ...query, ...values };
    downloadDataRequest.run(queryData);
  };
  let initPeriodId =
    windowTimeOption && windowTimeOption[0] && windowTimeOption[0].value;
  return (
    <>
      <Button type={'primary'} onClick={show}>
        下载数据
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        destroyOnClose={true}
        title={'下载数据'}
        confirmLoading={downloadDataRequest.loading}
        onOk={handleSubmit}
      >
        <Form form={form} {...formLayout}>
          <Form.Item
            name="templateId"
            label="选择模板"
            hasFeedback
            rules={[{ required: true, message: '请选择下载模板' }]}
          >
            <Select placeholder="请选择下载模板">
              {tempLateList &&
                tempLateList.map(
                  (item: {
                    id: string | number | undefined;
                    templateName: React.ReactNode;
                  }) => {
                    return (
                      <Option key={item.id} value={item.id as string}>
                        {item.templateName}
                      </Option>
                    );
                  },
                )}
            </Select>
          </Form.Item>
          <Form.Item
            name="periodId"
            label="销售年月"
            hasFeedback
            initialValue={query?.periodId ? query?.periodId : initPeriodId}
            rules={[{ required: true, message: '请选择销售年月!' }]}
          >
            <Select placeholder="请选择销售年月">
              {windowTimeOption?.map((t: { text: any; value: any }) => (
                <Option key={t?.value} value={t?.value}>
                  {t?.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {type === 'terminal' ? (
            <Form.Item
              name={'toInstAffiliation'}
              label="机构挂靠"
              initialValue={
                query?.toInstAffiliation ? query?.toInstAffiliation : 0
              }
            >
              <Radio.Group>
                <Radio value={0}>挂靠前</Radio>
                <Radio value={1}>挂靠后</Radio>
              </Radio.Group>
            </Form.Item>
          ) : (
            <Form.Item
              name={'fromInstAffiliation'}
              label="机构挂靠"
              initialValue={
                query?.fromInstAffiliation ? query?.fromInstAffiliation : 0
              }
            >
              <Radio.Group>
                <Radio value={0}>挂靠前</Radio>
                <Radio value={1}>挂靠后</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          <Form.Item
            name="prodAffiliation"
            label="产品挂靠"
            initialValue={query?.prodAffiliation ? query?.prodAffiliation : 0}
          >
            <Radio.Group>
              <Radio value={0}>挂靠前</Radio>
              <Radio value={1}>挂靠后</Radio>
            </Radio.Group>
          </Form.Item>
          {/*<Form.Item*/}
          {/*  name="select1"*/}
          {/*  label="辖区类型"*/}
          {/*  hasFeedback*/}
          {/*  rules={[{ required: true, message: '!' }]}*/}
          {/*>*/}
          {/*  <Select placeholder="请选择辖区类型">*/}
          {/*    <Option value="china">销售-直营</Option>*/}
          {/*    <Option value="usa">销售-推广</Option>*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*  name="teryNodeLevel"*/}
          {/*  label="辖区层级"*/}
          {/*  hasFeedback*/}
          {/*  rules={[{ message: '请选择辖区层级!' }]}*/}
          {/*>*/}
          {/*  <Select placeholder="请选择辖区">*/}
          {/*    <Option value="china">大区</Option>*/}
          {/*    <Option value="usa">办事处</Option>*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}
          <Form.Item name="isWatermark" label="是否添加水印" initialValue={0}>
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DownloadData;
