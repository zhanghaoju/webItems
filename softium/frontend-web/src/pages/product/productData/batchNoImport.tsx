import React from 'react';
import Import from '@/pages/import';

const ProductBatchNoImport: React.FC = (props: any) => {
  const state: any = {
    uploadUrl: '/product/batchNo/startImport',
    commitUrl: '/product/batchNo/commit',
    tips: '提示：单次批量导入最多支持30000条数据',
  };
  return <Import {...props} state={state} />;
};

export default ProductBatchNoImport;
