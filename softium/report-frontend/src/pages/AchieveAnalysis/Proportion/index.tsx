import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'hlw_report/pure_sale_dashboard'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'top',
        // }}
      />
    </>
  );
};
