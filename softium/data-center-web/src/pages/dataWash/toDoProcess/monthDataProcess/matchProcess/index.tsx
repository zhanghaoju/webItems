// import React, { useEffect, useState } from 'react';
// import { Button, Tabs } from 'antd';
// import InstitutionMatch from '@/pages/toDoProcess/monthDataProcess/matchProcess/institutionMatch';
// import OrganizationMatch from '@/pages/toDoProcess/monthDataProcess/matchProcess/organizationMatch';
// import UnitMatch from '@/pages/toDoProcess/monthDataProcess/matchProcess/unitMatch';
// import ProductMatch from '@/pages/toDoProcess/monthDataProcess/matchProcess/productMatch';
// import DateRuleIntercept from '@/pages/toDoProcess/monthDataProcess/interceptProcess/dateRuleIntercept';
// import BillRuleIntercept from '@/pages/toDoProcess/monthDataProcess/interceptProcess/billRuleIntercept';
// import storage from '@/utils/storage';

// const { TabPane } = Tabs;

// export default (props: any) => {
//   const [sourceTabIndex, setSourceTabIndex] = useState('1');

//   useEffect(() => {
//     console.log('props', props);
//     setSourceTabIndex(props.location.query.sourceTabIndex);
//   }, []);

//   const pageElements = storage.get('pageElements').pageElements;
//   const institutionMatch = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-1-2-tabA';
//   });
//   const organizationMatch = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-1-2-tabB';
//   });
//   const productMatch = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-1-2-tabC';
//   });
//   const unitMatch = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-1-2-tabD';
//   });
//   const dateRuleInterceptTab = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-1-1-tabA';
//   });
//   const billRuleIntercept = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-1-1-tabB';
//   });

//   return (
//     <Tabs
//       defaultActiveKey="1"
//       type="card"
//       activeKey={sourceTabIndex}
//       onChange={(e: any) => setSourceTabIndex(e)}
//     >
//       {dateRuleInterceptTab.length > 0 && (
//         <TabPane tab="??????????????????" key="1">
//           <DateRuleIntercept />
//         </TabPane>
//       )}
//       {institutionMatch.length > 0 && (
//         <TabPane tab="???????????????" key="2">
//           <InstitutionMatch />
//         </TabPane>
//       )}
//        {billRuleIntercept.length > 0 && (
//         <TabPane tab="??????????????????" key="3">
//           <BillRuleIntercept />
//         </TabPane>
//       )}
//       {organizationMatch.length > 0 && (
//         <TabPane tab="????????????" key="4">
//           <OrganizationMatch />
//         </TabPane>
//       )}
//       {productMatch.length > 0 && (
//         <TabPane tab="????????????" key="5">
//           <ProductMatch />
//         </TabPane>
//       )}
//       {unitMatch.length > 0 && (
//         <TabPane tab="????????????" key="6">
//           <UnitMatch />
//         </TabPane>
//       )}
//     </Tabs>
//   );
// };
