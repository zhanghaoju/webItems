import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import '../../styles/institutionInfo.less';
import BaseInfo from '@/pages/institution/agent/detail/baseInfo';
import Alias from '@/pages/institution/agent/detail/alias';
import AgentContractList from '@/pages/institution/agent/contract/contract';
const { TabPane } = Tabs;

interface BaseInfoData {
  name?: string;
  code?: string;
  id?: string;
}

const Index: React.FC = (props: any) => {
  const [baseInfo, setBaseInfo] = useState<BaseInfoData>({});

  return (
    <>
      {(!props.location.query.terminal && (
        <div className="institution-detail-tabs">
          <div className="agent-detail">
            <h2>{baseInfo.name}</h2>
            <span>{baseInfo.code}</span>
          </div>
          <Tabs defaultActiveKey={props.location.state.key || '1'}>
            <TabPane tab="基础信息" key="1">
              <BaseInfo {...props} setBaseInfo={setBaseInfo} />
            </TabPane>
            <TabPane tab="别名" key="2">
              <Alias {...props} />
            </TabPane>
            <TabPane tab="协议" key="3">
              <AgentContractList {...props} baseInfo={baseInfo} />
            </TabPane>
          </Tabs>
        </div>
      )) ||
        props.children}
    </>
  );
};

export default Index;
