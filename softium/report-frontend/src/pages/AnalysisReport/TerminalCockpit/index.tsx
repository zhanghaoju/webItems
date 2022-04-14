import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  console.log('dhfjsof');
  return (
    <>
      <Tableau
        tablePath={'terminal_system/Terminal_Dashboard'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'top',
        // }}
      />
    </>
  );
};
