import React, { useState, useEffect } from 'react';
import { BatchImport } from '@vulcan/utils';
import request from '@/utils/request';
import { Steps, Button, Form, Select, Space } from 'antd';
import './styles/import.less';
import { getPeriodYears } from '@/services/period';

const AgentIndImport = (props: any) => {
  const [current, setCurrent] = useState(0);
  const [years, setYears] = useState([]);
  const [importParams, setImportParams] = useState({});

  const {
    location: { query },
  } = props;

  const regionUrls = {
    uploadUrl: '/agentQuota/scopeQuota/import',
    commitUrl: '/agentQuota/scopeQuota/writeFinalResult',
  };

  const institutionUrls = {
    uploadUrl: '/agentQuota/institutionQuota/import',
    commitUrl: '/agentQuota/institutionQuota/writeFinalResult',
  };

  useEffect(() => {
    getPeriodYears().then((res: any) => {
      setYears(res.data);
    });
  }, []);

  const [form] = Form.useForm();

  const steps = [
    {
      title: '导入信息选择',
    },
    {
      title: '导入',
    },
  ];

  const nextClick = () => {
    form.validateFields().then(values => {
      const {
        match: { params },
      } = props;
      setCurrent(value => value + 1);
      setImportParams({
        ...values,
        contractId: params.id,
      });
    });
  };

  return (
    <>
      <div className="institution-detail-tabs">
        <Steps current={current}>
          {steps.map((item: any) => (
            <Steps.Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="agent-ida-content">
          {current === 0 && (
            <Form
              form={form}
              wrapperCol={{ span: 8 }}
              labelCol={{ span: 4 }}
              autoComplete="off"
            >
              <Form.Item
                label="选择财年"
                name="financialYearId"
                rules={[
                  {
                    required: true,
                    message: '请选择财年',
                  },
                ]}
              >
                <Select placeholder="请选择">
                  {years.map((item: any) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.financialYear}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="指标项目"
                name="quotaCode"
                rules={[
                  {
                    required: true,
                    message: '请选择指标项目',
                  },
                ]}
              >
                <Select placeholder="请选择">
                  <Select.Option value="sales">销售指标</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          )}
          {current === 1 && (
            <BatchImport
              requestStatic={request}
              uploadUrl={
                query.region ? regionUrls.uploadUrl : institutionUrls.uploadUrl
              }
              commitUrl={
                query.region ? regionUrls.commitUrl : institutionUrls.commitUrl
              }
              fileName="file"
              onReturn={() => history.back()}
              extraData={{
                ...importParams,
              }}
              accept={`.xls,.xlsx`}
              downloadResultUrl={process.env.BASE_URL || ''}
              baseUrl={process.env.BASE_URL}
              downloadType={'request'}
            />
          )}
        </div>
        <div className="agent-ida-footer-button">
          <Space>
            {current === 0 ? (
              <Button type="primary" onClick={nextClick}>
                下一步
              </Button>
            ) : (
              <Button type="primary" onClick={() => setCurrent(0)}>
                上一步
              </Button>
            )}
            <Button onClick={() => history.back()}>返回</Button>
          </Space>
        </div>
      </div>
    </>
  );
};

export default AgentIndImport;
