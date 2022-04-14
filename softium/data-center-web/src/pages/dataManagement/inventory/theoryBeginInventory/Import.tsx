import React, { useState } from 'react';
import { BatchImport } from '@vulcan/utils';
import request from '@/utils/request';
import { history, withRouter } from 'umi';

interface State {
  periodId?: string;
}
const Page2 = withRouter(props => {
  const [state] = useState<State>(props?.location?.state as State);

  return (
    <>
      <BatchImport
        uploadUrl={'/beginTheoryInventory/import'}
        fileName={'fileName'}
        extraData={{ periodId: state?.periodId }}
        commitUrl={'/beginTheoryInventory/import/commit'}
        accept={'.xlsx,.xls'}
        downloadType={'request'}
        downloadResultUrl={process.env.BASE_URL || ''}
        onReturn={() => {
          history.goBack();
        }}
        baseUrl={process.env.DATACENTER_URL}
      />
    </>
  );
});

export default Page2;
