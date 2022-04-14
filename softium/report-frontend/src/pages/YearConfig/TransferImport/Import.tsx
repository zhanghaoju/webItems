import React, { useState } from 'react';
import { BatchImport } from '@vulcan/utils';
import { history, withRouter } from 'umi';

interface State {
  periodId?: string;
  periodName?: string;
}
const Page2 = withRouter(props => {
  const [state] = useState<State>(props?.location?.state as State);
  return (
    <>
      <BatchImport
        uploadUrl={'/allocation/import '}
        fileName={'fileName'}
        extraData={state}
        // requestStatic={request}
        commitUrl={'/allocation/import/commit'}
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
