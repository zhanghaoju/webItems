import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'channel_through/channel_through_sum'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'top',
        // }}
      />
    </>
  );
};
