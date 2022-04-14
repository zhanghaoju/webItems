import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'yifan_report/agt_new_develop'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'no',
        // }}
      />
    </>
  );
};
