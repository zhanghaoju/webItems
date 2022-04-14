import React, { useEffect, useState } from 'react';
import { getOptions, getCurrentPeriod } from '../api';

interface AppealPeriod {
  complaintsDataDayNumber?: number;

  feedbackDayNumber?: string;

  salesDataDate?: string | number;

  type?: 0 | 1;
}

export default function useSalesAppealModel() {
  const [pockets, setPockets] = useState<any>();

  const [terminalPeriod, setTerminalPeriod] = useState<AppealPeriod>();
  const [channelPeriod, setChannelPeriod] = useState<AppealPeriod>();

  const updateOptions = () => {
    getOptions().then(res => {
      setPockets(res.data);
    });
  };

  const getCurrentChannelPeriod = () => {
    getCurrentPeriod(0).then(res => {
      setChannelPeriod(res?.data?.channel);
    });
  };

  const getCurrentTerminalPeriod = () => {
    getCurrentPeriod(1).then(res => {
      setTerminalPeriod(res?.data?.terminal);
    });
  };

  useEffect(() => {
    updateOptions();
    getCurrentChannelPeriod();
    getCurrentTerminalPeriod();
  }, []);

  return {
    pockets,
    terminalPeriod,
    channelPeriod,
  };
}
