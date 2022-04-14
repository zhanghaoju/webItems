import React, { useState } from 'react';
import { BatchImport } from '@vulcan/utils';
import request from '@/utils/request';
import { history, withRouter } from 'umi';

const Page2 = withRouter(props => {
  return (
    <>
      <BatchImport
        uploadUrl={'/inventoryWarningConfig/upload'}
        fileName={'fileName'}
        requestStatic={request}
        commitUrl={'/inventoryWarningConfig/import/commit'}
        accept={'.xlsx,.xls'}
        downloadResultUrl={process.env.BASE_FILE_URL || ''}
        onReturn={() => {
          history.goBack();
        }}
        // baseUrl={process.env.REPORT_URL}
      />
    </>
  );
});

export default Page2;
