import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import InstitutionMatch from '@/pages/dataWash/toDoProcess/dayDataProcess/matchProcess/institutionMatch';
import OrganizationMatch from '@/pages/dataWash/toDoProcess/dayDataProcess/matchProcess/organizationMatch';
import UnitMatch from '@/pages/dataWash/toDoProcess/dayDataProcess/matchProcess/unitMatch';
import ProductMatch from '@/pages/dataWash/toDoProcess/dayDataProcess/matchProcess/productMatch';
import BatchProcess from '@/pages/dataWash/toDoProcess/dayDataProcess/BatchProcess';
import storage from '@/utils/storage';

const { TabPane } = Tabs;

export default (props: any) => {
  const [sourceTabIndex, setSourceTabIndex] = useState('1');

  useEffect(() => {
    setSourceTabIndex(props.location.query.sourceTabIndex);
  }, []);
  const pageElements = storage.get('pageElements').pageElements;

  //TODO日数据匹配的权限待完成
  const institutionMatch = pageElements.filter((item: any, i: any) => {
    return item.code == '002-2-1-tabA';
  });
  const organizationMatch = pageElements.filter((item: any, i: any) => {
    return item.code == '002-2-1-tabB';
  });
  const productMatch = pageElements.filter((item: any, i: any) => {
    return item.code == '002-2-1-tabC';
  });
  const unitMatch = pageElements.filter((item: any, i: any) => {
    return item.code == '002-2-1-tabD';
  });
  const batchProcess = pageElements.filter((item: any, i: any) => {
    return item.code == '002-2-1-tabE';
  });

  return (
    <Tabs
      defaultActiveKey="1"
      activeKey={sourceTabIndex}
      onChange={(e: any) => setSourceTabIndex(e)}
      type="card"
      className="fixedHeader"
    >
      {/* {institutionMatch.length > 0 && ( */}
      <TabPane tab="经销商匹配" key="1">
        <InstitutionMatch />
      </TabPane>
      // )}
      {/* {organizationMatch.length > 0 && ( */}
      <TabPane tab="机构匹配" key="2">
        <OrganizationMatch />
      </TabPane>
      // )}
      {/* {productMatch.length > 0 && ( */}
      <TabPane tab="产品匹配" key="3">
        <ProductMatch />
      </TabPane>
      // )}
      {/* {unitMatch.length > 0 && ( */}
      <TabPane tab="单位匹配" key="4">
        <UnitMatch />
      </TabPane>
      // )}
      {/*{batchProcess.length > 0 && (*/}
      {/*  <TabPane tab="批号处理" key="5">*/}
      {/*    <BatchProcess />*/}
      {/*  </TabPane>*/}
      {/*)}*/}
    </Tabs>
  );
};
