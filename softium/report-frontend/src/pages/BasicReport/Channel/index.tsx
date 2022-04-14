import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'channel_sales/Target_Channel_Sales'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'no',
        // }}
      />
    </>
  );
};
