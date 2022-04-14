import React, { useEffect, useState } from 'react';
import { getAgentDetailByContractId } from '@/services/agentScope';
import { AgentInfoProps } from '@/pages/institution/agent/Agent';
import { Tabs, Descriptions, Button } from 'antd';
import RegionScopeComponent from '@/pages/institution/agent/terminal/components/RegionScopeComponent';
import InstitutionScopeComponent from '@/pages/institution/agent/terminal/components/InstitutionScopeComponent';
import { history } from '@@/core/history';

export default (props: any) => {
  const {
    match: { params },
    location: { query },
  } = props;
  const [agentInfo, setAgentInfo] = useState<AgentInfoProps>({});

  useEffect(() => {
    getAgentDetailByContractId({
      contractId: params.id,
    }).then((res: any) => {
      setAgentInfo(res.data);
    });
  }, []);

  return (
    <>
      {(!query.import && (
        <div className="institution-detail-tabs">
          <Descriptions
            title={
              <div className="agent-detail">
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
          <Tabs defaultActiveKey="region" destroyInactiveTabPane>
            <Tabs.TabPane tab="区域" key="region">
              <RegionScopeComponent
                agentInfo={agentInfo}
                contractId={params.id}
                {...props}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="机构" key="institution">
              <InstitutionScopeComponent
                agentInfo={agentInfo}
                contractId={params.id}
                {...props}
              />
            </Tabs.TabPane>
          </Tabs>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button
              onClick={() => {
                const { institutionId } = props.location.state;
                history.push({
                  pathname: `/institution/agent/detail/${institutionId}`,
                  state: {
                    key: '3',
                  },
                });
              }}
            >
              返回
            </Button>
          </div>
        </div>
      )) ||
        props.children}
    </>
  );
};
