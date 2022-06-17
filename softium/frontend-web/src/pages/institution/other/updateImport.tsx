import React from 'react';
import Import from '@/pages/import';

const UpdateImport: React.FC = (props: any) => {
  const state: any = {
    uploadUrl: '/institution/otherUpdate/import',
    commitUrl: '/institution/otherUpdate/writeFinalResult',
    // extraData: {
    //   category: 'HealthCare',
    // },
    tips: (
      <>
        <div style={{ marginBottom: 15 }}>温馨提⽰：</div>
        <div>
          1）当根据“机构编码”为匹配依据时，导入前和导入后主数据⼀致，不做更新。
        </div>
        <div>2）请检查并确保需要更新的主数据，编码条⽬是唯⼀的，不重复的。</div>
      </>
    ),
  };
  return <Import {...props} state={state} />;
};

export default UpdateImport;
