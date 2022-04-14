import React, { useState } from 'react';
import { BatchImport } from '@vulcan/utils';
import request from '@/utils/request';
import { history } from 'umi';
import { match } from 'react-router';
import { Button } from 'antd';

interface BillPrintImportProps {
  BillPrint: any;
  dispatch: any;
  location: any;
}

const billPrintImport: React.FC<BillPrintImportProps> = props => {
  const {
    location: { state },
  } = props;
  let extraParams = {};
  if (Object.keys(state.periodId).length !== 0) {
    extraParams = { periodId: state.periodId };
  }

  return (
    <>
      <BatchImport
        uploadUrl={'/billPrint/import'}
        fileName={'fileName'}
        extraData={extraParams}
        requestStatic={request}
        downloadType={'request'}
        commitUrl={'/billPrint/import/commit'}
        downloadResultUrl={process.env.BASE_URL || ''}
        onReturn={() => {
          history.goBack();
        }}
        baseUrl={process.env.DATACENTER_URL}
      />
    </>
  );
};

export default billPrintImport;
