import React from 'react';
import Tableau from '@/components/Tableau';

export default () => {
  return (
    <>
      <Tableau
        tablePath={'grade_board/app_report_full_cur_tery_dim_qta_agg'}
        style={{ width: '100%', height: '100%' }}
        // filter={{
        //   ':toolbar': 'no',
        // }}
      />
    </>
  );
};
