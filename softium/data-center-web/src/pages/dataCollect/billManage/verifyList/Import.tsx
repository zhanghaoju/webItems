import React from 'react';
import { BatchImport } from '@vulcan/utils';
import request from '@/utils/request';
import { history } from 'umi';
import { Button } from 'antd';

const Page2: React.FC<{}> = props => {
  return (
    <>
      <BatchImport
        uploadUrl={'/verify-poll/import'}
        fileName={'fileName'}
        extraData={{ module: 'test' }}
        requestStatic={request}
        downloadType={'request'}
        commitUrl={'/verify-poll/import/commit'}
        downloadResultUrl={process.env.BASE_URL || ''}
        onReturn={() => {
          history.goBack();
        }}
        baseUrl={process.env.DATACENTER_URL}
      />
    </>
  );
};

export default Page2;
