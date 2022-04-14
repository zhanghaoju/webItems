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
        uploadUrl={'/beginInventroy/import'}
        fileName={'fileName'}
        extraData={{ periodId: state?.periodId }}
        // requestStatic={request}
        commitUrl={'/beginInventroy/import/commit'}
        accept={'.xlsx,.xls'}
        downloadResultUrl={process.env.BASE_FILE_URL || ''}
        onReturn={() => {
          history.goBack();
        }}
        baseUrl={process.env.REPORT_URL}
      />
    </>
  );
});

export default Page2;
