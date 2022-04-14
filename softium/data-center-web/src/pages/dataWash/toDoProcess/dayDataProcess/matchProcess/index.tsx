// import React, { useEffect, useState } from 'react';
// import { Button, Tabs } from 'antd';
// import InstitutionMatch from '@/pages/toDoProcess/dayDataProcess/matchProcess/institutionMatch';
// import OrganizationMatch from '@/pages/toDoProcess/dayDataProcess/matchProcess/organizationMatch';
// import UnitMatch from '@/pages/toDoProcess/dayDataProcess/matchProcess/unitMatch';
// import ProductMatch from '@/pages/toDoProcess/dayDataProcess/matchProcess/productMatch';
// import storage from '@/utils/storage';

// const { TabPane } = Tabs;

// export default () => {
//   const pageElements = storage.get('pageElements').pageElements;

//   //TODO日数据匹配的权限待完成
//   const institutionMatch = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-2-1-tabA';
//   });
//   const organizationMatch = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-2-1-tabB';
//   });
//   const productMatch = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-2-1-tabC';
//   });
//   const unitMatch = pageElements.filter((item: any, i: any) => {
//     return item.code == '002-2-1-tabD';
//   });

//   return (
//     <Tabs defaultActiveKey="1" type="card">
//       {institutionMatch.length > 0 && (
//         <TabPane tab="经销商匹配" key="1">
//           <InstitutionMatch />
//         </TabPane>
//       )}
//       {organizationMatch.length > 0 && (
//         <TabPane tab="机构匹配" key="2">
//           <OrganizationMatch />
//         </TabPane>
//       )}
//       {productMatch.length > 0 && (
//         <TabPane tab="产品匹配" key="3">
//           <ProductMatch />
//         </TabPane>
//       )}
//       {unitMatch.length > 0 && (
//         <TabPane tab="单位匹配" key="4">
//           <UnitMatch />
//         </TabPane>
//       )}
//     </Tabs>
//   );
// };
