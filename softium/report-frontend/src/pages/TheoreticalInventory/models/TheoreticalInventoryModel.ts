import { useState } from 'react';
import { periodList as getPeriodList, getNextAchivePeriod } from '../api';

export interface PeriodBO {
  id?: string;

  name?: string;
}

export default function useTheoreticalInventoryModel() {
  const [periodList, setPeriodList] = useState<PeriodBO[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodBO>();

  const updateData = async () => {
    const periodListRes = await getPeriodList();
    const currentRes = await getNextAchivePeriod();
    setPeriodList(periodListRes?.data);
    setCurrentPeriod(currentRes?.data);
  };

  return {
    periodList,
    currentPeriod,
    updateData,
  };
}
