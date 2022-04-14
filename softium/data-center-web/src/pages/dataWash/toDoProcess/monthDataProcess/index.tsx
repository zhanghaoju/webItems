import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import InstitutionMatch from '@/pages/dataWash/toDoProcess/monthDataProcess/matchProcess/institutionMatch';
import OrganizationMatch from '@/pages/dataWash/toDoProcess/monthDataProcess/matchProcess/organizationMatch';
import UnitMatch from '@/pages/dataWash/toDoProcess/monthDataProcess/matchProcess/unitMatch';
import ProductMatch from '@/pages/dataWash/toDoProcess/monthDataProcess/matchProcess/productMatch';
import DateRuleIntercept from '@/pages/dataWash/toDoProcess/monthDataProcess/interceptProcess/dateRuleIntercept';
import BillRuleIntercept from '@/pages/dataWash/toDoProcess/monthDataProcess/interceptProcess/billRuleIntercept';
import BatchProcess from '@/pages/dataWash/toDoProcess/monthDataProcess/BatchProcess';
import storage from '@/utils/storage';

const { TabPane } = Tabs;

export default (props: any) => {
  const [sourceTabIndex, setSourceTabIndex] = useState('1');

  useEffect(() => {
    setSourceTabIndex(props.location.query.sourceTabIndex);
  }, []);

  const pageElements = storage.get('pageElements').pageElements;
  const institutionMatch = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthInstitutionMatch';
  });
  const organizationMatch = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthOrganizationMatch';
  });
  const productMatch = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthProductMatch';
  });
  const unitMatch = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthUnitMatch';
  });
  const dateRuleIntercept = pageElements.filter((item: any, i: any) => {
    return item.code == 'dateRuleIntercept';
  });
  const billRuleIntercept = pageElements.filter((item: any, i: any) => {
    return item.code == 'billRuleIntercept';
  });
  const batchProcess = pageElements.filter((item: any, i: any) => {
    return item.code == 'monthBatchProcess';
  });

  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
      activeKey={sourceTabIndex}
      onChange={(e: any) => setSourceTabIndex(e)}
      className="fixedHeader"
    >
      {dateRuleIntercept.length > 0 && (
        <TabPane tab="日期规则拦截" key="1">
          <DateRuleIntercept />
        </TabPane>
      )}
      {institutionMatch.length > 0 && (
        <TabPane tab="经销商匹配" key="2">
          <InstitutionMatch />
        </TabPane>
      )}
      {billRuleIntercept.length > 0 && (
        <TabPane tab="打单规则拦截" key="3">
          <BillRuleIntercept />
        </TabPane>
      )}
      {organizationMatch.length > 0 && (
        <TabPane tab="机构匹配" key="4">
          <OrganizationMatch />
        </TabPane>
      )}
      {productMatch.length > 0 && (
        <TabPane tab="产品匹配" key="5">
          <ProductMatch />
        </TabPane>
      )}
      {unitMatch.length > 0 && (
        <TabPane tab="单位匹配" key="6">
          <UnitMatch />
        </TabPane>
      )}
      {batchProcess.length > 0 && (
        <TabPane tab="批号处理" key="7">
          <BatchProcess />
        </TabPane>
      )}
    </Tabs>
  );
};
