import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import DateRuleIntercept from '@/pages/toDoProcess/monthDataProcess/interceptProcess/dateRuleIntercept';
import BillRuleIntercept from '@/pages/toDoProcess/monthDataProcess/interceptProcess/billRuleIntercept';
import storage from '@/utils/storage';
import { withRouter } from 'react-router-dom';

const { TabPane } = Tabs;

export default (props: any) => {
  const [sourceTabIndex, setSourceTabIndex] = useState('1');

  useEffect(() => {
    setSourceTabIndex(props.location.query.sourceTabIndex);
  }, []);

  const pageElements = storage.get('pageElements').pageElements;
  const dateRuleInterceptTab = pageElements.filter((item: any, i: any) => {
    return item.code == '002-1-1-tabA';
  });
  const billRuleIntercept = pageElements.filter((item: any, i: any) => {
    return item.code == '002-1-1-tabB';
  });

  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
      activeKey={sourceTabIndex}
      onChange={(e: any) => setSourceTabIndex(e)}
    >
      {dateRuleInterceptTab.length > 0 && (
        <TabPane tab="日期规则拦截" key="1">
          <DateRuleIntercept />
        </TabPane>
      )}
      {billRuleIntercept.length > 0 && (
        <TabPane tab="打单规则拦截" key="2">
          <BillRuleIntercept />
        </TabPane>
      )}
    </Tabs>
  );
};
