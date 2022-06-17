import React from 'react';
import Import from '@/pages/import';

const InstitutionImport: React.FC = (props: any) => {
  const state: any = {
    uploadUrl: '/institution/healthCare/import',
    commitUrl: '/institution/healthCare/writeFinalResult',
    tips: '提示：单次批量导入最多支持200000条数据',
  };
  return <Import {...props} state={state} />;
};

export default InstitutionImport;
