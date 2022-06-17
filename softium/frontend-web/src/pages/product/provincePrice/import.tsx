import React from 'react';
import Import from '@/pages/import';

const PriceImport: React.FC = (props: any) => {
  const state: any = {
    uploadUrl: '/provincePrice/startImport',
    commitUrl: '/provincePrice/commit',
    // extraData: {
    //   category: 'HealthCare',
    // },
    tips: '提示：单次批量导入最多支持30000条数据',
  };
  return <Import {...props} state={state} />;
};

export default PriceImport;
