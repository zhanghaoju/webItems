import React from 'react';
import { BatchImport } from '@vulcan/utils';
import { history, withRouter } from 'umi';

const Page2 = withRouter(props => {
  return (
    <>
      <BatchImport
        uploadUrl={'/defectInstProd/import'}
        fileName={'fileName'}
        commitUrl={'/defectInstProd/import/commit'}
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
