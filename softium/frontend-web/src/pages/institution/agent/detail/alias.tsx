import React from 'react';
import Alias from '@/pages/institution/detail/alias';
import { useAuth } from '@vulcan/utils';

const AgentAlias: React.FC = (props: any) => {
  const { id } = props?.match?.params;
  const agentAliasAdd = useAuth('agentAliasAdd');
  const agentAliasDel = useAuth('agentAliasDel');
  const params: any = {
    auth: {
      add: agentAliasAdd,
      del: agentAliasDel,
    },
    record: {
      id: id,
    },
  };
  return (
    <div>
      <Alias params={{ ...params }} />
    </div>
  );
};

export default AgentAlias;
