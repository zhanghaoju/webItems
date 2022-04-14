import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'liuchang_report/liuchang_terminal_purchase'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'top',
        // }}
      />
    </>
  );
};
