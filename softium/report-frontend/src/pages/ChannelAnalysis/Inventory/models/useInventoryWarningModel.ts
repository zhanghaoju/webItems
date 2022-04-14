import React, { useState } from 'react';
import { getFinancialPeriodsTree } from '../Warning/api';

export default function useInventoryWarning() {
  const [timeWindowTree, setTimeWindowTree] = useState<any[]>([]);

  const updateTimeWindowTree = async () => {
    const res = await getFinancialPeriodsTree();
    setTimeWindowTree(res?.data);
  };

  return {
    timeWindowTree,
    updateTimeWindowTree,
  };
}
