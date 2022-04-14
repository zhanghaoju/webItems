import React, { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { getTemplateList } from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/api';
import { getOptions } from '@/pages/SalesAppeal/api';
import {
  tableDataType,
  TemplateList,
} from '@/pages/TableDataMgmt/SalesTableDataMgmt/TemplateMgmt/data';
import { getDictionaries } from '@/pages/TableDataMgmt/SalesTableDataMgmt/api';
const dictionaryCode = [
  {
    oid: 'HospitalType',
  },
  {
    oid: 'PharmacyType',
  },
  {
    oid: 'AgentType',
  },
  {
    oid: 'OtherType',
  },
  // 'HospitalType',
  // 'PharmacyType',
  // 'AgentType',
  // 'OtherType',
];

export default function useTableDataMgmtModel() {
  const [tempLateList, setTempLateList] = useState<any>();
  // const [tempLateData, setTempLateData] = useState<tableDataType[]>([]);
  const [pockets, setPockets] = useState<any>();
  const [dictionaries, setDictionaries] = useState<any>();
  const dictionaryRequest = useRequest(getDictionaries, {
    manual: true,
    onSuccess: data => {
      const formattedData = data.map((t: any, i: number) => [
        t?.oid,
        t?.dictionaryEntries,
      ]);
      setDictionaries(Object.fromEntries(formattedData));
    },
  });
  const dictionaryOptions = () => {
    getDictionaries(dictionaryCode).then(res => {
      const formattedData = res?.data?.map((t: any, i: number) => [
        t?.oid,
        t?.dictionaryEntries,
      ]);
      setDictionaries(Object.fromEntries(formattedData));
    });
  };

  const updateOptions = () => {
    getOptions().then(res => {
      setPockets(res.data);
    });
  };
  const tempLateListRequest = (data: TemplateList) => {
    getTemplateList(data).then(res => {
      setTempLateList(res.data.list);
    });
  };
  useEffect(() => {
    updateOptions();
    dictionaryOptions();
  }, []);
  return {
    tempLateListRequest,
    tempLateList,
    pockets,
    dictionaries,
  };
}
