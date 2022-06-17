import React from 'react';
import Import from '@/pages/import';

const LevelImport: React.FC = (props: any) => {
  const state: any = {
    uploadUrl: '/institution/distributor/level/import',
    commitUrl: '/institution/distributor/level/writeFinalResult',
    tips: '提示：单次批量导入最多支持30000条数据',
  };
  return <Import {...props} state={state} />;
};

export default LevelImport;
