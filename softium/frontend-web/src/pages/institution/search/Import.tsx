import React from 'react';
import Import from '@/pages/import';

export default (props: any) => {
  const {
    location: {
      query: { type },
    },
  } = props;

  const state: any =
    type === 'code'
      ? {
          uploadUrl: '/institution/industryCode/import',
          commitUrl: '/institution/industryCode/writeFinalResult',
          tips: '提示：单次批量导入最多支持200000条数据',
        }
      : type === 'institution'
      ? {
          uploadUrl: '/institution/institutionAll/import',
          commitUrl: '/institution/institutionAll/writeFinalResult',
          tips: '提示：单次批量导入最多支持200000条数据',
        }
      : {};

  return <Import {...props} state={state} />;
};
