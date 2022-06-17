import React from 'react';
import Import from '@/pages/import';

const AliasImport: React.FC = (props: any) => {
  const state: any = {
    uploadUrl: '/institution/alias/import',
    commitUrl: '/institution/alias/writeFinalResult',
    extraData: {
      category: 'Pharmacy',
    },
    tips: '提示：单次批量导入最多支持30000条数据',
  };
  return <Import {...props} state={state} />;
};

export default AliasImport;
