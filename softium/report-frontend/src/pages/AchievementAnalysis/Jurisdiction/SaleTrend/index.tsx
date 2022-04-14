import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'grade_board/qta_agg_trend'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'no',
        // }}
      />
    </>
  );
};
