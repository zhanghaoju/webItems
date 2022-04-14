import React from 'react';
import { BatchImport } from '@vulcan/utils';
import request from '@/utils/request';

const Import: React.FC = (props: any) => {
  const {
    uploadUrl,
    fileName,
    extraData,
    commitUrl,
    baseUrl,
    tips,
  } = props?.state;
  return (
    <>
      <BatchImport
        uploadUrl={uploadUrl || ''}
        fileName={fileName || 'file'}
        extraData={extraData || {}}
        requestStatic={request}
        commitUrl={commitUrl}
        downloadResultUrl={process.env.BASE_URL || ''}
        onReturn={() => history.back()}
        baseUrl={baseUrl || process.env.BASE_URL}
        accept={`.xls,.xlsx`}
        downloadType={'request'}
        tips={tips}
      />
    </>
  );
};

export default Import;
