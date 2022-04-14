import React, { useEffect, useState } from 'react';
import { TimeWindow } from '@/pages/YearConfig/OpeningInventory/data';
import { fetchAll } from '@/pages/YearConfig/OpeningInventory/api';

export default function useTimeWindowOption() {
  const [timeWindowOption, setTimeWindowOption] = useState<TimeWindow[]>([]);

  const updateTimeWindowOption = async () => {
    const res = await fetchAll();
    setTimeWindowOption(res?.data);
  };

  useEffect(() => {
    updateTimeWindowOption();
  }, []);

  return {
    timeWindowOption,
    updateTimeWindowOption,
  };
}
