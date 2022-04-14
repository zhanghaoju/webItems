import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'hlw_report/pure_terminal_proportion'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'top',
        // }}
      />
    </>
  );
};
