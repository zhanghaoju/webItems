import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'terminal_sale/app_report_target_terminal_without_sale'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'top',
        // }}
      />
    </>
  );
};
