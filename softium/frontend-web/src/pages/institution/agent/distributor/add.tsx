import React, { useImperativeHandle, useState } from 'react';
import { Modal, Form, Input, Row, Col, Spin, Select } from 'antd';
import {
  contractDistributorInsert,
  getDistributorList,
} from '@/services/institution';
import _ from 'lodash';

const AddContractDistributor: React.FC = (props: any) => {
  const [form] = Form.useForm();
  const [baseInfo, setBaseInfo] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [institutionList, setInstitutionList] = useState<any[]>([]);
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const toggleVisible = (bool: boolean = false) => {
    setVisible(bool);
    form.resetFields();
  };

  useImperativeHandle(props.cRef, () => ({
    data: (data: any) => {
      if (data.visible) {
        toggleVisible(data.visible);
      }
      setBaseInfo(data.baseInfo);
    },
  }));

  const submit = () => {
    form.validateFields().then(values => {
      setInitLoading(true);
      contractDistributorInsert({
        distributorCode: values.distributorCode,
        agentId: baseInfo.agentId,
        contractId: baseInfo.contractId,
      })
        .then((res: any) => {
          if (res) {
            const { reloadList } = props;
            toggleVisible(false);
            reloadList && reloadList(res.data);
          }
        })
        .finally(() => {
          setInitLoading(false);
        });
    });
  };

  const fetchUser = (value: string) => {
    if (value.trim()) {
      searchData(value);
    }
  };

  const searchData = _.debounce((value: string) => {
    setFetching(true);
    getDistributorList({ likeField: value, InstitutionCategory: 'Distributor' })
      .then((res: any) => {
        if (res) {
          const data: any[] = res.data.list || [];
          data.forEach((item: any) => {
            item.value = item.code;
          });
          setInstitutionList(data);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, 500);

  const handleChange = (value: string, options: any) => {
    const result: any =
      institutionList.find((item: any) => item.code === options.value) || {};
    form.setFieldsValue({
      distributorId: result.id,
      distributorName: result.name,
      distributorCode: result.code,
      province: result.province,
      city: result.city,
      county: result.county,
      address: result.address,
    });
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      centered
      title={'??????'}
      onCancel={() => toggleVisible()}
      className="modal-width"
      onOk={() => submit()}
      visible={visible}
      confirmLoading={initLoading}
    >
      <div className="modal-height">
        <Form form={form} autoComplete="off">
          <Row>
            <Col span={24}>
              <Form.Item
                {...formItemLayout}
                name="distributorCode"
                label="???????????????"
                rules={[{ required: true, message: '????????????????????????' }]}
              >
                <Select
                  maxTagTextLength={10}
                  showSearch
                  placeholder="????????????????????????"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={fetchUser}
                  onChange={handleChange}
                >
                  {(institutionList || []).map((d: any, index: number) => {
                    return (
                      <Select.Option key={index} value={d.code}>
                        {d.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                {...formItemLayout}
                name="distributorCode"
                label="???????????????"
              >
                <Input disabled={true} placeholder="?????????????????????" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout} name="province" label="??????">
                <Input disabled={true} placeholder="???????????????" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout} name="city" label="??????">
                <Input disabled={true} placeholder="???????????????" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout} name="county" label="??????">
                <Input disabled={true} placeholder="???????????????" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayout} name="address" label="??????">
                <Input disabled={true} placeholder="???????????????" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default AddContractDistributor;
