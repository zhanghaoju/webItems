import React, { useEffect, useState } from 'react';
import { getOptions, getCurrentQuery } from '../api';
export default function useSalesAppealModel() {
  const [pockets, setPockets] = useState<any>({});
  const [yearList, setYearList] = useState<string[]>([]);
  const [orientationList, setOrientationList] = useState<string[]>([]);

  const updateOptions = () => {
    getOptions().then(res => {
      setPockets(res.data);
    });
  };
  const getCurrentQueryList = () => {
    getCurrentQuery().then(res => {
      setYearList(res?.data?.years);
      setOrientationList(res?.data?.orientations);
    });
  };

  return {
    updateOptions,
    getCurrentQueryList,
    pockets,
    yearList,
    orientationList,
  };
}
