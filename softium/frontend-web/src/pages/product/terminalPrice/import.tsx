import React from 'react';
import Import from '@/pages/import';

const InstitutionImport: React.FC = (props: any) => {
  const state: any = {
    uploadUrl: '/terminal/price/start-import',
    commitUrl: '/terminal/price/commit',
    tips: '提示：单次批量导入最多支持200000条数据',
  };
  return <Import {...props} state={state} />;
};

export default InstitutionImport;
