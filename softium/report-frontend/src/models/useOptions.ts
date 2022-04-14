import { useEffect, useState } from 'react';
import { getOptions } from '@/services/global';

export default function useOptions() {
  const [pockets, setPockets] = useState<any>([]);

  const updateOptions = async () => {
    const res = await getOptions();
    setPockets(res?.data);
  };

  useEffect(() => {
    updateOptions();
  }, []);

  return {
    pockets,
    updateOptions,
  };
}
