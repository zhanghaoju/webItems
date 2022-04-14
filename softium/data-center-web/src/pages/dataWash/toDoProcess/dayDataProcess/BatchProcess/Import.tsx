import React, { useEffect, useState } from 'react';
import { BatchImport } from '@vulcan/utils';
import request from '@/utils/request';
import { history } from 'umi';

interface BatchProcessImportProps {
  BatchProcessImport: any;
  dispatch: any;
  location: any;
}

const BatchProcessImport: React.FC<BatchProcessImportProps> = props => {
  const {
    location: { query },
  } = props;
  let extraParams = { businessType: '' };
  if (Object.keys(query.businessType).length !== 0) {
    extraParams.businessType = query.businessType;
  }

  const [sourceTabIndex, setSourceTabIndex] = useState('');
  const [sourcePage, setSourcePage] = useState('');

  useEffect(() => {
    setSourceTabIndex(props.location.query.sourceTabIndex);
    setSourcePage(props.location.query.sourcePage);
    console.log(sourcePage);
    console.log(props);
  }, []);

  return (
    <>
      <BatchImport
        uploadUrl={'/productBatch/import '}
        fileName={'fileName'}
        extraData={extraParams}
        requestStatic={request}
        downloadType={'request'}
        commitUrl={'/productBatch/import/commit'}
        downloadResultUrl={process.env.BASE_URL || ''}
        onReturn={() => {
          history.push(sourcePage + '?sourceTabIndex=' + sourceTabIndex);
        }}
        baseUrl={process.env.DATACENTER_URL}
      />
    </>
  );
};

export default BatchProcessImport;
