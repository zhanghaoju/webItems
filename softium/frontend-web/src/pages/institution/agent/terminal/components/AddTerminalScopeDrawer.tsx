import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Space,
  Button,
  Descriptions,
  Form,
  Select,
  Divider,
  Input,
  TreeSelect,
  Spin,
} from 'antd';
import { AddTerminalScopeProps } from '@/pages/institution/agent/Agent';
import { getAgentQuotaTerritoryTree } from '@/services/agentQuota';
import { ScopeDim } from '@/pages/institution/agent/terminal/enum';
import { getDictionaryBySystemCode } from '@/utils/dataConversion';
import { addAgentLevel } from '@/services/agentScope';
import _ from 'lodash';
import ScopePrimaryComponent from '@/pages/institution/agent/terminal/components/ScopePrimaryComponent';
import { getDistributorList } from '@/services/institution';
import { formItemLayout1, formItemLayout3 } from '@/pages/institution/util';

export default (props: AddTerminalScopeProps) => {
  const { visible, onCancel, onSubmit, agentInfo, scopeDim } = props;
  const [init, setInit] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [levelInfo, setLevelInfo] = useState<any>({});
  const [territoryData, setTerritoryData] = useState<any[]>([]);
  const [distributor, setDistributor] = useState<any[]>([]);

  const [form] = Form.useForm();
  const ref = useRef<any>();

  useEffect(() => {
    getAgentQuotaTerritoryTree().then(res => {
      setTerritoryData(res.data);
    });
    getData();
  }, []);

  const getData = (name: string = '') => {
    getDistributorList({
      likeField: name,
      InstitutionCategory: 'Distributor',
      state: 'Active',
    }).then(res => {
      setDistributor(res.data.list);
    });
  };

  const nextClick = () => {
    form.validateFields().then(value => {
      addAgentLevel({
        ...value,
        institutionTypeDims: _.sortBy(value.institutionTypeDims).join(','),
        scopeDim,
      }).then((res: any) => {
        setInit(true);
        setLevelInfo((state: any) => {
          return {
            ...state,
            ...value,
            levelId: res.data,
            scopeDim,
          };
        });
      });
    });
  };

  const onSubmitClick = () => {
    onSubmit({
      distributorCode: levelInfo.distributorCode,
      scopeList: ref.current.scopeList,
    });
  };

  const transformData = (data: any) => {
    return data.map((item: any) => {
      return (
        (item.children &&
          item.children.length > 0 && {
            ...item,
            title: `${item.name}（${item.staffName || '-'}）`,
            key: item.code,
            children: transformData(item.children),
          }) || {
          ...item,
          title: `${item.name}（${item.staffName || '-'}）`,
          key: item.code,
        }
      );
    });
  };

  const territoryChange = (value: any, label: any, extra: any) => {
    if (value) {
      const {
        triggerNode: { props },
      } = extra;
      setLevelInfo((state: any) => {
        return {
          ...state,
          nodeCode: value,
          referringPeriodId: (value && props.periodId) || null,
          nodeName: (value && props.name) || null,
          nodeStaffName: (value && props.staffName) || null,
        };
      });
    } else {
      setLevelInfo((state: any) => {
        return {
          ...state,
          nodeCode: value,
          referringPeriodId: null,
          nodeName: null,
          nodeStaffName: null,
        };
      });
    }
  };

  const fetchUser = (value: string) => {
    if (value.trim()) {
      getData(value);
    }
  };

  return (
    <>
      <Drawer
        title="添加负责终端"
        visible={visible}
        onClose={onCancel}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={onCancel}>取消</Button>
            {!init && (
              <Button type="primary" onClick={nextClick}>
                下一步
              </Button>
            )}
            {init && (
              <Button type="primary" onClick={onSubmitClick}>
                提交
              </Button>
            )}
          </Space>
        }
        width="70%"
      >
        <Descriptions
          title={
            <div className="agent-detail" style={{ lineHeight: 1 }}>
              <h1>{agentInfo?.name}</h1>
              <span>{agentInfo?.code}</span>
            </div>
          }
        >
          <Descriptions.Item label="协议名称">
            {agentInfo?.contractName}
          </Descriptions.Item>
          <Descriptions.Item label="协议编码">
            {agentInfo?.contractCode}
          </Descriptions.Item>
        </Descriptions>
        <div>
          {!init && (
            <Form form={form} autoComplete="off">
              <Form.Item>
                <h2>
                  <strong>选择维度</strong>
                </h2>
              </Form.Item>
              {scopeDim === ScopeDim.区域 && (
                <Form.Item
                  {...formItemLayout3}
                  name="areaDim"
                  label="区域维度"
                  rules={[
                    {
                      required: true,
                      message: '请选择区域维度',
                    },
                  ]}
                >
                  <Select
                    placeholder="请选择"
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {(getDictionaryBySystemCode('TerritoryAreaDim') || [])
                      .sort((a: any, b: any) => a.sort - b.sort)
                      .map((item: any) => {
                        return (
                          <Select.Option value={item.value} key={item.value}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                {...formItemLayout3}
                name="institutionTypeDims"
                label="机构类型"
                rules={[
                  {
                    required: true,
                    message: '请选择机构类型',
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  mode="multiple"
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {(getDictionaryBySystemCode('InstitutionCategory') || [])
                    .sort((a: any, b: any) => a.sort - b.sort)
                    .map((item: any) => {
                      return (
                        <Select.Option value={item.value} key={item.value}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Form.Item
                {...formItemLayout3}
                name="productLevelDim"
                label="产品层级"
                rules={[
                  {
                    required: true,
                    message: '请选择产品层级',
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {(getDictionaryBySystemCode('ProductLevel') || [])
                    .sort((a: any, b: any) => a.sort - b.sort)
                    .map((item: any) => {
                      return (
                        <Select.Option value={item.value} key={item.value}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Divider orientation="left">
                说明：以下配置将会适用于本次生成的全部规则
              </Divider>
              <Form.Item {...formItemLayout3} name="node" label="辖区">
                <TreeSelect
                  treeData={transformData(territoryData)}
                  placeholder="请选择"
                  allowClear
                  onChange={territoryChange}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                />
              </Form.Item>
              <Form.Item {...formItemLayout3} name="salesMan" label="业务员">
                <Input placeholder="请输入" />
              </Form.Item>
              {scopeDim === 'Institution' && (
                <Form.Item
                  {...formItemLayout3}
                  name="distributorCode"
                  label="配送商"
                  rules={[
                    {
                      required: true,
                      message: '请选择区配送商',
                    },
                  ]}
                >
                  <Select
                    maxTagTextLength={10}
                    showSearch
                    placeholder="请输入配送商名称"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={_.debounce(fetchUser, 500)}
                  >
                    {(distributor || []).map((d: any, index: number) => {
                      return (
                        <Select.Option key={index} value={d.code}>
                          {d.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              )}
            </Form>
          )}
          {init && (
            <ScopePrimaryComponent
              agentInfo={agentInfo}
              levelInfo={levelInfo}
              ref={ref}
            />
          )}
        </div>
      </Drawer>
    </>
  );
};
