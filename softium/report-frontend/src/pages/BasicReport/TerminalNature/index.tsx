import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'terminal_sale/NonTarget_Institution_Sales'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'no',
        // }}
      />
    </>
  );
};
