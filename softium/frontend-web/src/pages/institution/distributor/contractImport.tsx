import React from 'react';
import Import from '@/pages/import';

const InstitutionImport: React.FC = (props: any) => {
  const state: any = {
    uploadUrl: '/distributor/contract/content/import',
    commitUrl: '/distributor/contract/content/writeFinalResult',
    tips: '提示：单次批量导入最多支持30000条数据',
  };
  return <Import {...props} state={state} />;
};

export default InstitutionImport;
