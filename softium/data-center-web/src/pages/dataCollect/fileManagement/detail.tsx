import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import { history } from 'umi';
import { match } from 'react-router';
// import SaleOriginal from './originalData/saleOriginal'
// import PurchaseOriginal from './originalData/purchaseOriginal';
// import InventoryOriginal from './originalData/inventoryOriginal'
// import SaleInspect from './inspectData/saleInspect'
// import PurchaseInspect from './inspectData/purchaseInspect';
// import InventoryInspect from './inspectData/inventoryInspect'
import CommonListPage from './commonListPage';

const { TabPane } = Tabs;

interface ParamsProps {
  id: string;
  businessDesc: string;
}

interface OriginalDetailProps {
  match: match<ParamsProps>;
  source: any;
}

const OriginalDetail = (props: OriginalDetailProps) => {
  return (
    <Tabs defaultActiveKey="1" type="card">
      <TabPane tab="原始数据" key="1">
        <CommonListPage {...props} source={1} />
      </TabPane>
      <TabPane tab="核查数据" key="2">
        <CommonListPage {...props} source={2} />
      </TabPane>
      <TabPane tab="交付数据" key="3">
        <CommonListPage {...props} source={3} />
      </TabPane>
    </Tabs>
  );
};

export default OriginalDetail;
